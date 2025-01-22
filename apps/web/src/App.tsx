import { trpcReact } from './lib/trpc';

export function App() {
  const q1 = trpcReact.router001.foo.useQuery();
  // go to references does not work work ^^^

  if (q1.data === 'bar') {
  }

  return <h1>{q1.data ?? 'Loading...'}</h1>;
}
