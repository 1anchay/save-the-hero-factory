import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {PhaseName} from '../schema';
import {CartoonHero} from './CartoonHero';
import {LateDragon} from './LateDragon';

interface Props {phase: PhaseName}
const clamp = {extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;

const Clouds: React.FC = () => {
  const f=useCurrentFrame();
  return <g>
    {[[140,250,1.05],[780,345,.68],[540,505,.56],[-70,565,.65]].map(([x,y,s],i) => (
      <g key={i} transform={'translate('+(x+Math.sin(f/50+i)*23)+','+y+') scale('+s+')'} opacity={i===3?.65:.93}>
        <ellipse cx={0} cy={20} rx={110} ry={36} fill="#F5FFFF" opacity={.35}/>
        <ellipse cy={9} cx={-40} rx={73} ry={37} fill="#FFFFFF"/>
        <ellipse cy={-24} cx={-40} rx={57} ry={54} fill="#FFFFFF"/>
        <ellipse cy={-32} cx={22} rx={67} ry={62} fill="#FFFFFF"/>
        <ellipse cy={8} cx={74} rx={60} ry={36} fill="#FFFFFF"/>
      </g>
    ))}
  </g>;
};

/**
 * A continuous illustrated world with depth, no stock imagery.
 * Dust, broken planks, lava shimmer, cliff details and rescue rope animate
 * deterministically from the local frame of each narrative phase.
 */
export const CartoonWorld: React.FC<Props> = ({phase}) => {
  const frame=useCurrentFrame();
  const f=frame;
  const isOutcome=phase==='outcome'||phase==='outro';
  const escape=phase==='outro'?1:isOutcome?interpolate(f,[8,77],[0,1],clamp):0;
  const lift=-120*Math.sin(Math.PI*escape)-38*escape;
  const ropeProgress=phase==='outro'?1:isOutcome?interpolate(f,[0,22],[0,1],clamp):0;
  const collapse=phase==='intro'?0:phase==='danger'?interpolate(f,[9,58],[0,1],clamp):1;
  const shake=phase==='danger'?Math.sin(f*2.7)*5:0;
  const nearZoom=phase==='danger' ? interpolate(f,[0,95],[1,1.025],clamp) : 1;
  const dust=phase==='danger'||phase==='choicesIntro'||phase==='decision';
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,display:'block'}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2=".65" y2="1"><stop offset="0" stopColor="#4DAFE0"/><stop offset=".55" stopColor="#BDEDF5"/><stop offset="1" stopColor="#FFD49B"/></linearGradient>
        <linearGradient id="far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#97D8CC"/><stop offset="1" stopColor="#5BB9AD"/></linearGradient>
        <linearGradient id="rock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C99983"/><stop offset=".55" stopColor="#886E77"/><stop offset="1" stopColor="#534B6F"/></linearGradient>
        <linearGradient id="rockFace" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EBC2A0"/><stop offset="1" stopColor="#8E6275"/></linearGradient>
        <linearGradient id="lava" x1="0" y1="0" x2=".5" y2="1"><stop offset="0" stopColor="#FFC74D"/><stop offset=".44" stopColor="#FF8B42"/><stop offset="1" stopColor="#D92F52"/></linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B8EA80"/><stop offset=".48" stopColor="#6FC76E"/><stop offset="1" stopColor="#3CA77F"/></linearGradient>
        <radialGradient id="sun"><stop stopColor="#FFF7CD" stopOpacity=".95"/><stop offset="1" stopColor="#FFF0A0" stopOpacity="0"/></radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="25"/></filter>
      </defs>
      <rect width={1080} height={1920} fill="url(#sky)"/>
      <circle cx={825} cy={340} r={360} fill="url(#sun)"/>
      <circle cx={825} cy={330} r={99} fill="#FFF5C1"/>
      <g transform={'translate(0,'+Math.sin(f/70)*5+')'}><Clouds/></g>
      <path d="M0 775 Q170 616 337 731 Q536 561 715 714 Q884 604 1080 760 V1230H0Z" fill="#B1E2D6"/>
      <path d="M0 890 Q188 725 350 823 Q524 650 699 812 Q892 673 1080 842 V1350H0Z" fill="url(#far)"/>
      <path d="M0 990 Q148 850 293 945 Q447 787 619 966 Q807 812 1080 907V1380H0Z" fill="#4C9C9B" opacity={.58}/>
      <g transform={'translate(540,800) scale('+nearZoom+') translate(-540,-800)'}>
        {/* Wide molten river glowing beyond the stone edge. */}
        <rect x="0" y="1080" width="1080" height="840" fill="#793C59"/>
        <rect x="0" y="1235" width="1080" height="700" fill="url(#lava)"/>
        <path d="M0 1306 Q200 1260 375 1309 T755 1306 T1080 1295V1920H0Z" fill="#FFE082" opacity={.7} transform={'translate(0,'+Math.sin(f/12)*17+')'}/>
        <path d="M0 1465 Q190 1410 390 1494 T830 1450 T1080 1480V1920H0Z" fill="#FB6746" opacity={.7} transform={'translate(0,'+Math.cos(f/16)*22+')'}/>
        <path d="M0 1630 Q240 1560 410 1613 T811 1618 T1080 1651V1920H0Z" fill="#EA4A56" opacity={.66} transform={'translate(0,'+Math.sin(f/21)*14+')'}/>
        {Array.from({length:19},(_,i)=>{
          const x=(i*91+67)%1065, y=1340+(i*139)%540, r=8+i%4*7, flicker=.45+.29*Math.sin((f+i*13)/16);
          return <g key={i} transform={'translate(0,'+(-((f*.85+i*8)%65))+')'} opacity={flicker}>
            <ellipse cx={x} cy={y} rx={r*1.5} ry={r*.55} fill="#FFECA0"/>
            <ellipse cx={x} cy={y-2} rx={r*.48} ry={r*.3} fill="#FFF6C0"/>
          </g>;
        })}
        <path d="M0 1007 Q210 967 402 1010 L409 1920 H0Z" fill="url(#rock)" stroke="#685469" strokeWidth={12}/>
        <path d="M730 1010 Q880 952 1080 1004 V1920 H752Z" fill="url(#rock)" stroke="#685469" strokeWidth={12}/>
        <path d="M18 1088 L141 1139 L116 1302 L263 1440 M326 1083 L251 1223 L325 1295 L285 1407 M825 1113 L904 1194 L868 1343 M1004 1110 L948 1253 L1020 1403" stroke="#5B5069" strokeWidth={15} fill="none" opacity={.57}/>
        <path d="M6 1116 L70 1171 M156 1259 L211 1282 M862 1172 L923 1208" stroke="#E9B28F" strokeWidth={10} fill="none" opacity={.5}/>
        <path d="M0 989 Q185 956 406 996 L410 1067 Q233 1037 0 1055 Z" fill="url(#grass)" stroke="#378D73" strokeWidth={8}/>
        <path d="M728 998 Q893 946 1080 987 V1050 Q893 1020 731 1064Z" fill="url(#grass)" stroke="#378D73" strokeWidth={8}/>
        <path d="M4 994 Q180 964 397 1004 M737 1005 Q888 960 1075 992" fill="none" stroke="#DCFF9F" strokeWidth={13} opacity={.75}/>
        {[[100,1042,80,13],[263,1127,57,-22],[848,1102,63,-12],[975,1253,52,22]].map(([x,y,rx,a],i)=>
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={18} transform={'rotate('+a+' '+x+' '+y+')'} fill="#D3A18D" opacity={.55}/>
        )}
        {/* Tufted grass with small flowers on both safe platforms. */}
        {[[95,975],[182,976],[293,980],[838,976],[934,968],[1030,980]].map(([x,y],i)=>
          <g key={i} transform={'translate('+x+','+y+') rotate('+Math.sin(f/19+i)*4+')'}>
            <path d="M0 0 Q-30 -45 -28 -60 M0 0 Q1 -47 12 -71 M0 0 Q19 -28 30 -39" fill="none" stroke="#32865B" strokeWidth={8}/>
            <circle cx={12} cy={-71} r={10} fill={i%2===0?'#FFDB73':'#FFF0E2'}/>
            <circle cx={12} cy={-71} r={4} fill="#E78173"/>
          </g>
        )}
        {/* One suspended plank splits away and tumbles into the lava. */}
        <g transform={'translate('+(-14*collapse)+','+(265*collapse)+') rotate('+(-72*collapse+shake)+' 508 1030)'}>
          <rect x={433} y={1003} width={153} height={45} rx={12} fill="#D59B67" stroke="#845644" strokeWidth={9}/>
          <path d="M452 1013 L552 1016" stroke="#F5C58C" strokeWidth={5}/>
          <circle cx={466} cy={1033} r={6} fill="#70534C"/>
          <circle cx={552} cy={1033} r={6} fill="#70534C"/>
        </g>
        {[0,1].map(i=>
          <g key={i} transform={'rotate('+(Math.sin(f/10+i)*1.5 + (i===0?-3:5)*collapse)+','+(375+i*400)+',1030)'}>
            <rect x={i===0?340:716} y={1000} width={146} height={42} rx={14} fill="#DEA971" stroke="#79523F" strokeWidth={9}/>
            <path d={i===0?'M353 1012 H472':'M731 1012 H848'} stroke="#F6CE98" strokeWidth={7}/>
            <circle cx={i===0?377:751} cy={1029} r={6} fill="#695054"/>
          </g>
        )}
        {dust && Array.from({length:9},(_,i)=>{
          const x=450+(i*37)%230, y=1030+(i*31)%100, opacity=(.25+.17*Math.sin((f+i*7)/9));
          return <circle key={i} cx={x+Math.sin(f/9+i)*10} cy={y+Math.min(160,f*2.4)} r={9+i%3*6} fill="#FFE1B4" opacity={opacity}/>;
        })}
        {/* A thrown rope rolls across the chasm before pulling Max to safety. */}
        {isOutcome && <g>
          <path d="M380 936 Q575 782 807 947" stroke="#4E5262" strokeWidth={24} fill="none" strokeLinecap="round" strokeDasharray="650" strokeDashoffset={650*(1-ropeProgress)}/>
          <path d="M380 936 Q575 782 807 947" stroke="#FFE0A5" strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray="650" strokeDashoffset={650*(1-ropeProgress)}/>
          <g opacity={ropeProgress}>
            <circle cx={807} cy={949} r={29} fill="#E8AF62" stroke="#8C6657" strokeWidth={8}/>
            <circle cx={807} cy={949} r={12} fill="#FFF5D8"/>
          </g>
        </g>}
        <CartoonHero x={322} y={899} scale={1.02} emotion={isOutcome?'happy':phase==='intro'?'hopeful':'worried'} travel={484*escape} lift={lift} rescued={isOutcome}/>
        {phase==='outro' && <LateDragon/>}
        {isOutcome && Array.from({length:10},(_,i)=>{
          const opacity=phase==='outro'?.85:interpolate(f,[24+i,48+i],[0,.9],clamp);
          const x=680+(i*41)%260,y=730+(i*67)%160;
          return <text key={i} x={x} y={y-Math.sin(f/16+i)*18} fill={i%2?'#FFFBE7':'#FFE17C'} fontSize={32+i%4*10} opacity={opacity}>{i%2?'★':'✦'}</text>;
        })}
      </g>
    </svg>
  );
};
