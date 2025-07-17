'use server'; // ¡Muy importante! Esto marca el archivo como contenedor de Server Actions.

import { z } from 'zod';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 1. Definimos el esquema de validación con Zod
const itemSchema = z.object({
  item_titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  item_descrip: z.string().optional(),
  puntaje_max: z.coerce.number().min(1, 'El puntaje debe ser al menos 1.'),
  id_saber: z.coerce.number().min(1, 'Debes seleccionar un saber.'),
});

const rubricaSchema = z.object({
  nombre_rub: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  periodo: z.string().min(4, 'El período es requerido.'),
  rubrica: z.string().url('Debe ser un enlace URL válido.'), // El campo "rubrica" es el link
  items: z.array(itemSchema).min(1, 'Debes añadir al menos un ítem a la rúbrica.'),
});


// Estado inicial para nuestro hook useFormState
export type FormState = {
  message: string;
  errors?: {
    nombre_rub?: string[];
    periodo?: string[];
    rubrica?: string[];
    items?: string[];
  };
};


// 2. Creamos la Server Action
export async function crearRubricaCompleta(prevState: FormState, formData: FormData): Promise<FormState> {
  // Convertimos los datos del formulario a un objeto más manejable
  const items = JSON.parse(formData.get('items') as string);
  
  const validatedFields = rubricaSchema.safeParse({
    nombre_rub: formData.get('nombre_rub'),
    periodo: formData.get('periodo'),
    rubrica: formData.get('rubrica'),
    items: items,
  });

  // Si la validación falla, retornamos los errores
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Error de validación. Por favor, revisa los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { nombre_rub, periodo, rubrica, items: itemsData } = validatedFields.data;

  try {
    // 3. Usamos una transacción de Prisma para asegurar la integridad de los datos
    await prisma.$transaction(async (tx) => {
      // Primero, creamos la rúbrica principal
      const nuevaRubrica = await tx.rubrica.create({
        data: {
          nombre_rub: nombre_rub,
          periodo: periodo,
          rubrica: rubrica, // Este es el campo del link
        },
      });

      // Luego, preparamos los datos de los ítems con el ID de la nueva rúbrica
      const itemsParaCrear = itemsData.map(item => ({
        ...item,
        id_rubrica: nuevaRubrica.id, // Asociamos cada ítem a la nueva rúbrica
      }));

      // Finalmente, creamos todos los ítems en una sola operación
      await tx.item_rubrica.createMany({
        data: itemsParaCrear,
      });
    });
  } catch (error) {
    console.error('Error al crear la rúbrica:', error);
    return { message: 'Error en la base de datos: no se pudo crear la rúbrica.' };
  }

  // 4. Si todo sale bien, revalidamos la caché y redirigimos
  revalidatePath('/my/profesor/rubricas'); // Ajusta esta ruta
  redirect('/my/profesor/rubricas'); // Ajusta esta ruta
}

export async function eliminarRubrica(formData: FormData) {
  // Ocultamos la lógica dentro de un 'try/catch' para manejar posibles errores
  try {
    const id = parseInt(formData.get('id') as string);

    // Usamos una transacción para asegurar que todas las operaciones se completen con éxito
    await prisma.$transaction(async (tx) => {
      // 1. Encontrar todos los ítems de la rúbrica que se va a borrar
      const itemsAEliminar = await tx.item_rubrica.findMany({
        where: { id_rubrica: id },
      });
      const itemIds = itemsAEliminar.map(item => item.id);

      // 2. Si existen ítems, borrar los puntajes asociados a ellos en ev_puntaje
      if (itemIds.length > 0) {
        await tx.ev_puntaje.deleteMany({
          where: { id_itemrubrica: { in: itemIds } },
        });
      }

      // 3. Borrar todos los item_rubrica asociados a la rúbrica
      await tx.item_rubrica.deleteMany({
        where: { id_rubrica: id },
      });

      // 4. Borrar todas las evaluaciones asociadas directamente a la rúbrica
      await tx.evaluaciones.deleteMany({
        where: { id_rubrica: id },
      });

      // 5. Finalmente, borrar la rúbrica principal
      await tx.rubrica.delete({
        where: { id: id },
      });
    });
  } catch (error) {
    console.error('Error al eliminar la rúbrica:', error);
    // En un caso real, podrías retornar un mensaje de error más específico
    return { message: 'Error en la base de datos: no se pudo eliminar la rúbrica.' };
  }

  // Si la eliminación fue exitosa, revalidamos la caché para que la UI se actualice
  revalidatePath('/my/profesor/rubricas'); // Asegúrate de que esta ruta sea correcta
}

export async function actualizarRubricaCompleta(prevState: FormState, formData: FormData): Promise<FormState> {
  const id = parseInt(formData.get('id') as string);
  const items = JSON.parse(formData.get('items') as string);
  
  const validatedFields = rubricaSchema.safeParse({
    nombre_rub: formData.get('nombre_rub'),
    periodo: formData.get('periodo'),
    rubrica: formData.get('rubrica'),
    items: items,
  });

  if (!validatedFields.success) {
    return {
      message: 'Error de validación. Por favor, revisa los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { nombre_rub, periodo, rubrica, items: itemsData } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Actualizamos los datos de la rúbrica principal
      await tx.rubrica.update({
        where: { id: id },
        data: {
          nombre_rub: nombre_rub,
          periodo: periodo,
          rubrica: rubrica,
        },
      });

      // 2. Borramos los ítems antiguos para reemplazarlos con los nuevos (estrategia "borrar y recrear")
      // Primero borramos los ev_puntaje para evitar conflictos de clave foránea
      const itemsAntiguos = await tx.item_rubrica.findMany({ where: { id_rubrica: id } });
      if (itemsAntiguos.length > 0) {
        await tx.ev_puntaje.deleteMany({ where: { id_itemrubrica: { in: itemsAntiguos.map(i => i.id) } } });
      }

      await tx.item_rubrica.deleteMany({
        where: { id_rubrica: id },
      });

      // 3. Creamos los nuevos ítems enviados desde el formulario
      if (itemsData.length > 0) {
        await tx.item_rubrica.createMany({
          data: itemsData.map(item => ({
            ...item,
            id_rubrica: id, // Asociamos con el ID de la rúbrica que estamos editando
          })),
        });
      }
    });
  } catch (error) {
    console.error('Error al actualizar la rúbrica:', error);
    return { message: 'Error en la base de datos: no se pudo actualizar la rúbrica.' };
  }
  
  // Si todo sale bien, revalidamos y redirigimos a la página de gestión
  revalidatePath('/my/profesor/rubricas');
  redirect('/my/profesor/rubricas');
}