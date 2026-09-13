import Quickstart from './pages/Quickstart';
import DocSection from './pages/DocSection';

export default function App() {
  const getSection = () => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash) return hash;
    const path = window.location.pathname.replace(/\/+$/, '').split('/').pop() || '';
    return path === 'quickstart' || path === 'docs.VelclawPages.tsx' ? 'quickstart' : 'index';
  };

  const section = getSection();
  if (section === 'quickstart') return <Quickstart />;
  return <DocSection id={section} />;
}
