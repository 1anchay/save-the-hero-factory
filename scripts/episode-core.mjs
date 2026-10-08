export const FPS=30;
export const PHASES=["intro","danger","choicesIntro","decision","jumpOutcome","dragonOutcome","ropeOutcome","outro"];
export const OUTCOMES=['jumpOutcome','dragonOutcome','ropeOutcome'];
export function validateEpisode(raw){
 const issues=[];
 if(!raw||typeof raw!=='object')return ['Episode must be an object'];
 if(typeof raw.id!=='string'||!/^episode-[0-9]{3}$/.test(raw.id))issues.push('id must be episode-NNN');
 if(!Array.isArray(raw.choices)||raw.choices.length!==3)issues.push('exactly three choices required');
 else{
  if(raw.choices.map(c=>c.id).join('')!=='ABC')issues.push('choices must be A, B, C in order');
  raw.choices.forEach((choice,i)=>{if(typeof choice.text!=='string'||!choice.text.trim())issues.push('choice '+i+' missing label')});
 }
 if(raw.correctChoice!=='B')issues.push('correctChoice must be B (the rope) in the lava episode');
 for(const p of PHASES){
  const part=raw[p];
  if(!part||!Number.isFinite(part.seconds)||part.seconds<1||part.seconds>12)issues.push(p+'.seconds must be 1..12');
  if(!part||typeof part.narration!=='string'||!part.narration.trim())issues.push(p+'.narration must not be blank');
 }
 if(raw.decision?.seconds<7)issues.push('decision must last at least seven full seconds');
 if(raw.choicesIntro?.seconds<3)issues.push('choicesIntro must show all three choices before timer');
 if(raw.audio?.music!=='music/original-hero-adventure.wav')issues.push('Use only original generated project music');
 if(raw.audio?.voice!==null)issues.push('Voice is generated per phase, audio.voice must be null');
 const durations=PHASES.map(p=>raw[p]?.seconds||0);
 const length=durations.reduce((a,b)=>a+b,0);
 if(length<35||length>45)issues.push('Episode must be 35-45 seconds');
 return issues;
}
export function buildSegments(raw){
 let from=0;return PHASES.map(name=>{
 const duration=Math.round(raw[name].seconds*FPS);
 const segment={name,from,duration,end:from+duration};from+=duration;return segment;
 });
}
