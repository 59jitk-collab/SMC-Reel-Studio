import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { SMCVideo } from './SMCVideo';

export const RemotionRoot: React.FC = () => {
  return React.createElement(Composition, {
    id: 'SMCVideo',
    component: SMCVideo,
    durationInFrames: 1800,
    fps: 30,
    width: 1080,
    height: 1920,
  });
};

registerRoot(RemotionRoot);
