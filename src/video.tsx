import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {StoryScene} from './scenes/StoryScene';
import {buildTimeline} from './engine/timeline';
import type {Episode} from './schema';

export const EpisodeVideo: React.FC<{episode:Episode}> = ({episode}) => {
  const timeline=buildTimeline(episode);
  return <AbsoluteFill>
    {timeline.map(segment => <Sequence key={segment.name} from={segment.from} durationInFrames={segment.duration} name={segment.name}>
      <StoryScene episode={episode} phase={segment.name}/>
    </Sequence>)}
    {episode.audio.music && <Audio src={staticFile(episode.audio.music)} volume={0.18} loop/>}
    {episode.audio.voice && <Audio src={staticFile(episode.audio.voice)} volume={0.95}/>}
  </AbsoluteFill>;
};
