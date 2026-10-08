import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Episode, PhaseName} from '../schema';
import {CartoonWorld} from '../components/CartoonWorld';
import {ChoicePanel} from '../components/ChoicePanel';
import {Countdown} from '../components/Countdown';
import {NarrationCaption} from '../components/NarrationCaption';
import {fontFamily} from '../styles/palette';

interface Props {episode: Episode; phase: PhaseName}

export const StoryScene: React.FC<Props> = ({episode,phase}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const entrance=spring({frame,fps,config:{damping:12,stiffness:90}});
  const phaseData=episode[phase];
  const showingChoices=['choicesIntro','decision','outcome'].includes(phase);
  const showTimer=phase==='decision';
  const result=phase==='outcome' ? episode.correctChoice : undefined;
  const isFinal=phase==='outro';
  return <AbsoluteFill style={{background:'#7BCCF0',overflow:'hidden'}}>
    <CartoonWorld phase={phase}/>
    <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(180deg,rgba(255,255,255,.02),transparent 47%,rgba(18,31,50,.10))'}}/>
    <div style={{position:'absolute',top:95,left:68,right:68,height:80,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{fontFamily,fontSize:35,fontWeight:900,color:'#203655',background:'#FFF9E9',borderRadius:40,padding:'14px 25px',border:'4px solid white',boxShadow:'0 7px #66919C'}}>🌋 СПАСИ МАКСА</div>
      <div style={{fontFamily,fontSize:30,fontWeight:900,color:'#FFF',background:'#FF9368',borderRadius:40,padding:'16px 26px',border:'4px solid white'}}>ЭПИЗОД 01</div>
    </div>
    {phase==='intro' && <div style={{position:'absolute',top:670,left:76,right:76,textAlign:'center',fontFamily,fontWeight:900,fontSize:93,lineHeight:1.04,color:'#FFFFFF',WebkitTextStroke:'4px #203655',textShadow:'0 13px #FF9762,0 19px 19px #16274266',transform:`scale(${.75+.25*entrance})`}}>ТОЛЬКО 1 ВЫБОР СПАСЁТ МАКСА!</div>}
    {phase==='danger' && <div style={{position:'absolute',left:45,top:770,transform:`rotate(${-6+Math.sin(frame/3)*2}deg) scale(${entrance})`,fontFamily,fontSize:93,fontWeight:900,color:'#FF535A',WebkitTextStroke:'5px #FFF',filter:'drop-shadow(0 10px 0 #762F50)'}}>ОПАСНО!</div>}
    {showingChoices && <ChoicePanel choices={episode.choices} previewEnter={phase==='choicesIntro'} selected={result}/>}
    {showTimer && <Countdown seconds={episode.decision.seconds}/>}
    {phase==='outcome' && <div style={{position:'absolute',top:625,left:120,right:120,fontFamily,fontSize:90,fontWeight:900,color:'#3FE58D',WebkitTextStroke:'4px #FFFFFF',textAlign:'center',textShadow:'0 10px #2E9366',transform:`scale(${entrance})`}}>СПАСЁН! ✓</div>}
    {isFinal && <div style={{position:'absolute',top:1245,left:100,right:100,padding:26,borderRadius:44,background:'#FFF8E8',border:'8px solid white',boxShadow:'0 15px #AD8570',fontFamily,fontSize:58,textAlign:'center',fontWeight:900,color:'#203655',transform:`scale(${entrance})`}}>А ТЫ БЫ СПАС МАКСА?</div>}
    <NarrationCaption phase={phase} text={phaseData.narration} y={phase==='intro'?310:phase==='danger'?245:phase==='outcome'?265:245}/>
    {phase==='decision' && <div style={{position:'absolute',bottom:630,left:110,right:110,fontSize:41,fontWeight:900,color:'#253B56',fontFamily,textAlign:'center',background:'#FFF5DC',padding:18,borderRadius:30,opacity:interpolate(frame,[0,7],[0,1],{extrapolateRight:'clamp'})}}>У ТЕБЯ ЕСТЬ 6 СЕКУНД!</div>}
  </AbsoluteFill>;
};
