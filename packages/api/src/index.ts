import { router } from '@org/trpc';

import { router001 } from '@org/router001';

export const appRouter = router({
  router001,
});

export type AppRouter = typeof appRouter;
