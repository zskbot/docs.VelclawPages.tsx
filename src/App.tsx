import Quickstart from './pages/Quickstart';

// A router (React Router, TanStack Router...) can be dropped in here later
// to switch between pages such as /workspace, /agents, /security — each
// page would follow the same pattern as Quickstart.tsx: read its content
// from a JSON file in /content, render it with the shared components.
export default function App() {
  return <Quickstart />;
}
