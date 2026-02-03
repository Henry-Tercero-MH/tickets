import React, { useState } from 'react';

export default function ITGuides() {
  const [selectedGuide, setSelectedGuide] = useState('');

  const guides = {
    'ponchar-cable': {
      title: 'Cómo Ponchar un Cable de Red (RJ45)',
      icon: '🔌',
      color: 'blue',
      steps: [
        {
          title: 'Materiales Necesarios',
          content: '• Cable UTP Cat5e/6\n• Conectores RJ45\n• Ponchadora/Crimpadora\n• Probador de cables\n• Tijeras/Cortador\n• Pelacables (opcional)'
        },
        {
          title: 'Paso 1: Cortar el Cable',
          content: 'Corta el cable a la longitud deseada dejando unos 5cm extra para trabajar.'
        },
        {
          title: 'Paso 2: Pelar el Cable',
          content: 'Pela la cubierta externa aproximadamente 2-3cm. Ten cuidado de no dañar los cables internos.'
        },
        {
          title: 'Paso 3: Ordenar los Cables',
          content: 'Desenreda y ordena los 8 cables según el estándar:\n\n🔵 T568B (Más común):\n1. Blanco-Naranja\n2. Naranja\n3. Blanco-Verde\n4. Azul\n5. Blanco-Azul\n6. Verde\n7. Blanco-Café\n8. Café\n\n🔵 T568A (Alternativo):\n1. Blanco-Verde\n2. Verde\n3. Blanco-Naranja\n4. Azul\n5. Blanco-Azul\n6. Naranja\n7. Blanco-Café\n8. Café\n\n⚠️ Usa el MISMO estándar en ambos extremos'
        },
        {
          title: 'Paso 4: Alinear y Cortar',
          content: 'Alinea los cables en orden, mantenlos planos y recorta las puntas para que queden parejos (aproximadamente 1.5cm de largo).'
        },
        {
          title: 'Paso 5: Insertar en el Conector',
          content: 'Inserta los cables en el conector RJ45 con la pestaña hacia abajo. Asegúrate de que:\n• Los cables lleguen hasta el fondo\n• La cubierta externa entre al conector\n• Los cables mantengan el orden'
        },
        {
          title: 'Paso 6: Ponchar',
          content: 'Inserta el conector en la ponchadora y presiona firmemente hasta escuchar un "clic". Esto hará que las cuchillas perforen el aislante.'
        },
        {
          title: 'Paso 7: Probar',
          content: 'Usa un probador de cables para verificar que todos los pines estén correctamente conectados. Las luces deben encender en secuencia 1-8.'
        }
      ],
      tips: [
        '💡 Cable directo: Mismo estándar en ambos extremos (PC-Switch)',
        '💡 Cable cruzado: T568A en un extremo, T568B en el otro (PC-PC)',
        '⚠️ No desenredes más de 1.5cm de los pares trenzados',
        '⚠️ Verifica siempre con el probador antes de instalar'
      ]
    },
    'rack-instalacion': {
      title: 'Instalación de Equipos en Rack',
      icon: '🗄️',
      color: 'green',
      steps: [
        {
          title: 'Preparación',
          content: '• Rack de piso o pared\n• Tornillos y tuercas jaula\n• Nivel\n• Destornillador\n• Organizador de cables\n• PDU (Power Distribution Unit)'
        },
        {
          title: 'Paso 1: Planificación',
          content: 'Planifica la distribución:\n• Equipos pesados abajo\n• Switch de core en el centro\n• Patch panel arriba\n• PDU en un lateral\n• Dejar 1U entre equipos para ventilación'
        },
        {
          title: 'Paso 2: Instalar PDU',
          content: 'Instala la regleta de energía (PDU) verticalmente en un lateral del rack usando tornillos.'
        },
        {
          title: 'Paso 3: Montar Equipos',
          content: 'Instala cada equipo de abajo hacia arriba:\n1. Alinea con los rieles\n2. Usa tuercas jaula en los agujeros\n3. Atornilla firmemente\n4. Verifica que esté nivelado'
        },
        {
          title: 'Paso 4: Cableado Ordenado',
          content: 'Conecta los cables:\n• Usa patch panels\n• Etiqueta todos los cables\n• Usa organizadores horizontales\n• Deja cierta holgura\n• Separa datos de energía'
        },
        {
          title: 'Paso 5: Energizar',
          content: 'Conecta la energía:\n1. Verifica voltaje correcto\n2. Conecta PDU a UPS si existe\n3. Enciende equipos de abajo hacia arriba\n4. Espera 30 seg entre equipos'
        }
      ],
      tips: [
        '📏 1U = 1.75 pulgadas (44.45mm) de altura',
        '💡 Deja espacio para ventilación y futuros cambios',
        '🏷️ Etiqueta TODO: equipos, puertos, cables',
        '⚡ Nunca excedas la capacidad del PDU'
      ]
    },
    'switch-config-basica': {
      title: 'Configuración Básica de Switch',
      icon: '🔀',
      color: 'purple',
      steps: [
        {
          title: 'Acceso al Switch',
          content: 'Opciones de acceso:\n• Cable de consola (serial/USB)\n• SSH (si ya está configurado)\n• Web UI (algunos modelos)\n\nConecta con PuTTY o terminal:\n• Baudrate: 9600\n• Data bits: 8\n• Parity: None\n• Stop bits: 1'
        },
        {
          title: 'Paso 1: Modo Privilegiado',
          content: 'Switch> enable\nSwitch# configure terminal\nSwitch(config)#'
        },
        {
          title: 'Paso 2: Nombre del Switch',
          content: 'Switch(config)# hostname SW-CORE-01\nSW-CORE-01(config)#'
        },
        {
          title: 'Paso 3: Contraseña Enable',
          content: 'SW-CORE-01(config)# enable secret MiPassword123\n(Cifrado automático)'
        },
        {
          title: 'Paso 4: Configurar VLAN de Gestión',
          content: 'SW-CORE-01(config)# interface vlan 1\nSW-CORE-01(config-if)# ip address 192.168.1.10 255.255.255.0\nSW-CORE-01(config-if)# no shutdown\nSW-CORE-01(config-if)# exit'
        },
        {
          title: 'Paso 5: Gateway Predeterminado',
          content: 'SW-CORE-01(config)# ip default-gateway 192.168.1.1'
        },
        {
          title: 'Paso 6: SSH (Recomendado)',
          content: 'SW-CORE-01(config)# ip domain-name miempresa.local\nSW-CORE-01(config)# crypto key generate rsa\n(Elige 2048 bits)\nSW-CORE-01(config)# line vty 0 15\nSW-CORE-01(config-line)# transport input ssh\nSW-CORE-01(config-line)# login local\nSW-CORE-01(config-line)# exit'
        },
        {
          title: 'Paso 7: Usuario Local',
          content: 'SW-CORE-01(config)# username admin privilege 15 secret AdminPass123'
        },
        {
          title: 'Paso 8: Guardar Configuración',
          content: 'SW-CORE-01# write memory\no\nSW-CORE-01# copy running-config startup-config'
        }
      ],
      tips: [
        '🔒 Usa contraseñas fuertes y únicas',
        '💾 Siempre guarda la configuración',
        '📝 Documenta los cambios realizados',
        '🧪 Prueba en horario de bajo uso'
      ]
    },
    'troubleshooting-red': {
      title: 'Troubleshooting de Red Paso a Paso',
      icon: '🔧',
      color: 'orange',
      steps: [
        {
          title: 'Nivel 1: Físico',
          content: 'Verificar:\n✓ Cable conectado correctamente\n✓ Luces de enlace (link lights) en tarjeta de red\n✓ Cable no dañado\n✓ Switch/Router encendido\n✓ Puerto del switch funcionando'
        },
        {
          title: 'Nivel 2: Conectividad Local',
          content: 'En Windows:\nipconfig /all\n\nEn Linux:\nip addr show\nifconfig\n\nVerificar:\n• IP asignada correctamente\n• Máscara de subred correcta\n• Gateway configurado'
        },
        {
          title: 'Nivel 3: Ping al Gateway',
          content: 'ping 192.168.1.1\n\nSi falla:\n• Problema en red local\n• Verificar firewall\n• Revisar configuración IP\n• Probar renovar IP: ipconfig /renew'
        },
        {
          title: 'Nivel 4: Ping a DNS',
          content: 'ping 8.8.8.8\n\nSi funciona pero no navega:\n• Problema de DNS\n• Probar: ipconfig /flushdns\n• Cambiar DNS a 8.8.8.8'
        },
        {
          title: 'Nivel 5: Resolución DNS',
          content: 'nslookup google.com\n\nVerificar que resuelva la IP correctamente'
        },
        {
          title: 'Nivel 6: Traceroute',
          content: 'Windows: tracert google.com\nLinux: traceroute google.com\n\nIdentifica dónde se pierde la conexión'
        },
        {
          title: 'Comandos Útiles',
          content: '• ipconfig /release\n• ipconfig /renew\n• ipconfig /flushdns\n• netsh winsock reset\n• netsh int ip reset\n• arp -a (ver tabla ARP)\n• route print (ver tabla de rutas)'
        }
      ],
      tips: [
        '🔍 Siempre empieza desde la capa física',
        '📊 Documenta los resultados de cada prueba',
        '🔄 Reiniciar puede resolver el 50% de problemas',
        '📞 Ten a mano info de ISP/proveedor'
      ]
    },
    'server-rack-cabling': {
      title: 'Mejores Prácticas de Cableado en Rack',
      icon: '📡',
      color: 'cyan',
      steps: [
        {
          title: 'Principios Básicos',
          content: '1. Cable Management es CLAVE\n2. Documentar TODO\n3. Dejar espacio para crecimiento\n4. Separar datos de energía\n5. Etiquetar ambos extremos'
        },
        {
          title: 'Código de Colores Sugerido',
          content: '🔴 Rojo: Producción/Crítico\n🔵 Azul: Gestión/Management\n🟡 Amarillo: DMZ\n🟢 Verde: Interno/LAN\n⚫ Negro: Enlaces trunk\n⚪ Blanco: Temporal/Testing\n🟠 Naranja: Backbone/Uplink'
        },
        {
          title: 'Longitud de Cables',
          content: 'Usa largos estándar:\n• 0.5m (1.5ft) - Patch panel a switch\n• 1m (3ft) - Entre equipos contiguos\n• 2m (6ft) - Entre equipos separados\n• 3m+ - Solo si es necesario\n\n⚠️ Evita cables muy largos enrollados'
        },
        {
          title: 'Etiquetado',
          content: 'Formato sugerido:\n[EDIFICIO]-[PISO]-[SALA]-[RACK]-[PUERTO]\n\nEjemplo:\nED1-P2-SERV-R3-P24\n\nUsa etiquetadoras profesionales o marcadores permanentes'
        },
        {
          title: 'Organización Vertical',
          content: 'De arriba hacia abajo:\n1. Patch Panel\n2. Organizador horizontal\n3. Switch de acceso\n4. Organizador horizontal\n5. Switch core\n6. Organizador horizontal\n7. Servidores\n8. UPS (abajo, es pesado)'
        },
        {
          title: 'Radio de Curvatura',
          content: 'Cat5e/Cat6:\n• Radio mínimo: 4x diámetro del cable\n• No doblar en ángulos de 90°\n• Usar guías de cable curvas\n• No apretar las amarras mucho'
        }
      ],
      tips: [
        '📸 Toma fotos ANTES de hacer cambios',
        '🗂️ Mantén un diagrama actualizado',
        '🏷️ Etiqueta ANTES de instalar',
        '🎨 Respeta el código de colores elegido'
      ]
    }
  };

  const guidesList = [
    { id: 'ponchar-cable', name: 'Ponchar Cable RJ45', icon: '🔌', color: 'blue' },
    { id: 'rack-instalacion', name: 'Instalación en Rack', icon: '🗄️', color: 'green' },
    { id: 'switch-config-basica', name: 'Config. Básica Switch', icon: '🔀', color: 'purple' },
    { id: 'troubleshooting-red', name: 'Troubleshooting de Red', icon: '🔧', color: 'orange' },
    { id: 'server-rack-cabling', name: 'Cableado Estructurado', icon: '📡', color: 'cyan' }
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 border-blue-400 bg-blue-50 text-blue-700',
    green: 'from-green-500 to-green-600 border-green-400 bg-green-50 text-green-700',
    purple: 'from-purple-500 to-purple-600 border-purple-400 bg-purple-50 text-purple-700',
    orange: 'from-orange-500 to-orange-600 border-orange-400 bg-orange-50 text-orange-700',
    cyan: 'from-cyan-500 to-cyan-600 border-cyan-400 bg-cyan-50 text-cyan-700'
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="text-center mb-4 sm:mb-6 sticky top-0 bg-white pb-4 z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Guías y Procedimientos IT</h2>
        <p className="text-sm sm:text-base text-gray-600">Tutoriales paso a paso para tareas técnicas comunes</p>
      </div>

      {!selectedGuide ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {guidesList.map((guide) => (
            <button
              key={guide.id}
              onClick={() => setSelectedGuide(guide.id)}
              className={`p-4 sm:p-6 rounded-xl border-2 text-left hover:shadow-lg transition-all group ${
                colorClasses[guide.color].split(' ')[2] + ' ' + colorClasses[guide.color].split(' ')[3]
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl sm:text-4xl">{guide.icon}</span>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:scale-105 transition-transform">
                  {guide.name}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Click para ver el tutorial completo</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedGuide('')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base"
          >
            ← Volver a la lista
          </button>

          <div className={`p-4 sm:p-6 rounded-xl border-l-4 bg-gradient-to-r ${colorClasses[guides[selectedGuide].color].split(' ').slice(0, 2).join(' ')}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl sm:text-5xl">{guides[selectedGuide].icon}</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">{guides[selectedGuide].title}</h3>
            </div>
          </div>

          <div className="space-y-4">
            {guides[selectedGuide].steps.map((step, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-gray-800 pt-1">{step.title}</h4>
                </div>
                <div className="ml-11 text-sm sm:text-base text-gray-700 whitespace-pre-line leading-relaxed font-mono">
                  {step.content}
                </div>
              </div>
            ))}
          </div>

          {guides[selectedGuide].tips && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-5 rounded-lg">
              <h4 className="font-bold text-amber-800 mb-3 text-sm sm:text-base">💡 Tips y Advertencias</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900">
                {guides[selectedGuide].tips.map((tip, index) => (
                  <li key={index} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
