import React, { useState } from 'react';

function generatePassword(length, useSymbols, useNumbers, useUppercase) {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
  let chars = lower;
  if (useUppercase) chars += upper;
  if (useNumbers) chars += numbers;
  if (useSymbols) chars += symbols;
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [useSymbols, setUseSymbols] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [password, setPassword] = useState('');

  const handleGenerate = () => {
    setPassword(generatePassword(length, useSymbols, useNumbers, useUppercase));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Generador de Contraseñas Seguras</h2>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Longitud:</label>
        <input type="number" min={6} max={32} value={length} onChange={e => setLength(Number(e.target.value))} className="border rounded px-3 py-1 w-20" />
      </div>
      <div className="mb-4 flex gap-4">
        <label><input type="checkbox" checked={useUppercase} onChange={e => setUseUppercase(e.target.checked)} /> Mayúsculas</label>
        <label><input type="checkbox" checked={useNumbers} onChange={e => setUseNumbers(e.target.checked)} /> Números</label>
        <label><input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} /> Símbolos</label>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleGenerate}>Generar</button>
      {password && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-lg font-mono select-all">
          {password}
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
