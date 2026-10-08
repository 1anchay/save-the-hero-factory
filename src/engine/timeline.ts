import type {Episode, PhaseName} from '../schema';

export const VIDEO = {width: 1080, height: 1920, fps: 30} as const;
export const PHASE_NAMES: PhaseName[] = ['intro', 'danger', 'choicesIntro', 'decision', 'outcome', 'outro'];

export interface Segment {
  name: PhaseName;
  from: number;
  duration: number;
  end: number;
}

export const toFrames = (seconds: number, fps: number = VIDEO.fps) => Math.round(seconds * fps);

export function buildTimeline(episode: Episode): Segment[] {
  let offset = 0;
  return PHASE_NAMES.map(name => {
    const duration = toFrames(episode[name].seconds);
    const segment = {name, from: offset, duration, end: offset + duration};
    offset += duration;
    return segment;
  });
}

export const totalFrames = (episode: Episode) => {
  const segments = buildTimeline(episode);
  return segments[segments.length - 1]?.end ?? 0;
};
