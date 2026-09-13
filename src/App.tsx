import { useEffect, useState } from 'react';
import Quickstart from './pages/Quickstart';
import DeployAPI from './pages/DeployAPI';
import DeployCLI from './pages/DeployCLI';
import AgentEcosystem from './pages/AgentEcosystem';
import ApiKeys from './pages/ApiKeys';
import PluginMarketplace from './pages/PluginMarketplace';
import DocSection from './pages/DocSection';
function currentSection() { const hash = window.location.hash.replace(/^#\/?/, ''); if (hash) return hash; const path = window.location.pathname.replace(/\/+$/, '').split('/').pop() || ''; return path === 'quickstart' || path === 'docs.VelclawPages.tsx' ? 'quickstart' : 'index'; }
export default function App() { const [section, setSection] = useState(currentSection); useEffect(() => { const onHashChange = () => setSection(currentSection()); window.addEventListener('hashchange', onHashChange); return () => window.removeEventListener('hashchange', onHashChange); }, []); if (section === 'quickstart') return <Quickstart />; if (section === 'api-keys') return <ApiKeys />; if (section === 'deploy-cli') return <DeployCLI />; if (section === 'deploy-api') return <DeployAPI />; if (section === 'agent-ecosystem') return <AgentEcosystem />; if (section === 'plugins') return <PluginMarketplace />; return <DocSection id={section} />; }
