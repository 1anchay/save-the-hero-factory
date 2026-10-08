import {z} from 'zod';
export const PHASE_NAMES = ["intro","danger","choicesIntro","decision","jumpOutcome","dragonOutcome","ropeOutcome","outro"] as const;
export type PhaseName = (typeof PHASE_NAMES)[number];
const NarratedPhase = z.object({
  seconds: z.number().min(1).max(12),
  narration: z.string().min(1).max(200),
});
export const EpisodeSchema = z.object({
  id:z.string().regex(/^episode-[0-9]{3}$/),
  title:z.string().min(5).max(90),
  hero:z.object({name:z.string().min(1).max(24),outfit:z.literal('orange-hoodie')}),
  environment:z.literal('lava-bridge'),
  intro:NarratedPhase,
  danger:NarratedPhase,
  choicesIntro:NarratedPhase,
  decision:NarratedPhase.refine(v=>v.seconds>=7,'Give viewers at least seven full seconds after choices appear'),
  choices:z.tuple([
    z.object({id:z.literal('A'),text:z.string().min(2).max(30),icon:z.string(),color:z.string()}),
    z.object({id:z.literal('B'),text:z.string().min(2).max(30),icon:z.string(),color:z.string()}),
    z.object({id:z.literal('C'),text:z.string().min(2).max(30),icon:z.string(),color:z.string()})
  ]),
  correctChoice:z.literal('B'),
  jumpOutcome:NarratedPhase,
  dragonOutcome:NarratedPhase,
  ropeOutcome:NarratedPhase,
  outro:NarratedPhase,
  audio:z.object({voice:z.string().nullable(),music:z.string().nullable()})
}).refine(x=>x.choicesIntro.seconds>=3,{message:'Show all options before seven-second timer starts'});
export type Episode=z.infer<typeof EpisodeSchema>;
