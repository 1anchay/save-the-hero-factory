import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateEpisode, buildSegments, FPS} from './episode-core.mjs';

const file=resolve(process.argv[2] || 'episodes/episode-001.json');
const episode=JSON.parse(await readFile(file,'utf8'));
const issues=validateEpisode(episode);
if (issues.length) {
  console.error(`INVALID ${episode.id || file}:\n${issues.map(x=>'- '+x).join('\n')}`);
  process.exitCode=1;
} else {
  const segments=buildSegments(episode);
  const duration=segments.at(-1).end/FPS;
  console.log(`VALID ${episode.id}: ${segments.length} phases, ${duration.toFixed(1)}s @ ${FPS} fps`);
  segments.forEach(s=>console.log(`  ${s.name.padEnd(13)} ${String(s.from).padStart(4)}..${String(s.end).padStart(4)} (${(s.duration/FPS).toFixed(1)}s)`));
}
