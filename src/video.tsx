import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile} from 'remotion';
import {StoryScene} from './scenes/StoryScene';
import {buildTimeline} from './engine/timeline';
import type {Episode} from './schema';
import timings from './generated/voice-timings.json';

type VoiceTiming={file:string;duration:number;words:{text:string;start:number;end:number}[]};
const voicePhases=timings.phases as Record<string,VoiceTiming|undefined>;

/**
 * 40 second original cartoon film:
 * 1 puzzle, 7 seconds to decide, 3 animated consequences A/C/B.
 * All background music and sound effects are our own generated waveforms.
 */
export const EpisodeVideo:React.FC<{episode:Episode}>=({episode})=>{
 const segments=buildTimeline(episode);
 const find=(name:string)=>segments.find(s=>s.name===name)!;
 const decision=find('decision');
 const danger=find('danger');
 const jump=find('jumpOutcome');
 const dragon=find('dragonOutcome');
 const rope=find('ropeOutcome');
 const fps=30;
 const ticks=Array.from({length:4},(_,i)=>decision.end-2*fps+i*15);
 const bgVolume=(frame:number)=>{
  const talking=segments.some(segment=>{
   const timing=voicePhases[segment.name];
   const elapsed=(frame-segment.from)/fps;
   return timing&&elapsed>=0&&elapsed<timing.duration+.13;
  });
  return talking?.065:.18;
 };
 return <AbsoluteFill>
  {segments.map(s=><Sequence key={s.name} name={s.name} from={s.from} durationInFrames={s.duration}>
   <StoryScene episode={episode} phase={s.name}/>
  </Sequence>)}
  {episode.audio.music&&<Audio src={staticFile(episode.audio.music)} loop volume={bgVolume}/>}
  {segments.map(s=>{
   const clip=voicePhases[s.name];
   return clip?<Sequence key={'speech-'+s.name} name={'Russian speech '+s.name} from={s.from} durationInFrames={s.duration}>
    <Audio src={staticFile(clip.file)} volume={1}/>
   </Sequence>:null;
  })}
  <Sequence from={danger.from+16} durationInFrames={25} name="Cracking bridge sound">
   <Audio src={staticFile('sfx/original-bridge-crack.wav')} volume={.29}/>
  </Sequence>
  <Sequence from={jump.from+23} durationInFrames={28} name="Jump fail boing">
   <Audio src={staticFile('sfx/original-bridge-crack.wav')} volume={.13}/>
  </Sequence>
  <Sequence from={dragon.from+32} durationInFrames={50} name="Dragon comic chirp">
   <Audio src={staticFile('sfx/original-rescue.wav')} volume={.17}/>
  </Sequence>
  {ticks.map((frame,i)=><Sequence key={'tick-'+i} from={frame} durationInFrames={12}>
   <Audio src={staticFile('sfx/original-tick.wav')} volume={i===3?.3:.17}/>
  </Sequence>)}
  <Sequence from={rope.from+31} durationInFrames={58} name="Final correct rescue">
   <Audio src={staticFile('sfx/original-rescue.wav')} volume={.52}/>
  </Sequence>
 </AbsoluteFill>;
};
