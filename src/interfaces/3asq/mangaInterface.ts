
import { z } from 'zod';

const mangaSchema = z.object({
    title: z.string(),
    url: z.string(),
    image: z.string().optional(),
    rating: z.string().optional(),
    chapterNumer: z.string(),
    postedOn: z.string()
});

export type MangaType = z.infer<typeof mangaSchema>;