import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerDestinos } from '../services/api.js';

export default function Viajes() {
  const [destinos, setDestinos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    obtenerDestinos()
      .then((datos) => activo && setDestinos(datos))
      .catch(() => activo && setError('No se pudieron cargar los destinos.'))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold text-emerald-800">Agencia de viajes</h1>
      <p className="mb-6 mt-1 text-slate-600">
        Elige un destino para ver sus vuelos y hoteles disponibles.
      </p>

      {cargando && <p role="status">Cargando destinos…</p>}
      {error && (
        <p role="alert" className="rounded-lg bg-red-100 px-4 py-3 text-red-700">
          {error}
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {destinos.map((d) => (
          <li key={d.id}>
            <Link
              to={`/viajes/${d.slug}`}
              className="block h-full rounded-xl bg-white p-6 shadow transition hover:shadow-md hover:ring-2 hover:ring-emerald-500"
            >
              <span className="text-3xl" aria-hidden="true">{d.emoji}</span>
              <h2 className="mt-2 text-lg font-semibold text-emerald-800">{d.nombre}</h2>
              <p className="text-sm font-medium text-slate-500">{d.pais}</p>
              <p className="mt-2 text-sm text-slate-600">{d.descripcion}</p>
              <p className="mt-3 text-xs text-slate-500">
                Popular: {d.actividades.slice(0, 2).join(' · ')}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
