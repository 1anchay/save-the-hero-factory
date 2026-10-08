import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {StoryScene} from './scenes/StoryScene';
import {buildTimeline} from './engine/timeline';
import type {Episode} from './schema';

/** Original procedural soundscape — no third-party recordings or samples. */
export const EpisodeVideo: React.FC<{episode:Episode}> = ({episode}) => {
  const timeline = buildTimeline(episode);
  const decision = timeline.find(s => s.name === 'decision')!;
  const danger = timeline.find(s => s.name === 'danger')!;
  const outcome = timeline.find(s => s.name === 'outcome')!;
  const fps = 30;
  const tickFrames = Array.from({length: 4}, (_, i) =>
    decision.end - (2 * fps) + i * Math.round(fps / 2)
  );
  return <AbsoluteFill>
    {timeline.map(segment => <Sequence key={segment.name} from={segment.from} durationInFrames={segment.duration} name={segment.name}>
      <StoryScene episode={episode} phase={segment.name}/>
    </Sequence>)}
    {episode.audio.music && (
      <Audio
        src={staticFile(episode.audio.music)}
        volume={0.21}
        loop
      />
    )}
    {episode.audio.voice && <Audio src={staticFile(episode.audio.voice)} volume={0.95}/>}
    <Sequence from={danger.from + 12} durationInFrames={25} name="Original bridge crack">
      <Audio src={staticFile('sfx/original-bridge-crack.wav')} volume={0.27}/>
    </Sequence>
    {tickFrames.map((from, i) => <Sequence key={i} from={from} durationInFrames={12} name="Original countdown tick">
      <Audio src={staticFile('sfx/original-tick.wav')} volume={i === 3 ? 0.26 : 0.16}/>
    </Sequence>)}
    <Sequence from={outcome.from + 10} durationInFrames={fps * 2} name="Original rescue chime">
      <Audio src={staticFile('sfx/original-rescue.wav')} volume={0.5}/>
    </Sequence>
  </AbsoluteFill>;
};
