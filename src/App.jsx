


import React, { useState } from 'react';
import PasswordGenerator from './components/PasswordGenerator';
import SubnetCalculator from './components/SubnetCalculator';
import QuoteFormatter from './components/QuoteFormatter';
import NetworkMapDesigner from './components/NetworkMapDesigner';
import ManualTextLabelModal from './components/ManualTextLabelModal';
import GeoDistanceCalculator from './components/GeoDistanceCalculator';

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative animate-modal-in">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10" onClick={onClose}>&times;</button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}



function App() {
  const [modal, setModal] = useState(null); // 'manual', 'password', 'subnet', 'networkmap', or null

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-blue-900 p-8" style={{background: 'linear-gradient(135deg, #0a1833 0%, #1a2747 60%, #2e3a5e 100%)'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-12 text-center text-white drop-shadow-lg tracking-wide">Dashboard IT</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Distancia entre Coordenadas */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-t-4 border-pink-400" onClick={() => setModal('geodistance')}>
            <div className="bg-pink-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-pink-700 mb-2 text-center">Distancia entre Coordenadas</h2>
            <p className="text-gray-500 text-center text-sm">Calcula la distancia exacta en km entre dos puntos geográficos.</p>
          </div>

          {/* Mapa y Diagrama de Red */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-t-4 border-cyan-400" onClick={() => setModal('networkmap')}>
            <div className="bg-cyan-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2m4 0h-2a4 4 0 00-4 4v2m0 0v2m0-2h-2a4 4 0 01-4-4V7a4 4 0 014-4h2a4 4 0 014 4v2" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-cyan-700 mb-2 text-center">Mapa y Diagrama de Red</h2>
            <p className="text-gray-500 text-center text-sm">Marca puntos y dibuja cableado sobre el mapa.</p>
          </div>

          {/* Etiquetas Manuales */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-t-4 border-green-400" onClick={() => setModal('manual')}>
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-green-700 mb-2 text-center">Etiquetas Manuales</h2>
            <p className="text-gray-500 text-center text-sm">Genera e imprime etiquetas personalizadas sin código de barras.</p>
          </div>

          {/* Generador de Contraseñas */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-t-4 border-blue-400" onClick={() => setModal('password')}>
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a5 5 0 00-5 5v2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-blue-700 mb-2 text-center">Generador de Contraseñas</h2>
            <p className="text-gray-500 text-center text-sm">Crea contraseñas seguras y aleatorias con opciones avanzadas.</p>
          </div>

          {/* Calculadora de Subred */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-t-4 border-indigo-400" onClick={() => setModal('subnet')}>
            <div className="bg-indigo-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-indigo-700 mb-2 text-center">Calculadora de Subred</h2>
            <p className="text-gray-500 text-center text-sm">Calcula rangos de IP, máscara de subred y hosts disponibles.</p>
          </div>

          {/* Formateador de Códigos */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-t-4 border-purple-400" onClick={() => setModal('quoteformatter')}>
            <div className="bg-purple-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-purple-700 mb-2 text-center">Formateador de Códigos</h2>
            <p className="text-gray-500 text-center text-sm">Agrega comillas simples a códigos y separa por comas.</p>
          </div>

        </div>
      </div>

      {/* MODALES */}
      <Modal open={modal === 'geodistance'} onClose={() => setModal(null)}>
        <GeoDistanceCalculator />
      </Modal>
      <Modal open={modal === 'networkmap'} onClose={() => setModal(null)}>
        <NetworkMapDesigner />
      </Modal>
      <Modal open={modal === 'manual'} onClose={() => setModal(null)}>
        <ManualTextLabelModal open={true} onClose={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'password'} onClose={() => setModal(null)}>
        <PasswordGenerator />
      </Modal>
      <Modal open={modal === 'subnet'} onClose={() => setModal(null)}>
        <SubnetCalculator />
      </Modal>
      <Modal open={modal === 'quoteformatter'} onClose={() => setModal(null)}>
        <QuoteFormatter />
      </Modal>
    </div>
  );
}

export default App;
