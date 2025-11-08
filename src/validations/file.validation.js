import { z } from 'zod';

export const getFileSchema = z.object({
  query: z.object({
    path: z.string().min(1, 'Path is required'),
    signed: z
      .string()
      .optional()
      .transform((v) => v === 'true')
      .default('false'),
  }),
});

export const getFilesSchema = z.object({
  body: z.object({
    paths: z.array(z.string().min(1)).nonempty('At least one path is required'),
    signed: z.boolean().optional().default(false),
  }),
});

export const uploadSchema = z.object({
  query: z.object({
    destination: z.string().optional().default(''),
    signed: z
      .string()
      .optional()
      .transform((v) => v === 'true')
      .default('false'),
  }),
});

export const deleteSchema = z.object({
  body: z.object({
    paths: z.array(z.string().min(1)).nonempty('At least one path is required'),
  }),
});
