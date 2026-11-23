
const BASE = `${import.meta.env.BASE_URL}api`;

async function get(recurso) {
  const respuesta = await fetch(`${BASE}/${recurso}.json`);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al consultar ${recurso}`);
  }
  return respuesta.json();
}

export const obtenerCategorias = () => get('categorias');

export async function obtenerLibros(categoriaId) {
  const libros = await get('libros');
  return categoriaId == null
    ? libros
    : libros.filter((l) => l.categoriaId === categoriaId);
}

export const obtenerDestinos = () => get('destinos');
