


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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative animate-modal-in max-h-[90vh] overflow-y-auto">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10" onClick={onClose}>&times;</button>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}



function App() {
  const [modal, setModal] = useState(null); // 'manual', 'password', 'subnet', 'networkmap', or null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header profesional */}
        <div className="mb-8 sm:mb-12">
          <div className="rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-blue-400" style={{
            background: 'linear-gradient(90deg, #152c50 0%, #0a1628 100%)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            zIndex: 10
          }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Centro de Herramientas IT</h1>
                <p className="text-slate-300 text-sm sm:text-base">Soluciones tecnológicas para optimizar tu flujo de trabajo</p>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          
          {/* Distancia entre Coordenadas */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-rose-400 group" onClick={() => setModal('geodistance')}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">GEO</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Distancia Geográfica</h2>
              <p className="text-slate-600 text-sm leading-relaxed">Calcula la distancia exacta entre dos puntos GPS en kilómetros.</p>
            </div>
          </div>

          {/* Mapa y Diagrama de Red */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-cyan-400 group" onClick={() => setModal('networkmap')}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">RED</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Diagrama de Red</h2>
              <p className="text-slate-600 text-sm leading-relaxed">Diseña y visualiza la topología de tu infraestructura de red.</p>
            </div>
          </div>

          {/* Etiquetas Manuales */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-emerald-400 group" onClick={() => setModal('manual')}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">PRINT</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Etiquetas Personalizadas</h2>
              <p className="text-slate-600 text-sm leading-relaxed">Genera e imprime etiquetas profesionales sin código de barras.</p>
            </div>
          </div>

          {/* Generador de Contraseñas */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-blue-400 group" onClick={() => setModal('password')}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">SEC</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Generador de Contraseñas</h2>
              <p className="text-slate-600 text-sm leading-relaxed">Crea contraseñas robustas y seguras con criterios personalizables.</p>
            </div>
          </div>

          {/* Calculadora de Subred */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-violet-400 group" onClick={() => setModal('subnet')}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-1 rounded-full">IP</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Calculadora de Subred</h2>
              <p className="text-slate-600 text-sm leading-relaxed">Calcula rangos de IP, máscaras de subred y hosts disponibles.</p>
            </div>
          </div>

          {/* Formateador de Códigos */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-fuchsia-400 group" onClick={() => setModal('quoteformatter')}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-lg p-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-fuchsia-600 bg-fuchsia-50 px-2 py-1 rounded-full">CODE</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Formateador de Códigos</h2>
              <p className="text-slate-600 text-sm leading-relaxed">Formatea códigos con comillas simples y separación por comas.</p>
            </div>
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
