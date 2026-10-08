import React from 'react';
import {Composition} from 'remotion';
import {EpisodeVideo} from './video';
import raw from '../episodes/episode-001.json';
import {EpisodeSchema} from './schema';
import {totalFrames, VIDEO} from './engine/timeline';

const episode = EpisodeSchema.parse(raw);

export const Root: React.FC = () => (
  <Composition
    id="SaveTheHeroDemo"
    component={EpisodeVideo}
    durationInFrames={totalFrames(episode)}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
    defaultProps={{episode}}
  />
);
