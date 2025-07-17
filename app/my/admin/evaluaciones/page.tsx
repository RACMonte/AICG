// app/my/[userType]/evaluaciones/page.tsx

// Este archivo ya NO tiene "use client". Es un Componente de Servidor.

import { prisma } from '@/app/lib/prisma';
import { EvaluacionesCliente } from './EvaluacionesCliente'; // Importamos el componente que creaste

// Esta función es ASYNC porque se ejecuta en el servidor para buscar datos
export default async function EvaluacionesPage({ params }: { params: { userType: string } }) {
  
  // 1. Buscamos todos los datos en el servidor, antes de que la página se renderice.
  const evaluaciones = await prisma.evaluaciones.findMany({
    include: {
      alumno: true,
      evaluador: {
        include: {
          profesor: true,
          supervisor: true,
        },
      },
      modulo: {
        include: {
          modulo_mic: true,
          modulo_mdic: true,
        },
      },
    },
  });

  // 2. Renderizamos el componente principal de la página
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Listado de Evaluaciones <span className="text-indigo-600"></span>
      </h1>
      
      {/* 3. Pasamos los datos obtenidos del servidor al componente de cliente como una prop */}
      <EvaluacionesCliente evaluaciones={evaluaciones} />
    </div>
  );
}
