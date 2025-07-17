import { prisma }  from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import { EditRubricForm } from '@/app/ui/EditRubricForm'; 

// La página recibe "params" que contienen el [id] de la URL
export default async function PaginaEditarRubrica({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  // 1. Buscamos la rúbrica específica Y sus ítems asociados con "include"
  const rubrica = await prisma.rubrica.findUnique({
    where: { id: id },
    include: {
      item_rubrica: true, // ¡Muy importante para pre-rellenar los ítems!
    },
  });

  // Si no se encuentra la rúbrica, mostramos una página 404
  if (!rubrica) {
    notFound();
  }

  // 2. También buscamos la lista de saberes para los menús desplegables
  const saberes = await prisma.saber.findMany({
    orderBy: {
      descripcion: 'asc',
    },
  });
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Rúbrica: {rubrica.nombre_rub}</h1>
      {/* 3. Pasamos los datos encontrados al formulario de edición */}
      <EditRubricForm rubrica={rubrica} saberes={saberes} />
    </div>
  );
}