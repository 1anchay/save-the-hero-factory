import React from 'react';
import {useCurrentFrame} from 'remotion';

type Emotion = 'worried' | 'hopeful' | 'happy';

interface Props { x: number; y: number; scale?: number; emotion?: Emotion; travel?: number }

/** Reusable vector hero. Stage 2 will replace this foundation art with a refined rig. */
export const CartoonHero: React.FC<Props> = ({x, y, scale = 1, emotion = 'worried', travel = 0}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 7) * 5;
  const wave = Math.sin(frame / 5) * 15;
  const blink = frame % 94 < 4;
  return (
    <g transform={`translate(${x + travel}, ${y + bob}) scale(${scale})`}>
      <ellipse cx={5} cy={176} rx={72} ry={17} fill="#2D3A54" opacity={0.23}/>
      <path d="M-46 92 L-37 166 Q-20 176 -4 165 L1 99Z" fill="#334F8B" stroke="#25385D" strokeWidth={7}/>
      <path d="M7 101 L18 163 Q40 179 48 161 L38 90Z" fill="#4566AE" stroke="#25385D" strokeWidth={7}/>
      <ellipse cx={-30} cy={169} rx={32} ry={13} fill="#FEF8ED" stroke="#374866" strokeWidth={5}/>
      <ellipse cx={35} cy={169} rx={31} ry={13} fill="#FEF8ED" stroke="#374866" strokeWidth={5}/>
      <path d="M-60 -9 Q0 -35 60 -9 L69 103 Q0 130 -68 103 Z" fill="#F58A33" stroke="#C95C26" strokeWidth={8}/>
      <path d="M-18 21 Q0 16 18 21 L22 50 Q0 61 -22 50Z" fill="#FDB463" stroke="#D96D33" strokeWidth={3}/>
      <path d="M-54 2 Q-94 44 -78 82" stroke="#F58A33" strokeWidth={28} strokeLinecap="round"/>
      <circle cx={-78} cy={82} r={13} fill="#F2BF93"/>
      <g transform={`rotate(${emotion === 'happy' ? -50 : wave}, 56, 12)`}>
        <path d="M55 11 Q95 24 83 77" fill="none" stroke="#F58A33" strokeWidth={27} strokeLinecap="round"/>
        <circle cx={83} cy={77} r={14} fill="#F2BF93"/>
      </g>
      <path d="M-51 -54 C-46 -115 40 -118 57 -57 L54 -3 Q0 32 -50 -3Z" fill="#F3BD91" stroke="#C7825D" strokeWidth={6}/>
      <path d="M-58 -57 Q-75 -110 -30 -131 Q1 -167 34 -125 Q74 -113 60 -60 Q36 -73 22 -98 Q-10 -70 -32 -87Z" fill="#523D45"/>
      <path d="M-14 -127 L-23 -150 L5 -133 L19 -153 L28 -121" fill="#523D45"/>
      <ellipse cx={-24} cy={-49} rx={10} ry={blink ? 2 : 16} fill="#fff"/>
      <ellipse cx={24} cy={-49} rx={10} ry={blink ? 2 : 16} fill="#fff"/>
      {!blink && <><circle cx={-22} cy={-48} r={5} fill="#2D354A"/><circle cx={26} cy={-48} r={5} fill="#2D354A"/></>}
      <path d={emotion === 'happy' ? 'M-15 -18 Q1 0 22 -18' : 'M-8 -15 Q4 -31 19 -14'} fill="none" stroke="#9B4B52" strokeWidth={5} strokeLinecap="round"/>
      <circle cx={-39} cy={-24} r={13} fill="#F2A79C" opacity={0.6}/>
      <circle cx={42} cy={-24} r={13} fill="#F2A79C" opacity={0.6}/>
    </g>
  );
};
