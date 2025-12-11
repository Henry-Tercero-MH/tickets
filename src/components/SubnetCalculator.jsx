import React, { useState } from 'react';

function ipToInt(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
}
function intToIp(int) {
  return [24, 16, 8, 0].map(shift => (int >> shift) & 255).join('.');
}
function getSubnetInfo(ip, mask) {
  const ipInt = ipToInt(ip);
  const maskInt = ipToInt(mask);
  const network = ipInt & maskInt;
  const broadcast = network | (~maskInt >>> 0);
  const firstHost = network + 1;
  const lastHost = broadcast - 1;
  const hosts = Math.max(0, lastHost - firstHost + 1);
  return {
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    firstHost: intToIp(firstHost),
    lastHost: intToIp(lastHost),
    hosts
  };
}
function maskFromCidr(cidr) {
  let mask = [];
  for (let i = 0; i < 4; i++) {
    if (cidr >= 8) {
      mask.push(255);
      cidr -= 8;
    } else {
      mask.push(256 - Math.pow(2, 8 - cidr));
      cidr = 0;
    }
  }
  return mask.join('.');
}

const SubnetCalculator = () => {
  const [ip, setIp] = useState('192.168.1.0');
  const [cidr, setCidr] = useState(24);
  const [info, setInfo] = useState(null);

  const handleCalculate = () => {
    const mask = maskFromCidr(Number(cidr));
    setInfo(getSubnetInfo(ip, mask));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Calculadora de IP y Subred</h2>
      <div className="mb-4">
        <label className="block mb-2 font-medium">IP base:</label>
        <input type="text" value={ip} onChange={e => setIp(e.target.value)} className="border rounded px-3 py-1 w-32" placeholder="192.168.1.0" />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">CIDR (máscara):</label>
        <input type="number" min={1} max={32} value={cidr} onChange={e => setCidr(e.target.value)} className="border rounded px-3 py-1 w-20" />
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCalculate}>Calcular</button>
      {info && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <div><strong>Red:</strong> {info.network}</div>
          <div><strong>Broadcast:</strong> {info.broadcast}</div>
          <div><strong>Primer host:</strong> {info.firstHost}</div>
          <div><strong>Último host:</strong> {info.lastHost}</div>
          <div><strong>Hosts disponibles:</strong> {info.hosts}</div>
        </div>
      )}
    </div>
  );
};

export default SubnetCalculator;
