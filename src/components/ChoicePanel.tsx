import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Episode} from '../schema';
import {fontFamily} from '../styles/palette';

interface Props {
  choices: Episode['choices'];
  selected?: Episode['correctChoice'];
  emphasize?: boolean;
  previewEnter?: boolean;
}

const ChoiceIcon: React.FC<{icon: string}> = ({icon}) => {
  if (icon === 'jump') return <span>↗</span>;
  if (icon === 'rope') return <span>〰</span>;
  if (icon === 'dragon') return <span>🐉</span>;
  return <span>✦</span>;
};

export const ChoicePanel: React.FC<Props> = ({choices, selected, previewEnter=false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <div style={{position:'absolute',left:76,right:76,bottom:230,display:'flex',flexDirection:'column',gap:17,zIndex:15}}>
    {choices.map((choice,i) => {
      const enter = previewEnter ? spring({frame: frame - i*9, fps, config:{damping:13,stiffness:170}}) : 1;
      const highlight = selected === choice.id;
      const subdued = Boolean(selected) && !highlight;
      const bob = !selected && !previewEnter ? Math.sin((frame+i*11)/12)*2 : 0;
      return <div key={choice.id} style={{
        height:114,borderRadius:34,position:'relative',display:'flex',alignItems:'center',gap:28,padding:'12px 26px',
        background:highlight?'#EFFFF2':'#FFF9ED',
        border:`7px solid ${highlight ? '#41CE7F' : '#FFFFFF'}`,
        boxShadow:`0 14px 0 ${highlight?'#27985E':'#B38870'},0 16px 40px #4A476655`,
        opacity:subdued?0.47:1,
        transform:`translateY(${interpolate(enter,[0,1],[160,0],{extrapolateRight:'clamp'})+bob}px) scale(${highlight?1.05:1})`,
      }}>
        <div style={{height:77,width:77,borderRadius:23,display:'grid',placeItems:'center',background:choice.color,
          color:'#fff',fontSize:50,fontFamily,fontWeight:900,textShadow:'0 3px #263B4044',flexShrink:0}}>{choice.id}</div>
        <div style={{fontFamily,color:'#203655',fontSize:44,fontWeight:900,letterSpacing:-1,flex:1}}>{choice.text}</div>
        <div style={{fontSize:55,width:70,textAlign:'center'}}><ChoiceIcon icon={choice.icon}/></div>
        {highlight && <div style={{position:'absolute',right:-24,top:-28,fontSize:69,filter:'drop-shadow(0 4px 3px #38653888)'}}>✅</div>}
      </div>;
    })}
  </div>;
};
