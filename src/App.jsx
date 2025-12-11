


import React, { useState } from 'react';
import PasswordGenerator from './components/PasswordGenerator';
import SubnetCalculator from './components/SubnetCalculator';

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-10 text-center text-white drop-shadow-lg tracking-wide">Dashboard IT</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                              <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-t-4 border-pink-400" onClick={() => setModal('geodistance')}>
                                <div className="bg-pink-100 rounded-full p-4 mb-4">
                                  <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                                  </svg>
                                </div>
                                <h2 className="text-lg font-bold text-pink-700 mb-2">Distancia entre Coordenadas</h2>
                                <p className="text-gray-500 text-center">Calcula la distancia exacta en km entre dos puntos geográficos.</p>
                              </div>
                          <Modal open={modal === 'geodistance'} onClose={() => setModal(null)}>
                            <GeoDistanceCalculator />
                          </Modal>
                    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-t-4 border-cyan-400" onClick={() => setModal('networkmap')}>
                      <div className="bg-cyan-100 rounded-full p-4 mb-4">
                        <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2m4 0h-2a4 4 0 00-4 4v2m0 0v2m0-2h-2a4 4 0 01-4-4V7a4 4 0 014-4h2a4 4 0 014 4v2" />
                        </svg>
                      </div>
                      <h2 className="text-lg font-bold text-cyan-700 mb-2">Mapa y Diagrama de Red</h2>
                      <p className="text-gray-500 text-center">Marca puntos y dibuja cableado sobre el mapa para crear diagramas de red físicos.</p>
                    </div>
                <Modal open={modal === 'networkmap'} onClose={() => setModal(null)}>
                  <NetworkMapDesigner />
                </Modal>
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-t-4 border-green-400" onClick={() => setModal('manual')}>
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-green-700 mb-2">Etiquetas Manuales</h2>
            <p className="text-gray-500 text-center">Genera e imprime etiquetas personalizadas sin código de barras.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-t-4 border-blue-400" onClick={() => setModal('password')}>
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12v4m0 0v4m0-4h4m-4 0H8m8-8V4m0 0V0m0 4h4m-4 0H8" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-blue-700 mb-2">Generador de Contraseñas</h2>
            <p className="text-gray-500 text-center">Crea contraseñas seguras y aleatorias con opciones avanzadas.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer border-t-4 border-indigo-400" onClick={() => setModal('subnet')}>
            <div className="bg-indigo-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-indigo-700 mb-2">Calculadora de Subred</h2>
            <p className="text-gray-500 text-center">Calcula rangos de IP, máscara de subred y hosts disponibles.</p>
          </div>
        </div>
      </div>

      {/* MODALES */}
      <Modal open={modal === 'manual'} onClose={() => setModal(null)}>
        <ManualTextLabelModal open={true} onClose={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'password'} onClose={() => setModal(null)}>
        <PasswordGenerator />
      </Modal>
      <Modal open={modal === 'subnet'} onClose={() => setModal(null)}>
        <SubnetCalculator />
      </Modal>
    </div>
  );
}

export default App;
