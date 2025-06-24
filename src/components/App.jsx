import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import '../styles/index.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  // Efecto para manejar la maximización de la ventana
  useEffect(() => {
    if (window.electron) {
      window.electron.onMaximizeChange(() => {
        // La función está preparada para cuando se necesite implementar la maximización
      });
    }
  }, []);

  const handleWindowControl = async (action) => {
    try {
      if (window.electron?.windowControl) {
        await window.electron.windowControl(action);
      } else {
        console.error('La función windowControl no está disponible');
      }
    } catch (error) {
      console.error('Error al controlar la ventana:', error);
    }
  };

  const handleCloseApp = async () => {
    try {
      if (window.electron?.closeApp) {
        await window.electron.closeApp();
      } else {
        console.error('La función closeApp no está disponible');
      }
    } catch (error) {
      console.error('Error al cerrar la aplicación:', error);
    }
  };

  // Iconos personalizados para cada sección
  const sidebarIcons = {
    home: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    edit: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
    delete: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
  };

  // Componente de tarjeta para cada sección
  const SectionCard = ({ title, onClick }) => (
    <div
      className="bg-white rounded-3xl shadow-lg p-8 mb-6 w-full max-w-2xl mx-auto flex items-center justify-center"
      style={{ height: '200px' }}
      onClick={onClick}
    >
      <h2 className="text-4xl font-bold text-gray-800">{title}</h2>
    </div>
  );

  // Contenido de los paneles
  const renderPanelContent = () => {
    switch (activeSection) {
      case 'acm':
        return (
          <div>
            <h2 className="text-2xl mb-4">ACM Panel</h2>
            <input type="text" placeholder="Ingrese su texto" className="border p-2 mb-4 w-full" />
            <input
              type="number"
              placeholder="Ingrese un número"
              className="border p-2 mb-4 w-full"
            />
          </div>
        );
      case 'finanzas':
        return (
          <div>
            <h2 className="text-2xl mb-4">Finanzas Panel</h2>
            <input type="text" placeholder="Ingrese su texto" className="border p-2 mb-4 w-full" />
            <input
              type="number"
              placeholder="Ingrese un número"
              className="border p-2 mb-4 w-full"
            />
          </div>
        );
      case 'inversionistas':
        return (
          <div>
            <h2 className="text-2xl mb-4">Inversionistas Panel</h2>
            <input type="text" placeholder="Ingrese su texto" className="border p-2 mb-4 w-full" />
            <input
              type="number"
              placeholder="Ingrese un número"
              className="border p-2 mb-4 w-full"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f7fb]">
      {/* Barra lateral oscura */}
      <div className="w-16 bg-[#1E1E1E] flex flex-col items-center py-6 space-y-8">
        {Object.entries(sidebarIcons).map(([key, icon]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`p-2 rounded-lg text-gray-400 hover:text-gray-200 transition-colors duration-200 ${
              activeSection === key ? 'text-white bg-gray-700' : ''
            }`}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Barra superior estilo macOS */}
        <div className="h-10 flex items-center justify-between px-4 bg-white border-b border-gray-200 relative">
          <div className="flex space-x-2 absolute left-4">
            <button
              onClick={() => handleWindowControl('close')}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
            />
            <button
              onClick={() => handleWindowControl('minimize')}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
            />
            <button
              onClick={() => handleWindowControl('maximize')}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"
            />
          </div>
          <h1 className="text-center flex-1 text-xl font-semibold">ScrapDesk</h1>
          <button
            onClick={handleCloseApp}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <span className="text-lg font-semibold">×</span>
          </button>
        </div>

        {/* Área de contenido con tarjetas */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <div className="max-w-4xl mx-auto space-y-6">
              <SectionCard title="ACM" onClick={() => setActiveSection('acm')} />
              <SectionCard title="FINANZAS" onClick={() => setActiveSection('finanzas')} />
              <SectionCard
                title="INVERSIONISTAS"
                onClick={() => setActiveSection('inversionistas')}
              />
            </div>
          </AnimatePresence>
          <div className="p-8">{renderPanelContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
