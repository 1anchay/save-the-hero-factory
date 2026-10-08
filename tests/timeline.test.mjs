import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateEpisode,buildSegments,FPS,PHASES,OUTCOMES} from '../scripts/episode-core.mjs';
const demo=JSON.parse(readFileSync(new URL('../episodes/episode-001.json',import.meta.url),'utf8'));
test('episode schema validates eight narrated phases and 3 choices',()=>{
 assert.deepEqual(validateEpisode(demo),[]);
 assert.equal(PHASES.length,8);
 assert.deepEqual(demo.choices.map(c=>c.id),['A','B','C']);
});
test('seven full seconds start AFTER all 3 choices are visible',()=>{
 const phases=buildSegments(demo);
 const intro=phases.find(p=>p.name==='choicesIntro');
 const decision=phases.find(p=>p.name==='decision');
 assert.equal(decision.from,intro.end);
 assert.equal(decision.duration,FPS*7);
});
test('all three outcomes have distinct phases, in A C B narrative order',()=>{
 assert.deepEqual(OUTCOMES,['jumpOutcome','dragonOutcome','ropeOutcome']);
 assert.equal(demo.correctChoice,'B');
 for(const outcome of OUTCOMES)assert.ok(demo[outcome].seconds>=5);
});
test('story is 40 seconds with gapless scenes',()=>{
 const list=buildSegments(demo);
 for(let i=1;i<list.length;i++)assert.equal(list[i].from,list[i-1].end);
 assert.equal(list.at(-1).end,40*FPS);
});
test('decision less than seven seconds is rejected',()=>{
 const invalid=structuredClone(demo);invalid.decision.seconds=4;
 assert.ok(validateEpisode(invalid).some(x=>x.includes('seven full seconds')));
});
test('missing any narrated ending is rejected',()=>{
 const invalid=structuredClone(demo);invalid.dragonOutcome.narration='';
 assert.ok(validateEpisode(invalid).some(x=>x.includes('dragonOutcome.narration')));
});
test('no unlicensed background track can sneak into episode config',()=>{
 const invalid=structuredClone(demo);invalid.audio.music='music/some-third-party-song.mp3';
 assert.ok(validateEpisode(invalid).some(x=>x.includes('original generated')));
});
test('music is synthesized by the project and voice is phase-generated',()=>{
 assert.equal(demo.audio.music,'music/original-hero-adventure.wav');assert.equal(demo.audio.voice,null);
});
test('all option outcomes are shown after the decision, not during the count',()=>{
 const items=buildSegments(demo);const end=items.find(x=>x.name==='decision').end;
 for(const outcome of OUTCOMES)assert.ok(items.find(x=>x.name===outcome).from>=end);
});
