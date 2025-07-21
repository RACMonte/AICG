'use client'; 

import { eliminarRubrica } from '@/app/actions'; // Importamos la Server Action

// El componente recibe el ID de la rúbrica como prop
export function DeleteButton({ rubricaId }: { rubricaId: number }) {
  return (
    <form action={eliminarRubrica}>
      <input type="hidden" name="id" value={rubricaId} />
      <button
        type="submit"
        className="text-red-600 hover:text-red-800 font-medium"
        onClick={(e) => {
          if (!confirm('¿Estás seguro de que quieres eliminar esta rúbrica y todos sus datos asociados? Esta acción no se puede deshacer.')) {
            e.preventDefault(); 
          }
        }}
      >
        Borrar
      </button>
    </form>
  );
}