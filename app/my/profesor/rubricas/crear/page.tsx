import { CrearRubricaForm } from '@/app/ui/CrearRubricaForm'; // Importamos el formulario
import { prisma } from '@/app/lib/prisma';

export default async function PaginaCrearRubrica() {
  // Obtenemos todos los saberes para pasarlos al menú desplegable del formulario
  const saberes = await prisma.saber.findMany({
    orderBy: {
      descripcion: 'asc',
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Crear Nueva Rúbrica</h1>
      {/* Renderizamos el formulario y le pasamos la lista de saberes */}
      <CrearRubricaForm saberes={saberes} />
    </div>
  );
}