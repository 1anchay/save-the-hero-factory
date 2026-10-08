import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';

const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;

/** Original SVG cartoon dragon arrives hilariously late after Max is safe. */
export const LateDragon: React.FC = () => {
  const f=useCurrentFrame();
  const flight=interpolate(f,[0,57],[0,1],clamp);
  const x=1300-565*flight;
  const y=660-60*Math.sin(Math.PI*flight)+Math.sin(f/7)*13;
  const wings=Math.sin(f/3.5)*28;
  const puff=Math.max(0,interpolate(f,[65,91],[0,1],clamp));
  return <g transform={'translate('+x+','+y+') scale(.92)'}>
    <defs>
      <linearGradient id="dragonGreen" x1="0" y1="0" x2=".7" y2="1">
        <stop offset="0" stopColor="#A0E891"/><stop offset=".55" stopColor="#64C48F"/><stop offset="1" stopColor="#378A93"/>
      </linearGradient>
    </defs>
    <path d="M-75 40 Q-197 34 -204 -77 Q-222 -118 -233 -91 Q-219 -11 -172 62 Q-137 99 -87 77" fill="none" stroke="#357F7F" strokeWidth={28} strokeLinecap="round"/>
    <g transform={'rotate('+wings+' -35 10)'}>
      <path d="M-45 0 Q-179 -157 -165 -43 Q-131 -85 -114 -36 Q-70 -92 -34 -20Z" fill="#80B7DA" stroke="#337D9E" strokeWidth={8}/>
      <path d="M-48 -6 L-150 -83 M-48 -6 L-102 -53" stroke="#B5E7FA" strokeWidth={7} fill="none"/>
    </g>
    <g transform={'rotate('+(-wings/1.7)+' 63 15)'}>
      <path d="M62 16 Q160 -107 159 -18 Q126 -40 101 -1 Q71 -41 51 35Z" fill="#91CADD" stroke="#337D9E" strokeWidth={8}/>
    </g>
    <ellipse cx={-18} cy={58} rx={93} ry={88} fill="url(#dragonGreen)" stroke="#337B75" strokeWidth={9}/>
    <path d="M-64 53 Q-33 22 29 55 Q66 104 0 128 Q-65 128 -64 53Z" fill="#FFE4AB"/>
    <path d="M-55 -2 Q-86 -101 -14 -113 Q73 -128 92 -55 Q128 -37 116 2 Q78 47 20 42 Q-37 43 -55 -2Z" fill="url(#dragonGreen)" stroke="#337B75" strokeWidth={9}/>
    {[-37,-3,32].map((x,i)=><path key={i} d={'M'+(x-6)+' -104 L'+x+' -140 L'+(x+22)+' -104Z'} fill="#F1C17C" stroke="#A16F62" strokeWidth={5}/>)}
    <ellipse cx={17} cy={-54} rx={21} ry={27} fill="#FFFBEB" stroke="#387D76" strokeWidth={4}/>
    <circle cx={25} cy={-51} r={11} fill="#3B4A61"/>
    <circle cx={29} cy={-58} r={4.5} fill="#FFFFFF"/>
    <ellipse cx={86} cy={-6} rx={45} ry={26} fill="#B4E9B0" stroke="#337B75" strokeWidth={5}/>
    <circle cx={87} cy={-16} r={5.5} fill="#387E78"/>
    <path d="M63 8 Q92 30 116 9" fill="none" stroke="#46796B" strokeWidth={6}/>
    <g transform={'translate('+Math.sin(f/6)*4+',0)'}>
      <path d="M-53 102 Q-94 112 -99 154 M18 115 Q49 128 42 159" stroke="#337B75" strokeWidth={28} strokeLinecap="round"/>
      <path d="M-53 102 Q-94 112 -99 154 M18 115 Q49 128 42 159" stroke="#72BCA0" strokeWidth={19} strokeLinecap="round"/>
    </g>
    {puff>0 && <g opacity={.62*(1-puff)} transform={'translate('+(108+120*puff)+','+(-28-38*puff)+') scale('+(0.6+puff*.7)+')'}>
      <circle cx={0} cy={0} r={26} fill="#FFFFFF"/>
      <circle cx={22} cy={-14} r={33} fill="#FFFFFF"/>
      <circle cx={47} cy={0} r={22} fill="#FFFFFF"/>
    </g>}
  </g>;
};
