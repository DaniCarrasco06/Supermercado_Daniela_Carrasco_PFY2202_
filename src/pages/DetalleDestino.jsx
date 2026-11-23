import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerDestinos } from '../services/api.js';
import { obtenerOpcionesDestino } from '../services/graphql.js';
import { formatoPrecio } from '../context/InventarioContext.jsx';

const formatoFecha = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('es-CL', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

const noches = (desde, hasta) =>
  Math.round((new Date(hasta) - new Date(desde)) / 86400000);

function Disponibilidad({ disponible, cantidad, unidad }) {
  return disponible ? (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
      {cantidad} {unidad} disponibles
    </span>
  ) : (
    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
      Agotado
    </span>
  );
}

export default function DetalleDestino() {
  const { slug } = useParams();
  const [destino, setDestino] = useState(null);
  const [vuelos, setVuelos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [vueloSel, setVueloSel] = useState(null);
  const [hotelSel, setHotelSel] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError('');
    setDestino(null);
    setVueloSel(null);
    setHotelSel(null);

    obtenerDestinos() // REST
      .then(async (destinos) => {
        const encontrado = destinos.find((d) => d.slug === slug) ?? null;
        const opciones = encontrado
          ? await obtenerOpcionesDestino(encontrado.id) // GraphQL
          : { vuelos: [], hoteles: [] };
        if (activo) {
          setDestino(encontrado);
          setVuelos(opciones.vuelos);
          setHoteles(opciones.hoteles);
        }
      })
      .catch(() => activo && setError('No se pudo cargar la información del destino.'))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [slug]);

  const total = useMemo(() => {
    const vuelo = vuelos.find((x) => x.id === vueloSel);
    const hotel = hoteles.find((x) => x.id === hotelSel);
    return {
      vuelo,
      hotel,
      monto:
        (vuelo?.precio ?? 0) +
        (hotel ? hotel.precioPorNoche * (vuelo ? noches(vuelo.fechaSalida, vuelo.fechaRegreso) : 1) : 0),
    };
  }, [vuelos, hoteles, vueloSel, hotelSel]);

  if (cargando) return <p role="status">Cargando destino…</p>;

  if (error) {
    return (
      <p role="alert" className="rounded-lg bg-red-100 px-4 py-3 text-red-700">
        {error}
      </p>
    );
  }

  if (!destino) {
    return (
      <section className="mx-auto max-w-lg text-center">
        <p className="mb-4 text-lg">El destino no existe.</p>
        <Link to="/viajes" className="text-emerald-700 underline">
          Volver a los destinos
        </Link>
      </section>
    );
  }

  const tarjeta = (seleccionado, disponible) =>
    `w-full rounded-xl p-5 text-left shadow transition ${
      seleccionado ? 'bg-emerald-50 ring-2 ring-emerald-600' : 'bg-white'
    } ${disponible ? 'hover:shadow-md' : 'cursor-not-allowed opacity-60'}`;

  return (
    <section>
      <Link to="/viajes" className="text-sm text-emerald-700 hover:underline">
        ← Todos los destinos
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-emerald-800">
        <span aria-hidden="true">{destino.emoji}</span> {destino.nombre}, {destino.pais}
      </h1>
      <p className="mt-1 text-slate-600">{destino.descripcion}</p>

      <h2 className="mb-2 mt-6 font-semibold text-emerald-800">Actividades populares</h2>
      <ul className="flex flex-wrap gap-2">
        {destino.actividades.map((a) => (
          <li key={a} className="rounded-full bg-white px-3 py-1 text-sm shadow-sm">
            {a}
          </li>
        ))}
      </ul>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-emerald-800">Vuelos</h2>
      {vuelos.length === 0 ? (
        <p className="text-slate-500">No hay vuelos para este destino.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {vuelos.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                disabled={!x.disponible}
                aria-pressed={vueloSel === x.id}
                onClick={() => setVueloSel(vueloSel === x.id ? null : x.id)}
                className={tarjeta(vueloSel === x.id, x.disponible)}
              >
                <p className="font-semibold">{x.aerolinea}</p>
                <p className="text-sm text-slate-600">{x.origen} → {destino.nombre}</p>
                <p className="text-sm text-slate-600">
                  {formatoFecha(x.fechaSalida)} – {formatoFecha(x.fechaRegreso)}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-emerald-700">{formatoPrecio(x.precio)}</span>
                  <Disponibilidad disponible={x.disponible} cantidad={x.asientosDisponibles} unidad="asientos" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mb-3 mt-8 text-xl font-semibold text-emerald-800">Hoteles</h2>
      {hoteles.length === 0 ? (
        <p className="text-slate-500">No hay hoteles para este destino.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {hoteles.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                disabled={!x.disponible}
                aria-pressed={hotelSel === x.id}
                onClick={() => setHotelSel(hotelSel === x.id ? null : x.id)}
                className={tarjeta(hotelSel === x.id, x.disponible)}
              >
                <p className="font-semibold">{x.nombre}</p>
                <p className="text-sm text-amber-600" aria-label={`${x.estrellas} estrellas`}>
                  {'★'.repeat(x.estrellas)}
                </p>
                <p className="text-sm text-slate-600">
                  Disponible del {formatoFecha(x.fechaDesde)} al {formatoFecha(x.fechaHasta)}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-emerald-700">
                    {formatoPrecio(x.precioPorNoche)} <span className="text-xs font-normal text-slate-500">/ noche</span>
                  </span>
                  <Disponibilidad disponible={x.disponible} cantidad={x.habitacionesDisponibles} unidad="habitaciones" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {(total.vuelo || total.hotel) && (
        <aside className="mt-8 rounded-xl bg-emerald-700 p-5 text-white shadow" aria-live="polite">
          <h2 className="font-semibold">Tu plan de viaje</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {total.vuelo && <li>Vuelo: {total.vuelo.aerolinea} · {formatoPrecio(total.vuelo.precio)}</li>}
            {total.hotel && (
              <li>
                Hotel: {total.hotel.nombre} ·{' '}
                {noches(total.vuelo?.fechaSalida ?? '2000-01-01', total.vuelo?.fechaRegreso ?? '2000-01-02')} noches
              </li>
            )}
          </ul>
          <p className="mt-3 text-lg font-bold">Total estimado: {formatoPrecio(total.monto)}</p>
        </aside>
      )}
    </section>
  );
}
