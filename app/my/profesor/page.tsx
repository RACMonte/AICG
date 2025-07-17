import Link from 'next/link';
import { prisma } from '@/app/lib/prisma';
import { eliminarRubrica } from '@/app/actions';

// Esta página es un Componente de Servidor, por lo que puede ser async
export default async function GestionarRubricasPage() {
  // Obtenemos todas las rúbricas de la base de datos
  const rubricas = await prisma.rubrica.findMany({
    orderBy: {
      periodo: 'desc', // Ordenamos por período
    },
  });

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Rúbricas</h1>
        {/* 1. Botón para Crear: Redirecciona a la página que ya construimos */}
        <Link 
          href="/my/profesor/rubricas/crear" 
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Crear Nueva Rúbrica
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">Nombre</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">Período</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">Enlace</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {rubricas.map((rubrica) => (
              <tr key={rubrica.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                  {rubrica.nombre_rub ?? 'Sin Nombre'}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">{rubrica.periodo}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  <a href={rubrica.rubrica ?? '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Ver Rúbrica
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  <div className="flex justify-center items-center gap-4">
                    {/* 2. Botón para Editar: Lleva a una página de edición dinámica */}
                    <Link 
                      href={`/my/profesor/rubricas/editar/${rubrica.id}`} 
                      className="text-yellow-600 hover:text-yellow-800 font-medium"
                    >
                      Editar
                    </Link>

                    {/* 3. Formulario para Borrar: Llama a la Server Action */}
                    <form action={eliminarRubrica}>
                      <input type="hidden" name="id" value={rubrica.id} />
                      <button 
                        type="submit" 
                        className="text-red-600 hover:text-red-800 font-medium"
                        // Opcional: Añadir una confirmación antes de borrar
                        onClick={(e) => {
                          if (!confirm('¿Estás seguro de que quieres eliminar esta rúbrica y todos sus datos asociados? Esta acción no se puede deshacer.')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Borrar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rubricas.length === 0 && (
          <p className="p-4 text-center text-gray-500">No hay rúbricas para mostrar.</p>
        )}
      </div>
    </div>
  );
}