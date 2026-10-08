import {z} from 'zod';

const NarratedPhase = z.object({
  seconds: z.number().min(1).max(12),
  narration: z.string().min(1).max(200),
});

export const EpisodeSchema = z.object({
  id: z.string().regex(/^episode-[0-9]{3}$/),
  title: z.string().min(5).max(72),
  hero: z.object({
    name: z.string().min(1).max(24),
    outfit: z.literal('orange-hoodie'),
  }),
  environment: z.literal('lava-bridge'),
  intro: NarratedPhase,
  danger: NarratedPhase,
  choicesIntro: NarratedPhase,
  decision: NarratedPhase.refine(v => v.seconds >= 6, 'Give viewers at least six full seconds after choices appear'),
  choices: z.tuple([
    z.object({id: z.literal('A'), text: z.string().min(2).max(30), icon: z.string(), color: z.string()}),
    z.object({id: z.literal('B'), text: z.string().min(2).max(30), icon: z.string(), color: z.string()}),
    z.object({id: z.literal('C'), text: z.string().min(2).max(30), icon: z.string(), color: z.string()}),
  ]),
  correctChoice: z.enum(['A', 'B', 'C']),
  outcome: NarratedPhase,
  outro: NarratedPhase,
  audio: z.object({
    voice: z.string().nullable(),
    music: z.string().nullable(),
  }),
});

export type Episode = z.infer<typeof EpisodeSchema>;
export type PhaseName = 'intro' | 'danger' | 'choicesIntro' | 'decision' | 'outcome' | 'outro';
