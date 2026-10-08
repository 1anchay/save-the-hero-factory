import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateEpisode, buildSegments, FPS} from '../scripts/episode-core.mjs';

const demo=JSON.parse(readFileSync(new URL('../episodes/episode-001.json', import.meta.url),'utf8'));

test('the demo episode has a valid three-choice format',()=>{
  assert.deepEqual(validateEpisode(demo),[]);
  assert.equal(demo.choices.length,3);
});

test('viewers get six full seconds AFTER all three choices enter',()=>{
  const segments=buildSegments(demo);
  const intro=segments.find(s=>s.name==='choicesIntro');
  const decision=segments.find(s=>s.name==='decision');
  assert.equal(decision.from,intro.end);
  assert.equal(decision.duration,6*FPS);
});

test('phases have no gaps or overlaps',()=>{
  const s=buildSegments(demo);
  for(let i=1;i<s.length;i++) assert.equal(s[i-1].end,s[i].from);
  assert.equal(s.at(-1).end,Math.round(22.9*FPS));
});

test('rejects choices that are too quick',()=>{
  const episode=structuredClone(demo);
  episode.decision.seconds=3;
  assert.ok(validateEpisode(episode).some(s=>s.includes('six full seconds')));
});

test('rejects missing voice text',()=>{
  const episode=structuredClone(demo);
  episode.outcome.narration='';
  assert.ok(validateEpisode(episode).some(s=>s.includes('outcome.narration')));
});


test('episode uses our own in-project generated soundtrack, not a third-party track',()=>{
  assert.equal(demo.audio.music, 'music/original-hero-adventure.wav');
  assert.equal(demo.audio.voice, null);
});


test('outro has time for dragon comedy reveal',()=>{
  assert.equal(demo.outro.seconds,4.2);
  assert.ok(demo.outro.narration.toLowerCase().includes('дракон'));
});
