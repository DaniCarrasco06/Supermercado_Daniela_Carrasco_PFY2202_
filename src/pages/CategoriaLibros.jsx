import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerCategorias, obtenerLibros } from '../services/api.js';
import { formatoPrecio } from '../context/InventarioContext.jsx';

export default function CategoriaLibros() {
  const { slug } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError('');
    setCategoria(null);

    obtenerCategorias()
      .then(async (categorias) => {
        const encontrada = categorias.find((c) => c.slug === slug) ?? null;
        const lista = encontrada ? await obtenerLibros(encontrada.id) : [];
        if (activo) {
          setCategoria(encontrada);
          setLibros(lista);
        }
      })
      .catch(() => activo && setError('No se pudieron cargar los libros.'))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [slug]);

  if (cargando) return <p role="status">Cargando libros…</p>;

  if (error) {
    return (
      <p role="alert" className="rounded-lg bg-red-100 px-4 py-3 text-red-700">
        {error}
      </p>
    );
  }

  if (!categoria) {
    return (
      <section className="mx-auto max-w-lg text-center">
        <p className="mb-4 text-lg">La categoría no existe.</p>
        <Link to="/libreria" className="text-emerald-700 underline">
          Volver a las categorías
        </Link>
      </section>
    );
  }

  return (
    <section>
      <Link to="/libreria" className="text-sm text-emerald-700 hover:underline">
        ← Todas las categorías
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-emerald-800">{categoria.nombre}</h1>
      <p className="mb-6 mt-1 text-slate-600">{categoria.descripcion}</p>

      {libros.length === 0 ? (
        <p className="text-slate-500">No hay libros en esta categoría.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {libros.map((l) => (
            <li key={l.id} className="rounded-xl bg-white p-5 shadow">
              <h2 className="font-semibold text-emerald-800">{l.titulo}</h2>
              <p className="text-sm text-slate-600">{l.autor}</p>
              <p className="mt-3 font-bold text-emerald-700">{formatoPrecio(l.precio)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
