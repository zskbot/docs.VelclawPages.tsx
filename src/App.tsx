import { useEffect, useState } from 'react';
import Quickstart from './pages/Quickstart';
import DocSection from './pages/DocSection';

function currentSection() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash) return hash;
  const path = window.location.pathname.replace(/\/+$/, '').split('/').pop() || '';
  return path === 'quickstart' || path === 'docs.VelclawPages.tsx' ? 'quickstart' : 'index';
}

export default function App() {
  const [section, setSection] = useState(currentSection);

  useEffect(() => {
    const onHashChange = () => setSection(currentSection());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (section === 'quickstart') return <Quickstart />;
  return <DocSection id={section} />;
}
