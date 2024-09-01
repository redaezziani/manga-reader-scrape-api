
import { z } from 'zod';

const mangaSchema = z.object({
    title: z.string(),
    image: z.string().optional(),
    chapterNumer: z.string().optional(),
    postedOn: z.string().optional(),
});

export type MangaType = z.infer<typeof mangaSchema>;