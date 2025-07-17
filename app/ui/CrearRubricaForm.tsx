'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { crearRubricaCompleta, type FormState } from '@/app/actions';
import type { saber } from '@prisma/client'; // Importamos el tipo 'saber'

// Definimos la estructura de un ítem para nuestro estado local
type ItemState = {
  id: number; // Un ID temporal para el 'key' de React
  item_titulo: string;
  item_descrip: string;
  puntaje_max: number;
  id_saber: number;
};

// Le pasamos la lista de saberes como prop
export function CrearRubricaForm({ saberes }: { saberes: saber[] }) {
  const initialState: FormState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(crearRubricaCompleta, initialState);

  const [items, setItems] = useState<ItemState[]>([
    { id: 1, item_titulo: '', item_descrip: '', puntaje_max: 1, id_saber: 0 },
  ]);

  const agregarItem = () => {
    setItems([
      ...items,
      { id: Date.now(), item_titulo: '', item_descrip: '', puntaje_max: 1, id_saber: 0 },
    ]);
  };

  const eliminarItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const manejarCambioItem = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItems(items.map(item => 
      item.id === id ? { ...item, [name]: value } : item
    ));
  };
  
  return (
    <form action={dispatch} className="space-y-8">
      {/* Campos de la Rúbrica Principal */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Datos de la Rúbrica</h2>
        <div>
          <label htmlFor="nombre_rub" className="block font-medium">Nombre de la Rúbrica</label>
          <input type="text" name="nombre_rub" id="nombre_rub" className="w-full border-gray-300 rounded-md" required />
          {state.errors?.nombre_rub && <p className="text-red-500 text-sm mt-1">{state.errors.nombre_rub}</p>}
        </div>
        <div>
          <label htmlFor="periodo" className="block font-medium">Período (ej: 2025-01)</label>
          <input type="text" name="periodo" id="periodo" className="w-full border-gray-300 rounded-md" required />
          {state.errors?.periodo && <p className="text-red-500 text-sm mt-1">{state.errors.periodo}</p>}
        </div>
        <div>
          <label htmlFor="rubrica" className="block font-medium">Enlace a la Rúbrica (URL)</label>
          <input type="url" name="rubrica" id="rubrica" className="w-full border-gray-300 rounded-md" />
          {state.errors?.rubrica && <p className="text-red-500 text-sm mt-1">{state.errors.rubrica}</p>}
        </div>
      </div>
      
      {/* Campo oculto para pasar los ítems a la Server Action */}
      <input type="hidden" name="items" value={JSON.stringify(items.map(({id, ...rest}) => rest))} />

      {/* Sección de Ítems Dinámicos */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Ítems de la Rúbrica</h2>
        {items.map((item, index) => (
          <div key={item.id} className="p-4 border rounded-lg relative space-y-3">
            <h3 className="font-semibold">Ítem {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`item_titulo-${item.id}`} className="block font-medium text-sm">Título del Ítem</label>
                <input type="text" name="item_titulo" id={`item_titulo-${item.id}`} value={item.item_titulo} onChange={(e) => manejarCambioItem(item.id, e)} className="w-full border-gray-300 rounded-md text-sm" required />
              </div>
              <div>
                <label htmlFor={`puntaje_max-${item.id}`} className="block font-medium text-sm">Puntaje Máximo</label>
                <input type="number" name="puntaje_max" id={`puntaje_max-${item.id}`} value={item.puntaje_max} onChange={(e) => manejarCambioItem(item.id, e)} className="w-full border-gray-300 rounded-md text-sm" required min="1"/>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label htmlFor={`item_descrip-${item.id}`} className="block font-medium text-sm">Descripción del Ítem</label>
                <input type="text" name="item_descrip" id={`item_descrip-${item.id}`} value={item.item_descrip} onChange={(e) => manejarCambioItem(item.id, e)} className="w-full border-gray-300 rounded-md text-sm" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label htmlFor={`id_saber-${item.id}`} className="block font-medium text-sm">Saber Asociado</label>
                <select name="id_saber" id={`id_saber-${item.id}`} value={item.id_saber} onChange={(e) => manejarCambioItem(item.id, e)} className="w-full border-gray-300 rounded-md text-sm" required>
                  <option value={0} disabled>Selecciona un saber...</option>
                  {saberes.map(saber => (
                    <option key={saber.id} value={saber.id}>{saber.descripcion}</option>
                  ))}
                </select>
              </div>
            </div>
            {items.length > 1 && (
              <button type="button" onClick={() => eliminarItem(item.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">
                &times;
              </button>
            )}
          </div>
        ))}
        {state.errors?.items && <p className="text-red-500 text-sm mt-1">{state.errors.items}</p>}
        <button type="button" onClick={agregarItem} className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200">
          + Añadir otro Ítem
        </button>
      </div>

      <div className="mt-8">
        <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          Guardar Rúbrica Completa
        </button>
        {state.message && <p className="text-red-500 text-sm mt-2">{state.message}</p>}
      </div>
    </form>
  );
}