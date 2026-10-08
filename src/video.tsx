import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {StoryScene} from './scenes/StoryScene';
import {buildTimeline} from './engine/timeline';
import type {Episode} from './schema';
import timings from './generated/voice-timings.json';

type VoiceTiming = {file:string;duration:number;words:{text:string;start:number;end:number}[]};
const voicePhases = timings.phases as Record<string, VoiceTiming | undefined>;

/** Original score and SFX + six independently synchronized Russian voice tracks. */
export const EpisodeVideo: React.FC<{episode:Episode}> = ({episode}) => {
  const timeline = buildTimeline(episode);
  const decision = timeline.find(s=>s.name==='decision')!;
  const danger = timeline.find(s=>s.name==='danger')!;
  const outcome = timeline.find(s=>s.name==='outcome')!;
  const fps = 30;
  const tickFrames = Array.from({length:4},(_,i)=>
    decision.end-(2*fps)+i*Math.round(fps/2)
  );
  const volume = (f:number) => {
    // Narration-aware music ducking. The user's original music plays louder in
    // the six-second thinking pause and gets quieter under spoken phrases.
    let spoken = false;
    for (const segment of timeline) {
      const timing=voicePhases[segment.name];
      if (!timing) continue;
      const local=(f-segment.from)/fps;
      if (local>=0 && local<timing.duration+.12) {spoken=true;break;}
    }
    return spoken ? .065 : .18;
  };
  return <AbsoluteFill>
    {timeline.map(segment=><Sequence key={segment.name} from={segment.from}
      durationInFrames={segment.duration} name={segment.name}>
      <StoryScene episode={episode} phase={segment.name}/>
    </Sequence>)}
    {episode.audio.music && <Audio src={staticFile(episode.audio.music)} volume={volume} loop/>}
    {timeline.map(segment=>{
      const spoken=voicePhases[segment.name];
      return spoken ? (
        <Sequence key={'voice-'+segment.name} from={segment.from}
          durationInFrames={segment.duration} name={'Russian narrator '+segment.name}>
          <Audio src={staticFile(spoken.file)} volume={1.0}/>
        </Sequence>
      ) : null;
    })}
    <Sequence from={danger.from+12} durationInFrames={25} name="Original bridge crack">
      <Audio src={staticFile('sfx/original-bridge-crack.wav')} volume={.23}/>
    </Sequence>
    {tickFrames.map((from,i)=><Sequence key={i} from={from}
      durationInFrames={12} name="Original countdown tick">
      <Audio src={staticFile('sfx/original-tick.wav')} volume={i===3?.26:.15}/>
    </Sequence>)}
    <Sequence from={outcome.from+10} durationInFrames={fps*2} name="Original rescue chime">
      <Audio src={staticFile('sfx/original-rescue.wav')} volume={.44}/>
    </Sequence>
  </AbsoluteFill>;
};
