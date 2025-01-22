import { router001Api } from './generated-trpc-client/router001'

export function App() {
  const q1 = router001Api.foo.useQuery()
  //                       ^?
  // go to references work ^^^ if you use the version of typescript from the monorepo

  if (q1.data === 'bar') {
  }

  return <h1>{q1.data ?? 'Loading...'}</h1>
}
