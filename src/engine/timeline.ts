import type {Episode,PhaseName} from '../schema';
import {PHASE_NAMES} from '../schema';
export {PHASE_NAMES} from '../schema';
export const VIDEO={width:1080,height:1920,fps:30} as const;
export interface Segment{name:PhaseName;from:number;duration:number;end:number}
export const toFrames=(seconds:number,fps:number=VIDEO.fps)=>Math.round(seconds*fps);
export function buildTimeline(episode:Episode):Segment[]{
  let offset=0;
  return PHASE_NAMES.map(name=>{
    const duration=toFrames(episode[name].seconds);
    const segment={name,from:offset,duration,end:offset+duration};
    offset+=duration;return segment;
  });
}
export const totalFrames=(episode:Episode)=>{
  const timeline=buildTimeline(episode);
  return timeline[timeline.length-1]?.end??0;
};
