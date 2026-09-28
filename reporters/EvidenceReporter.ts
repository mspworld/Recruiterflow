import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

interface Options {
  outputDir?: string;
}

interface StepShot {
  title: string;
  file: string;
}

interface ApiCall {
  title: string;
  status: number | string;
  file: string;
  json: string;
}

interface Entry {
  order: string;
  project: string;
  title: string;
  status: TestResult['status'];
  durationMs: number;
  steps: string[];
  folder: string;
  shots: StepShot[];
  apiCalls: ApiCall[];
  video?: string;
  gif?: string;
  trace?: string;
  failureShot?: string;
}

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
    .replace(/-$/, '');

const hasFfmpeg = (): boolean => spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;

function collectStepTitles(steps: TestStep[]): string[] {
  return steps.flatMap((step) => (step.category === 'test.step' ? [step.title] : collectStepTitles(step.steps)));
}

class EvidenceReporter implements Reporter {
  private readonly outputDir: string;
  private readonly makeGifs = hasFfmpeg();
  private readonly entries = new Map<string, Entry>();

  constructor(options: Options = {}) {
    this.outputDir = options.outputDir ?? 'evidence';
  }

  onBegin(_config: FullConfig, suite: Suite): void {
    for (const projectSuite of suite.suites) {
      const project = projectSuite.project()?.name;
      if (project) fs.rmSync(path.join(this.outputDir, project), { recursive: true, force: true });
    }
    fs.mkdirSync(this.outputDir, { recursive: true });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status === 'skipped') return;

    const project = test.parent.project()?.name ?? 'other';
    const title = test.titlePath().slice(-2).join(' › ');
    const folder = path.join(project, `${slugify(title)}-${test.id.slice(0, 6)}`);
    const absoluteFolder = path.join(this.outputDir, folder);
    fs.rmSync(absoluteFolder, { recursive: true, force: true });
    fs.mkdirSync(absoluteFolder, { recursive: true });

    const entry: Entry = {
      order: `${test.location.file}:${String(test.location.line).padStart(5, '0')}`,
      project,
      title,
      status: result.status,
      durationMs: result.duration,
      steps: collectStepTitles(result.steps),
      folder,
      shots: [],
      apiCalls: [],
    };

    for (const attachment of result.attachments) {
      const save = (fileName: string): string => {
        const target = path.join(absoluteFolder, fileName);
        if (attachment.body) fs.writeFileSync(target, attachment.body);
        else if (attachment.path) fs.copyFileSync(attachment.path, target);
        return path.join(folder, fileName);
      };

      if (attachment.name.startsWith('step: ')) {
        const number = String(entry.shots.length + 1).padStart(2, '0');
        const stepTitle = attachment.name.slice('step: '.length);
        entry.shots.push({ title: stepTitle, file: save(`${number}-${slugify(stepTitle)}.png`) });
      } else if (attachment.name === 'video' && attachment.path) {
        entry.video = save('video.webm');
        entry.gif = this.toGif(path.join(this.outputDir, entry.video), folder);
      } else if (attachment.name === 'trace' && attachment.path) {
        entry.trace = save('trace.zip');
      } else if (attachment.name === 'screenshot' && result.status !== 'passed') {
        entry.failureShot = save('failure.png');
      } else if (attachment.contentType === 'application/json' && attachment.body && attachment.name !== 'scenario-data') {
        const json = attachment.body.toString();
        const number = String(entry.apiCalls.length + 1).padStart(2, '0');
        const status = JSON.parse(json).response?.status ?? 'error';
        entry.apiCalls.push({ title: attachment.name, status, json, file: save(`${number}-${slugify(attachment.name)}.json`) });
      }
    }

    this.entries.set(test.id, entry);
  }

  onEnd(result: FullResult): void {
    fs.writeFileSync(path.join(this.outputDir, 'README.md'), this.buildIndex(result));
  }

  private toGif(videoPath: string, folder: string): string | undefined {
    if (!this.makeGifs) return undefined;
    const gifPath = path.join(path.dirname(videoPath), 'preview.gif');
    const filter = 'fps=5,scale=560:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse';
    const run = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', videoPath, '-vf', filter, gifPath]);
    return run.status === 0 ? path.join(folder, 'preview.gif') : undefined;
  }

  private buildIndex(result: FullResult): string {
    const entries = [...this.entries.values()].sort((a, b) => a.order.localeCompare(b.order));
    const passed = entries.filter((entry) => entry.status === 'passed').length;
    const link = (file: string) => file.split(path.sep).join('/');
    const icon = (entry: Entry) => (entry.status === 'passed' ? '✅' : '❌');
    const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

    const lines: string[] = [
      '# Test evidence',
      '',
      `Recorded with \`npm run test:evidence\` on ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC.`,
      '',
      `**Result:** ${passed} of ${entries.length} tests passed (run status: \`${result.status}\`).`,
      '',
      '- **UI tests:** preview GIF, full video, a screenshot after every step, and a trace that replays every click and keystroke. Open `trace.zip` at [trace.playwright.dev](https://trace.playwright.dev) or with `npx playwright show-trace <file>`.',
      '- **API tests:** the steps, plus the full request and response of every call.',
      '',
    ];

    for (const project of ['ui', 'api']) {
      const group = entries.filter((entry) => entry.project === project);
      if (group.length === 0) continue;
      lines.push(`## ${project.toUpperCase()} tests`, '');

      for (const entry of group) {
        const links = [
          `\`${seconds(entry.durationMs)}\``,
          entry.video && `[Video](${link(entry.video)})`,
          entry.trace && `[Trace](${link(entry.trace)})`,
        ].filter(Boolean);

        lines.push(`### ${icon(entry)} ${entry.title}`, '', links.join(' · '), '');
        if (entry.gif) lines.push(`<img src="${link(entry.gif)}" width="560" alt="Recording of ${entry.title}">`, '');
        if (entry.failureShot) lines.push(`**Failure screenshot:**`, '', `<img src="${link(entry.failureShot)}" width="560">`, '');

        if (entry.shots.length > 0) {
          lines.push('| # | Step | Screenshot after the step |', '|---|---|---|');
          entry.shots.forEach((shot, index) =>
            lines.push(`| ${index + 1} | ${shot.title} | <img src="${link(shot.file)}" width="320"> |`),
          );
          lines.push('');
        } else if (entry.steps.length > 0) {
          entry.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
          lines.push('');
        }

        for (const call of entry.apiCalls) {
          lines.push(
            `<details><summary><code>${call.title}</code> → ${call.status}</summary>`,
            '',
            '```json',
            call.json,
            '```',
            '',
            '</details>',
            '',
          );
        }
      }
    }

    return lines.join('\n');
  }
}

export default EvidenceReporter;
