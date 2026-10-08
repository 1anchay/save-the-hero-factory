import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {PhaseName} from '../schema';
import {CartoonHero} from './CartoonHero';

interface Props {phase: PhaseName}

const Clouds = () => {
  const f = useCurrentFrame();
  return <g opacity={0.95}>
    {[[120, 320, 1],[720, 225, .7],[450, 425, .55]].map(([x,y,s],i) => (
      <g key={i} transform={`translate(${x + Math.sin(f/38+i)*17} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={20} rx={94} ry={39} fill="#fff" />
        <ellipse cx={-42} cy={-2} rx={51} ry={55} fill="#fff" />
        <ellipse cx={20} cy={-13} rx={67} ry={66} fill="#fff" />
      </g>
    ))}
  </g>;
};

export const CartoonWorld: React.FC<Props> = ({phase}) => {
  const frame = useCurrentFrame();
  const isOutcome = phase === 'outcome' || phase === 'outro';
  const f = frame;
  const happy = isOutcome;
  const travel = isOutcome ? interpolate(f,[0,55],[0,485],{extrapolateRight:'clamp'}) : 0;
  const ropeProgress = isOutcome ? interpolate(f,[0,18],[0,1],{extrapolateRight:'clamp'}) : 0;
  return (
    <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{position:'absolute',inset:0}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0.65" y2="1"><stop offset="0" stopColor="#65C6EF"/><stop offset="0.52" stopColor="#B8EFFB"/><stop offset="1" stopColor="#FFD9A2"/></linearGradient>
        <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#AC8074"/><stop offset="1" stopColor="#694B64"/></linearGradient>
        <linearGradient id="lava" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD354"/><stop offset="0.3" stopColor="#FF8A3F"/><stop offset="1" stopColor="#DE324D"/></linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9AD963"/><stop offset="1" stopColor="#4BBF7C"/></linearGradient>
        <radialGradient id="sun"><stop stopColor="#FFF9DC" stopOpacity="0.85"/><stop offset="1" stopColor="#FFE89B" stopOpacity="0"/></radialGradient>
        <filter id="lavaGlow"><feGaussianBlur stdDeviation="28"/></filter>
        <filter id="blurShadow"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <rect width={1080} height={1920} fill="url(#sky)"/>
      <circle cx={790} cy={350} r={390} fill="url(#sun)"/>
      <circle cx={790} cy={350} r={105} fill="#FFF4C5"/>
      <Clouds />
      <path d="M0 790 Q185 610 380 745 T740 720 T1080 745V1310H0Z" fill="#86CFC4"/>
      <path d="M0 930 Q210 760 470 855 T900 822 T1080 855V1300H0Z" fill="#4FAFA9"/>
      <path d="M0 1110 L1080 1110 L1080 1920 L0 1920Z" fill="#9A5960"/>
      <rect x={0} y={1245} width={1080} height={675} fill="url(#lava)"/>
      <path d={`M0 ${1290 + Math.sin(f/11)*12} Q140 1260 280 1305 T570 1300 T880 1306 T1080 1280V1920H0Z`} fill="#FFD15A" opacity={0.88}/>
      <path d={`M0 ${1420+Math.cos(f/12)*14} Q185 1380 350 1450 T690 1440 T1080 1410V1920H0Z`} fill="#F76641" opacity={0.8}/>
      {Array.from({length: 17}, (_,i) => {
        const x=(i*79+57)%1090, y=1450+(i*103)%410;
        const radius=7+i%4*8;
        const rise=(f*(.6+(i%5)*.15))%80;
        return <circle key={i} cx={x} cy={y-rise} r={radius} fill={i%3===0?'#FFF0A1':'#FFBB56'} opacity={0.45+Math.sin((f+i*12)/20)*.25}/>;
      })}
      <path d="M0 1004 Q160 981 407 1008 L400 1920H0Z" fill="url(#stone)" stroke="#6F566B" strokeWidth={15}/>
      <path d="M735 1010 Q900 950 1080 1001V1920H752Z" fill="url(#stone)" stroke="#695263" strokeWidth={15}/>
      <path d="M0 1004 Q220 973 409 1008 L414 1063 Q210 1033 0 1060Z" fill="url(#grass)" stroke="#4A9D6A" strokeWidth={9}/>
      <path d="M733 1010 Q890 961 1080 1001V1050 Q889 1018 735 1064Z" fill="url(#grass)" stroke="#4A9D6A" strokeWidth={9}/>
      <g opacity={0.86}>
        {[[92,1205,50,13],[242,1340,34,-15],[854,1280,72,5],[973,1490,60,-11]].map(([x,y,rx,tilt],i)=><ellipse key={i} cx={x} cy={y} rx={rx} ry={20} fill="#F4B377" transform={`rotate(${tilt} ${x} ${y})`}/>) }
      </g>
      {/* Collapsing cartoon bridge: short planks remain and wobble while the center gap is exposed. */}
      {[0,1].map((i) => <g key={i} transform={`rotate(${Math.sin(f/10+i)*2}, ${370+i*410}, 1033)`}>
        <rect x={i===0?338:720} y={1015} width={140} height={37} rx={14} fill="#D59860" stroke="#91563F" strokeWidth={8}/>
        <circle cx={i===0?373:755} cy={1035} r={6} fill="#6D4B45"/>
      </g>)}
      <g opacity={.65} transform={`translate(${Math.sin(f/9)*7},0)`}>
        {[[172,964],[220,975],[900,963],[965,952]].map(([x,y],i)=><g key={i}><path d={`M${x} ${y} q-20 -52 4 -82 q27 36 15 79`} fill="#4AAD79" stroke="#2D9871" strokeWidth={6}/><circle cx={x-18} cy={y-32} r={12} fill="#E6F1AF"/></g>)}
      </g>
      {isOutcome && <>
        <path d="M400 950 Q555 845 775 960" stroke="#3A4451" strokeWidth={27*ropeProgress} strokeLinecap="round" fill="none"/>
        <path d="M400 950 Q555 845 775 960" stroke="#EFD3A0" strokeWidth={19*ropeProgress} strokeLinecap="round" fill="none"/>
        <g opacity={ropeProgress}>
          <circle cx={780} cy={945} r={30} fill="#FFD36E" stroke="#E19841" strokeWidth={8}/>
          <circle cx={780} cy={945} r={14} fill="#FFFFFF"/>
        </g>
      </>}
      <CartoonHero x={315} y={905} scale={1.02} emotion={happy?'happy':phase==='intro'?'hopeful':'worried'} travel={travel} />
      {isOutcome && <g opacity={interpolate(f,[27,50],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}>
        {[[770,705],[920,755],[858,668],[980,690]].map(([x,y],i)=><text key={i} x={x} y={y} fontSize={50+i%2*20} fill={i%2?'#FFCA4C':'#FFF5D2'}>{i%2?'★':'✦'}</text>)}
      </g>}
    </svg>
  );
};
