import { z } from 'zod';
import { users, organizations, dashboards, widgets, packets, sections } from './schema';

export const errorSchemas = {
  unauthorized: z.object({ message: z.string() }),
  notFound: z.object({ message: z.string() }),
  validation: z.object({ message: z.string(), field: z.string().optional() }),
};

export const api = {
  auth: {
    me: {
      method: 'GET' as const,
      path: '/api/me',
      responses: {
        200: z.custom<typeof users.$inferSelect & { organization?: typeof organizations.$inferSelect }>().nullable(),
      },
    }
  },
  dashboards: {
    list: {
      method: 'GET' as const,
      path: '/api/dashboards',
      responses: {
        200: z.array(z.custom<typeof dashboards.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/dashboards/:id',
      responses: {
        200: z.custom<typeof dashboards.$inferSelect & { widgets: typeof widgets.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/dashboards',
      input: z.object({
        name: z.string(),
        description: z.string().optional(),
        type: z.enum(['global', 'personal']),
        widgets: z.array(z.object({
          type: z.string(),
          title: z.string(),
          config: z.any(),
          order: z.number()
        }))
      }),
      responses: {
        201: z.custom<typeof dashboards.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
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
