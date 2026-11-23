import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerCategorias } from '../services/api.js';

export default function Libreria() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    obtenerCategorias()
      .then((datos) => activo && setCategorias(datos))
      .catch(() => activo && setError('No se pudieron cargar las categorías.'))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold text-emerald-800">Librería</h1>
      <p className="mb-6 mt-1 text-slate-600">
        Elige una categoría para explorar los libros disponibles.
      </p>

      {cargando && <p role="status">Cargando categorías…</p>}
      {error && (
        <p role="alert" className="rounded-lg bg-red-100 px-4 py-3 text-red-700">
          {error}
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2">
        {categorias.map((c) => (
          <li key={c.id}>
            <Link
              to={`/libreria/${c.slug}`}
              className="block h-full rounded-xl bg-white p-6 shadow transition hover:shadow-md hover:ring-2 hover:ring-emerald-500"
            >
              <h2 className="text-lg font-semibold text-emerald-800">{c.nombre}</h2>
              <p className="mt-1 text-sm text-slate-600">{c.descripcion}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
