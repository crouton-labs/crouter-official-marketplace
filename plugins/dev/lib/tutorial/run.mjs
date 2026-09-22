import { lessonsFor, tableOfContents } from './lessons.mjs';

export class TutorialError extends Error {
  constructor(code, message, next) {
    super(message);
    this.code = code;
    this.next = next;
  }
}

const TEACHING_CONTRACT = [
  'Teach this conversationally, in your own words — do not paste this lesson at the user.',
  'Ask before you change anything on their machine, and show the exact diff you propose.',
  'Let the user actually try each thing and confirm it worked before you move on.',
].join(' ');

export function runTrack(input) {
  const lessons = lessonsFor();
  const total = lessons.length;
  const raw = input.step;
  const step = raw === undefined || raw === null ? 1 : Number(raw);
  if (!Number.isInteger(step) || step < 1 || step > total) {
    throw new TutorialError(
      'step_out_of_range',
      `--step must be between 1 and ${total} (got ${String(raw)})`,
      'Run `crtr sys tutorial dev -h` to see the contents, then pick a lesson in range.',
    );
  }
  const lesson = lessons[step - 1];
  const next = step < total ? `crtr sys tutorial dev --step ${step + 1}` : undefined;
  return {
    track: 'dev',
    step,
    total,
    title: lesson.title,
    body: lesson.body,
    ...(next === undefined ? {} : { next }),
    teaching_contract: TEACHING_CONTRACT,
    ...(step === 1 ? { contents: tableOfContents() } : {}),
  };
}
