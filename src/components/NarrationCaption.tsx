import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {fontFamily} from '../styles/palette';

/** Foundation subtitle card: Stage 4 adds word-level TTS timestamps and highlighting. */
export const NarrationCaption: React.FC<{text:string; label?:string; y?:number}> = ({text,label,y=285}) => {
  const frame=useCurrentFrame();
  const opacity=interpolate(frame,[0,7],[0,1],{extrapolateRight:'clamp'});
  return <div style={{position:'absolute',top:y,left:68,right:68,zIndex:30,opacity,display:'flex',justifyContent:'center',textAlign:'center'}}>
    <div style={{border:'5px solid #FFFFFF',borderRadius:38,padding:'22px 31px',background:'rgba(32,54,85,.9)',boxShadow:'0 14px 0 #1C304C55,0 18px 32px #10274655'}}>
      {label && <div style={{fontSize:30,fontWeight:900,fontFamily,letterSpacing:4,color:'#FFE77B',marginBottom:8}}>{label}</div>}
      <div style={{fontFamily,fontWeight:900,fontSize:49,lineHeight:1.14,color:'#FFFFFF',textShadow:'0 3px 1px #162742'}}>{text}</div>
    </div>
  </div>;
};
