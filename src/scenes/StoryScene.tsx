import React from 'react';
import {AbsoluteFill,interpolate,spring,useCurrentFrame,useVideoConfig} from 'remotion';
import type {Episode,PhaseName} from '../schema';
import {CartoonWorld} from '../components/CartoonWorld';
import {ChoicePanel} from '../components/ChoicePanel';
import {Countdown} from '../components/Countdown';
import {NarrationCaption} from '../components/NarrationCaption';
import {fontFamily} from '../styles/palette';

interface Props{episode:Episode;phase:PhaseName}
const outcomes={
 jumpOutcome:{id:'A',title:'ПРЫЖОК',emoji:'💨',status:'НЕУДАЧА!',sub:'До другого берега далеко!',color:'#FF6870',dark:'#A9455C'},
 dragonOutcome:{id:'C',title:'ДРАКОН',emoji:'🐉',status:'НЕ ПОМОГ!',sub:'Он занят своим делом!',color:'#9670EE',dark:'#684FA6'},
 ropeOutcome:{id:'B',title:'ВЕРЁВКА',emoji:'🪢',status:'МАКС СПАСЁН!',sub:'Это правильное решение!',color:'#38C992',dark:'#278965'},
} as const;

const OutcomeBadge:React.FC<{phase:keyof typeof outcomes}>=({phase})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const o=outcomes[phase];
 const enter=spring({frame:f,fps,config:{damping:11,stiffness:105}});
 const applause=phase==='ropeOutcome' && f>48;
 return <>
 <div style={{
   position:'absolute',left:80,right:80,top:592,height:110,zIndex:16,display:'flex',
   alignItems:'center',justifyContent:'center',gap:26,fontFamily,fontWeight:900,fontSize:47,
   color:'#fff',background:o.color,border:'7px solid #FFF8DD',borderRadius:40,
   boxShadow:'0 15px 0 '+o.dark+',0 18px 35px #172D5670',
   transform:'translateY('+(1-enter)*(-160)+'px) rotate('+Math.sin(f/14)*1.4+'deg)'
  }}>
   <div style={{borderRadius:23,background:'#FFFFFF',color:o.dark,padding:'5px 25px'}}>{o.id}</div>
   <span>{o.emoji} {o.title}</span>
 </div>
 <div style={{
   position:'absolute',bottom:342,left:72,right:72,zIndex:18,padding:'22px 26px 25px',
   borderRadius:42,textAlign:'center',background:'rgba(255,252,237,.98)',
   border:'8px solid #FFFFFF',boxShadow:'0 12px 0 '+o.dark+',0 20px 36px #19385460',
   transform:'scale('+(0.72+0.28*spring({frame:f-26,fps,config:{stiffness:150,damping:11}}))+')',
   fontFamily
 }}>
  <div style={{color:o.dark,fontSize:66,fontWeight:1000,letterSpacing:1}}>{applause?'🎉 ':''}{o.status}</div>
  <div style={{color:'#294760',fontSize:39,fontWeight:800,marginTop:8}}>{o.sub}</div>
 </div>
 </>;
};

export const StoryScene:React.FC<Props>=({episode,phase})=>{
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const enter=spring({frame,fps,config:{damping:12,stiffness:95}});
 const showingChoices=phase==='choicesIntro'||phase==='decision';
 const isOutcome=phase==='jumpOutcome'||phase==='dragonOutcome'||phase==='ropeOutcome';
 const roleIndex=phase==='jumpOutcome'?1:phase==='dragonOutcome'?2:3;
 const danger=phase==='danger';
 return <AbsoluteFill style={{background:'#A9E6ED',overflow:'hidden'}}>
  <CartoonWorld phase={phase}/>
  {/* subtle cinematic top and bottom diffusion plus hand-authored gold rim */}
  <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(180deg,rgba(14,38,69,.17),transparent 18%,transparent 63%,rgba(14,38,69,.22))'}}/>
  <div style={{position:'absolute',top:74,left:67,right:67,display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:24}}>
    <div style={{background:'#FFF9E9',border:'5px solid white',borderRadius:32,padding:'12px 23px',boxShadow:'0 8px 0 #4E94A5',
      fontFamily,fontWeight:900,fontSize:35,color:'#243E5A'}}>🌋 СПАСИ МАКСА</div>
    <div style={{background:'#FF995E',border:'5px solid white',borderRadius:32,padding:'14px 20px',boxShadow:'0 8px 0 #CD6553',
      fontFamily,fontWeight:900,fontSize:28,color:'#fff'}}>ИСТОРИЯ №1</div>
  </div>
  {phase==='intro'&&<div style={{
    position:'absolute',left:65,right:65,top:670,fontFamily,textAlign:'center',zIndex:9,
    fontWeight:1000,fontSize:91,lineHeight:1.06,color:'#FFFCEB',
    WebkitTextStroke:'4px #244A64',textShadow:'0 12px #FF8B57,0 19px 23px #203E6988',
    transform:'scale('+(0.65+0.35*enter)+')'
  }}>КАК СПАСТИ МАКСА?!</div>}
  {danger&&<>
    <div style={{position:'absolute',left:65,top:670,fontFamily,fontSize:99,fontWeight:1000,
      color:'#FF636D',WebkitTextStroke:'5px #fff',textShadow:'0 10px #AA4350',transform:'rotate('+(-7+Math.sin(frame/4)*5)+'deg) scale('+enter+')'}}>ОПАСНО!</div>
    <div style={{position:'absolute',left:93,top:820,fontFamily,fontSize:54,fontWeight:900,color:'#fff',
      WebkitTextStroke:'2px #C45C4D',transform:'translateY('+Math.sin(frame/12)*6+'px)'}}>МОСТ РУШИТСЯ!</div>
  </>}
  {showingChoices&&<>
    <div style={{
      position:'absolute',left:120,right:120,top:660,textAlign:'center',zIndex:13,
      fontFamily,fontSize:55,fontWeight:1000,color:'#fff',
      WebkitTextStroke:'2px #345777',textShadow:'0 8px 15px #283F5577'
    }}>{phase==='decision'?'ТВОЙ ВЫБОР!':'КАКОЙ СПОСОБ ЛУЧШЕ?'}</div>
    <ChoicePanel choices={episode.choices} previewEnter={phase==='choicesIntro'}/>
  </>}
  {phase==='decision'&&<>
    <Countdown seconds={episode.decision.seconds}/>
    <div style={{position:'absolute',left:150,right:150,bottom:649,padding:'13px 20px',
      background:'#FFF1D2',border:'5px solid #FFFFFF',borderRadius:29,textAlign:'center',
      fontFamily,fontSize:41,fontWeight:900,color:'#25435C',boxShadow:'0 8px 0 #D69E71'}}>
      У ТЕБЯ {episode.decision.seconds} СЕКУНД!
    </div>
  </>}
  {isOutcome&&<OutcomeBadge phase={phase as keyof typeof outcomes}/>}
  {phase==='outro'&&<>
    <div style={{position:'absolute',top:665,left:70,right:70,textAlign:'center',fontFamily,
      fontWeight:1000,fontSize:73,color:'#FFFCEB',WebkitTextStroke:'3px #1D4F6B',
      textShadow:'0 12px #F08C59',transform:'scale('+(0.78+0.22*enter)+')'}}>
      МАКС В БЕЗОПАСНОСТИ! 🎉
    </div>
    <div style={{position:'absolute',bottom:355,left:75,right:75,padding:31,textAlign:'center',
      borderRadius:43,background:'#FFF9E7',border:'7px solid white',boxShadow:'0 14px #BF9D81',
      fontFamily,fontWeight:900,fontSize:57,color:'#284961'}}>
      А ТЫ КАКОЙ ВАРИАНТ ВЫБРАЛ?
    </div>
  </>}
  {isOutcome&&<div style={{position:'absolute',top:176,right:82,zIndex:26,fontFamily,fontSize:27,
    fontWeight:900,color:'#315C72',background:'#E9FCFF',borderRadius:22,padding:'9px 20px'}}>
    ПРОВЕРКА {roleIndex}/3
  </div>}
  <NarrationCaption text={episode[phase].narration} phase={phase} y={phase==='intro'?293:phase==='ropeOutcome'?257:235}/>
 </AbsoluteFill>;
};
