import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {PhaseName} from '../schema';
import {fontFamily} from '../styles/palette';
import voiceTimings from '../generated/voice-timings.json';

interface WordCue {text:string;start:number;end:number}
interface PhaseVoice {file:string;duration:number;words:WordCue[]}
const phases = voiceTimings.phases as Record<string,PhaseVoice|undefined>;

export const NarrationCaption: React.FC<{
  text: string;
  phase: PhaseName;
  y?: number;
}> = ({text,phase,y=280}) => {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const elapsed=f/fps;
  const data=phases[phase];

  // In Remotion Studio without voice assets, show the written narration as
  // an explicitly temporary story card. Production must run voice generation.
  if (!data?.words?.length) {
    return <div style={{
      position:'absolute',top:y,left:68,right:68,textAlign:'center',zIndex:30,
      fontFamily,fontWeight:900,fontSize:48,lineHeight:1.18,color:'#fff',
      WebkitTextStroke:'1px #1B3857',textShadow:'0 5px 8px #122E56BB'
    }}>{text}</div>;
  }

  const words=data.words;
  let current=words.findIndex(w => elapsed>=w.start-.05 && elapsed<=w.end+.08);
  if (current === -1) {
    // Before speech starts or after a completed utterance, hide caption.
    const next=words.findIndex(w => elapsed < w.start);
    if (next===-1 || elapsed < words[0].start-.14) return null;
    current=Math.max(0,next-1);
  }
  const groupStart=Math.floor(current/4)*4;
  const group=words.slice(groupStart,groupStart+4);
  const last=group[group.length-1];
  if (elapsed>last.end+.2) return null;
  const opacity=interpolate(elapsed,[words[groupStart].start-.12,words[groupStart].start+.1],[0,1],{
    extrapolateLeft:'clamp',extrapolateRight:'clamp'
  });

  return <div style={{
    position:'absolute',top:y,left:64,right:64,zIndex:30,display:'flex',
    justifyContent:'center',textAlign:'center',opacity
  }}>
    <div style={{
      padding:'18px 24px',borderRadius:25,
      background:'rgba(25,44,68,.81)',border:'3px solid rgba(255,255,255,.87)',
      boxShadow:'0 11px 30px #142C4670',
      fontFamily,fontWeight:900,fontSize:53,lineHeight:1.19,
      textShadow:'0 3px 2px #172B45',color:'#F7FCFF'
    }}>
      {group.map((word,i)=>{
        const idx=groupStart+i;
        const active=idx===current&&elapsed>=word.start-.06&&elapsed<=word.end+.1;
        return <React.Fragment key={idx}>
          {i>0?' ':''}
          <span style={{
            color:active?'#FFE47A':'#FFFFFF',
            WebkitTextStroke:active?'1px #BD8137':undefined,
            transition:'none'
          }}>{word.text}</span>
        </React.Fragment>;
      })}
    </div>
  </div>;
};
