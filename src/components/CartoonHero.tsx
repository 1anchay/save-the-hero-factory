import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

type Emotion = 'worried' | 'hopeful' | 'happy';

interface Props {
  x: number;
  y: number;
  scale?: number;
  emotion?: Emotion;
  travel?: number;
  lift?: number;
  rescued?: boolean;
}

/**
 * Hand-authored, consistent 2.5D vector character. Character silhouette, face,
 * hoodie, backpack, scarf and moving limbs are fully rigged procedural SVG.
 * No screenshots, stock models, or downloaded character assets.
 */
export const CartoonHero: React.FC<Props> = ({
  x,y,scale=1,emotion='worried',travel=0,lift=0,rescued=false,
}) => {
  const frame=useCurrentFrame();
  const step=Math.sin(frame/5.6);
  const scared=emotion==='worried';
  const smile=emotion==='happy';
  const swing=rescued?Math.sin(frame/4)*10:Math.sin(frame/15)*3;
  const bob=rescued?Math.sin(frame/7)*2:Math.sin(frame/8)*3.6;
  const tilt=rescued?Math.sin(frame/14)*7:(scared?-2+Math.sin(frame/9)*2:Math.sin(frame/20));
  const blink=(frame%91)<3;
  const eyes=blink?2:15;
  const leftLeg=(rescued?step*20:step*4);
  const rightLeg=(rescued?-step*20:-step*4);
  const armRaise=rescued?-37:scared?12+Math.sin(frame/7)*10:5;
  const z='translate('+(x+travel)+','+(y+lift+bob)+') scale('+scale+') rotate('+tilt+')';
  return <g transform={z} strokeLinejoin="round" strokeLinecap="round">
    <defs>
      <linearGradient id="max-hair" x1="0" y1="0" x2=".6" y2="1">
        <stop offset="0" stopColor="#694451"/><stop offset=".9" stopColor="#322E48"/>
      </linearGradient>
      <linearGradient id="max-hood" x1="0" x2=".85" y1="0" y2="1">
        <stop offset="0" stopColor="#FFC06C"/><stop offset=".36" stopColor="#FF9948"/><stop offset="1" stopColor="#EC693F"/>
      </linearGradient>
      <linearGradient id="max-face" x1="0" x2="1" y1="0" y2=".9">
        <stop offset="0" stopColor="#FFE1B9"/><stop offset="1" stopColor="#EFA67D"/>
      </linearGradient>
      <linearGradient id="max-pants" x1="0" y1="0" x2=".8" y2="1">
        <stop offset="0" stopColor="#608CCE"/><stop offset="1" stopColor="#2D558D"/>
      </linearGradient>
    </defs>
    {/* A soft contact shadow follows the feet on the platform. */}
    {!rescued && <ellipse cx={3} cy={178} rx={77} ry={17} fill="#203D48" opacity={.19}/>}
    {/* Subtle backpack and rolled up straps add depth to the silhouette. */}
    <path d="M-57 -3 Q-98 4 -91 61 L-84 102 Q-57 119 -32 96 L-31 12Z" fill="#3F7292" stroke="#33465D" strokeWidth={7}/>
    <rect x={-90} y={43} width={30} height={43} rx={10} fill="#79B8C0" stroke="#38556F" strokeWidth={5}/>
    {/* Independent articulated legs. */}
    <g transform={'rotate('+leftLeg+' -29 91)'}>
      <path d="M-56 83 Q-55 123 -49 156 Q-33 173 -17 159 L-7 91Z" fill="url(#max-pants)" stroke="#293E5D" strokeWidth={7}/>
      <path d="M-42 110 Q-34 120 -30 138" fill="none" stroke="#8BA9DE" strokeWidth={6}/>
      <path d="M-53 153 Q-70 151 -73 172 Q-69 184 -32 183 L-4 174 Q-5 158 -25 158Z" fill="#FFF0D8" stroke="#32435D" strokeWidth={6}/>
      <path d="M-65 175 Q-38 185 -9 174" fill="none" stroke="#F3A46D" strokeWidth={5}/>
    </g>
    <g transform={'rotate('+rightLeg+' 29 91)'}>
      <path d="M3 89 Q11 126 12 156 Q31 174 46 159 L56 91Z" fill="url(#max-pants)" stroke="#293E5D" strokeWidth={7}/>
      <path d="M25 116 Q29 132 29 144" fill="none" stroke="#8BA9DE" strokeWidth={6}/>
      <path d="M13 155 Q3 161 11 176 Q29 185 61 183 Q77 171 59 159 L46 155Z" fill="#FFF0D8" stroke="#32435D" strokeWidth={6}/>
      <path d="M16 176 Q37 187 64 174" fill="none" stroke="#F3A46D" strokeWidth={5}/>
    </g>
    {/* Right arm is positioned behind torso; the raised gesture changes during rescue. */}
    <g transform={'rotate('+armRaise+' 48 -2)'}>
      <path d="M45 -8 Q89 0 88 42 Q91 62 74 89" fill="none" stroke="#BE6C3B" strokeWidth={35}/>
      <path d="M45 -8 Q88 2 83 45 Q85 66 73 83" fill="none" stroke="#FA9950" strokeWidth={27}/>
      <path d="M70 78 Q73 65 82 70 Q95 75 92 94 Q87 110 72 105 Q56 101 59 90Z" fill="#F7C099" stroke="#A96762" strokeWidth={5}/>
    </g>
    {/* Hoodie is outlined and shaded, with an actual pocket, drawstrings, seams. */}
    <path d="M-53 -19 Q-75 -9 -69 32 L-60 91 Q-17 121 57 92 L69 26 Q76 -13 49 -24 Q6 -47 -53 -19Z" fill="url(#max-hood)" stroke="#994A41" strokeWidth={8}/>
    <path d="M-50 82 Q2 108 52 82" fill="none" stroke="#FFE09B" strokeWidth={7} opacity={.65}/>
    <path d="M-26 47 Q-13 38 0 45 Q13 38 27 47 L32 71 Q1 86 -30 70Z" fill="#E77B43" stroke="#C76138" strokeWidth={4}/>
    <path d="M-24 -11 Q-6 5 3 9 Q19 1 29 -11" fill="none" stroke="#FFDE9A" strokeWidth={9}/>
    <path d="M-10 5 L-12 32 M18 6 L20 27" fill="none" stroke="#FFE6B7" strokeWidth={4}/>
    <circle cx={-12} cy={34} r={5} fill="#F5E8CB"/>
    <circle cx={21} cy={30} r={5} fill="#F5E8CB"/>
    {/* Left arm overlaps torso in foreground, animated separately. */}
    <g transform={'rotate('+(rescued?-45+step*9:-swing)+' -49 1)'}>
      <path d="M-55 1 Q-88 16 -88 49 Q-89 64 -75 83" fill="none" stroke="#B7673A" strokeWidth={33}/>
      <path d="M-55 1 Q-85 17 -84 51 Q-84 61 -73 77" fill="none" stroke="#FFAA56" strokeWidth={26}/>
      <path d="M-75 74 Q-91 72 -93 90 Q-94 108 -78 114 Q-60 110 -61 94Z" fill="#F8BE91" stroke="#A96762" strokeWidth={5}/>
    </g>
    {/* Oversized head, ears, side lighting and multiple distinct face highlights. */}
    <ellipse cx={-55} cy={-55} rx={12} ry={19} fill="#F5B48F" stroke="#B97765" strokeWidth={4}/>
    <ellipse cx={53} cy={-55} rx={12} ry={19} fill="#F5B48F" stroke="#B97765" strokeWidth={4}/>
    <path d="M-53 -100 C-40 -135 37 -133 55 -96 Q68 -41 44 -17 Q3 19 -38 -14 Q-68 -45 -53 -100Z" fill="url(#max-face)" stroke="#9D6C65" strokeWidth={6}/>
    <ellipse cx={-32} cy={-25} rx={17} ry={10} fill="#F09D94" opacity={.42}/>
    <ellipse cx={37} cy={-25} rx={17} ry={10} fill="#F09D94" opacity={.42}/>
    <path d="M-59 -80 Q-77 -138 -23 -146 Q3 -167 27 -146 Q80 -138 61 -78 Q52 -103 24 -109 Q9 -94 -14 -103 Q-37 -81 -58 -91Z" fill="url(#max-hair)" stroke="#403444" strokeWidth={6}/>
    <path d="M-15 -136 L-20 -157 L5 -148 L19 -167 L27 -136" fill="#53404A" stroke="#403444" strokeWidth={5}/>
    <path d="M-45 -107 Q-17 -132 7 -114" fill="none" stroke="#92606B" strokeWidth={8} opacity={.7}/>
    <path d={scared?'M-39 -70 Q-29 -82 -17 -71 M13 -72 Q29 -83 40 -68':'M-39 -74 Q-26 -76 -17 -71 M15 -70 Q30 -77 41 -72'} fill="none" stroke="#544050" strokeWidth={5}/>
    <ellipse cx={-26} cy={-48} rx={15} ry={eyes} fill="#FFFDF4"/>
    <ellipse cx={27} cy={-48} rx={15} ry={eyes} fill="#FFFDF4"/>
    {!blink && <>
      <ellipse cx={-22} cy={-46} rx={7} ry={10} fill="#35475D"/>
      <ellipse cx={30} cy={-46} rx={7} ry={10} fill="#35475D"/>
      <circle cx={-19} cy={-51} r={3.7} fill="#FFFFFF"/>
      <circle cx={33} cy={-51} r={3.7} fill="#FFFFFF"/>
    </>}
    <path d="M-2 -40 Q-7 -27 2 -26" fill="none" stroke="#CE8E7A" strokeWidth={3.5}/>
    {smile
      ? <path d="M-16 -15 Q3 12 24 -15 Q4 -3 -16 -15Z" fill="#753C47" stroke="#8F4B55" strokeWidth={3}/>
      : scared
        ? <ellipse cx={5} cy={-11} rx={8} ry={12} fill="#884653"/>
        : <path d="M-15 -13 Q1 -7 16 -13" stroke="#96525A" strokeWidth={5} fill="none"/>}
    {scared && <g transform={'translate('+(-66+Math.sin(frame/9)*2)+',-50)'}>
      <path d="M0 0 Q-21 27 -4 30 Q12 28 0 0Z" fill="#84DDF4" stroke="#D1FCFF" strokeWidth={3}/>
    </g>}
    {smile && <g opacity={.9}>
      <path d="M-45 -14 Q-59 -18 -65 -8 M49 -14 Q58 -20 64 -11" stroke="#FFEED1" strokeWidth={4}/>
    </g>}
    {/* Little travel scarf, drawn in front of hoodie neck. */}
    <path d="M-29 -4 Q5 18 35 -7" fill="none" stroke="#F6EBD7" strokeWidth={9}/>
  </g>;
};
