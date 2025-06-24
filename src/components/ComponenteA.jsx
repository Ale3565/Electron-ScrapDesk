import { AnimatePresence } from 'framer-motion';

// Componente A - Componente Principal
const ComponenteA = ({ setActiveSection }) => {
  const SectionCard = ({ title, onClick }) => (
    <div
      className="bg-white rounded-3xl shadow-lg p-8 mb-6 w-full max-w-2xl mx-auto flex items-center justify-center"
      style={{ height: '200px' }}
      onClick={onClick}
    >
      <h2 className="text-4xl font-bold text-gray-800">{title}</h2>
    </div>
  );

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <AnimatePresence mode="wait">
        <div className="max-w-4xl mx-auto space-y-6">
          <SectionCard title="ACM" onClick={() => setActiveSection('acm')} />
          <SectionCard title="FINANZAS" onClick={() => setActiveSection('finanzas')} />
          <SectionCard title="INVERSIONISTAS" onClick={() => setActiveSection('inversionistas')} />
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ComponenteA;
