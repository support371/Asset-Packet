import { z } from 'zod';
import { insertPacketSchema, insertSectionSchema, packets, sections } from './schema';

export const errorSchemas = {
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  packets: {
    list: {
      method: 'GET' as const,
      path: '/api/packets',
      responses: {
        200: z.array(z.custom<typeof packets.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/packets/:id',
      responses: {
        200: z.custom<typeof packets.$inferSelect & { sections: typeof sections.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
