import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily} from '../styles/palette';

export const Countdown: React.FC<{seconds:number}> = ({seconds}) => {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const remaining=Math.max(0,seconds-f/fps);
  const value=Math.max(1,Math.ceil(remaining));
  const progress=remaining/seconds;
  const r=74;
  const perimeter=2*Math.PI*r;
  return <div style={{position:'absolute',top:610,right:79,width:198,height:198,zIndex:20}}>
    <svg width={198} height={198} viewBox="0 0 198 198">
      <circle cx={99} cy={99} r={88} fill="#FFFFFF" stroke="#203655" strokeWidth={9}/>
      <circle cx={99} cy={99} r={r} fill="none" stroke="#FFE7B4" strokeWidth={17}/>
      <circle cx={99} cy={99} r={r} fill="none" stroke={remaining<2?'#FF646E':'#4BCFA8'} strokeWidth={17}
       strokeDasharray={perimeter} strokeDashoffset={perimeter*(1-progress)} strokeLinecap="round" transform="rotate(-90 99 99)"/>
      <text x={99} y={123} textAnchor="middle" fontFamily={fontFamily} fontSize={85} fontWeight={900} fill="#203655">{value}</text>
    </svg>
  </div>;
};
