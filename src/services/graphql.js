import { ejecutarConsulta } from '../mock/graphqlServer.js';

async function consultar(query, variables) {
  const { data, errors } = await ejecutarConsulta(query, variables);
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(', '));
  return data;
}

const CONSULTA_OPCIONES = `
  query OpcionesDestino($destinoId: Int!) {
    vuelos(destinoId: $destinoId) {
      id aerolinea origen fechaSalida fechaRegreso precio asientosDisponibles disponible
    }
    hoteles(destinoId: $destinoId) {
      id nombre estrellas precioPorNoche fechaDesde fechaHasta habitacionesDisponibles disponible
    }
  }
`;

export const obtenerOpcionesDestino = (destinoId) =>
  consultar(CONSULTA_OPCIONES, { destinoId });
