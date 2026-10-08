export const FPS = 30;
export const PHASES = ['intro', 'danger', 'choicesIntro', 'decision', 'outcome', 'outro'];

export function validateEpisode(raw) {
  const issues=[];
  if (!raw || typeof raw !== 'object') return ['Episode must be an object'];
  if (typeof raw.id !== 'string' || !/^episode-[0-9]{3}$/.test(raw.id)) issues.push('id must be episode-NNN');
  if (!Array.isArray(raw.choices) || raw.choices.length !== 3) issues.push('exactly three choices required');
  else {
    if (raw.choices.map(v => v.id).join('') !== 'ABC') issues.push('choices must be A, B, C in order');
    for (const [i, choice] of raw.choices.entries()) {
      if (typeof choice.text !== 'string' || !choice.text.trim()) issues.push(`choice ${i} has no label`);
    }
  }
  if (!['A','B','C'].includes(raw.correctChoice)) issues.push('correctChoice must be A, B or C');
  for (const phase of PHASES) {
    const item = raw[phase];
    if (!item || typeof item.seconds !== 'number' || item.seconds < 1 || item.seconds > 12) issues.push(`${phase}.seconds must be 1..12`);
    if (!item || typeof item.narration !== 'string' || item.narration.trim().length === 0) issues.push(`${phase}.narration must not be blank`);
  }
  if (raw.decision?.seconds < 6) issues.push('decision must last at least six full seconds');
  if (raw.choicesIntro?.seconds < 2) issues.push('choicesIntro should allow enough time for all three choices to enter');
  if (raw.audio && (raw.audio.voice !== null && typeof raw.audio.voice !== 'string')) issues.push('audio.voice should be a path or null');
  return issues;
}

export function buildSegments(raw) {
  let from=0;
  return PHASES.map(name => {
    const duration=Math.round(raw[name].seconds * FPS);
    const segment={name,from,duration,end:from+duration};
    from+=duration;
    return segment;
  });
}
