"use client"; // ¡Esta es la línea más importante! Debe estar al principio.

import { useState } from 'react';
import { Prisma } from '@prisma/client';

// Definimos el tipo de dato para las evaluaciones con sus relaciones
type EvaluacionConRelaciones = Prisma.evaluacionesGetPayload<{
  include: {
    alumno: true;
    evaluador: { include: { profesor: true; supervisor: true } };
    modulo: { include: { modulo_mic: true; modulo_mdic: true } };
  };
}>;

// Este es el componente que maneja toda la interactividad
export function EvaluacionesCliente({ evaluaciones }: { evaluaciones: EvaluacionConRelaciones[] }) {
  const [filtroEvaluador, setFiltroEvaluador] = useState('todos');
  const [filtroModulo, setFiltroModulo] = useState('todos');

  // Filtramos los datos que se muestran en la tabla según el estado de los selectores
  const evaluacionesFiltradas = evaluaciones.filter(evaluacion => {
    const evaluadorCoincide = filtroEvaluador === 'todos' || evaluacion.evaluador?.tipo === filtroEvaluador;
    const moduloCoincide = filtroModulo === 'todos' || evaluacion.modulo?.tipo_modulo === filtroModulo;
    return evaluadorCoincide && moduloCoincide;
  });

  return (
    <div>
      {/* Sección de Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex-1">
          <label htmlFor="filtro-evaluador" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por tipo de Evaluador</label>
          <select id="filtro-evaluador" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={filtroEvaluador} onChange={(e) => setFiltroEvaluador(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="P">Profesor</option>
            <option value="S">Supervisor</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="filtro-modulo" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por tipo de Módulo</label>
          <select id="filtro-modulo" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={filtroModulo} onChange={(e) => setFiltroModulo(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="MIC">MIC</option>
            <option value="MDIC">MDIC</option>
          </select>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alumno</th>
              <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Módulo</th>
              <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
              <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluador</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {evaluacionesFiltradas.length > 0 ? (
              evaluacionesFiltradas.map((evaluacion) => (
                <tr key={evaluacion.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">{evaluacion.alumno?.nombre ?? 'Sin nombre'}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-gray-700">{evaluacion.modulo?.modulo_mic?.nombre || evaluacion.modulo?.modulo_mdic?.nombre || 'Módulo sin nombre'}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-gray-700">{evaluacion.nota !== null ? (<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${evaluacion.nota >= 4.0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{evaluacion.nota}</span>) : 'Sin calificar'}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-gray-700">{evaluacion.evaluador?.profesor?.nombre || evaluacion.evaluador?.supervisor?.nombre || 'Evaluador no asignado'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center py-10 px-4 text-gray-500">No se encontraron evaluaciones que coincidan con los filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
