import { buildSchema, graphql } from 'graphql';

const schema = buildSchema(`
  type Vuelo {
    id: ID!
    destinoId: Int!
    aerolinea: String!
    origen: String!
    fechaSalida: String!
    fechaRegreso: String!
    precio: Int!
    asientosDisponibles: Int!
    disponible: Boolean!
  }

  type Hotel {
    id: ID!
    destinoId: Int!
    nombre: String!
    estrellas: Int!
    precioPorNoche: Int!
    fechaDesde: String!
    fechaHasta: String!
    habitacionesDisponibles: Int!
    disponible: Boolean!
  }

  type Query {
    vuelos(destinoId: Int!): [Vuelo!]!
    hoteles(destinoId: Int!): [Hotel!]!
  }
`);

const v = (id, destinoId, aerolinea, fechaSalida, fechaRegreso, precio, asientos) => ({
  id: `V${id}`, destinoId, aerolinea, origen: 'Santiago (SCL)',
  fechaSalida, fechaRegreso, precio, asientosDisponibles: asientos, disponible: asientos > 0,
});
const h = (id, destinoId, nombre, estrellas, precioPorNoche, fechaDesde, fechaHasta, habs) => ({
  id: `H${id}`, destinoId, nombre, estrellas, precioPorNoche,
  fechaDesde, fechaHasta, habitacionesDisponibles: habs, disponible: habs > 0,
});

const vuelos = [
  v(1, 1, 'LATAM', '2027-01-15', '2027-01-22', 289990, 12),
  v(2, 1, 'Sky Airline', '2027-02-05', '2027-02-12', 239990, 0),
  v(3, 2, 'LATAM', '2027-01-10', '2027-01-17', 189990, 20),
  v(4, 2, 'JetSMART', '2027-01-24', '2027-01-31', 149990, 5),
  v(5, 2, 'Aerolíneas Argentinas', '2027-02-14', '2027-02-21', 219990, 0),
  v(6, 3, 'LATAM', '2027-01-20', '2027-01-30', 459990, 8),
  v(7, 3, 'Sky Airline', '2027-02-10', '2027-02-20', 399990, 3),
  v(8, 4, 'LATAM', '2027-03-03', '2027-03-12', 689990, 14),
  v(9, 4, 'Aeroméxico', '2027-03-20', '2027-03-29', 729990, 2),
  v(10, 5, 'Iberia', '2027-04-02', '2027-04-14', 899990, 9),
  v(11, 5, 'LATAM', '2027-04-18', '2027-04-30', 849990, 0),
  v(12, 6, 'Air Canada', '2027-05-06', '2027-05-20', 1390000, 6),
  v(13, 6, 'Japan Airlines', '2027-05-25', '2027-06-08', 1590000, 4),
];

const hoteles = [
  h(1, 1, 'Hotel Inti Wasi', 4, 62000, '2027-01-15', '2027-01-22', 7),
  h(2, 1, 'Hostal Plaza Cusco', 3, 34000, '2027-01-15', '2027-02-28', 15),
  h(3, 2, 'Palermo Boutique', 4, 78000, '2027-01-10', '2027-02-28', 4),
  h(4, 2, 'Hotel Obelisco', 3, 45000, '2027-01-10', '2027-02-28', 0),
  h(5, 3, 'Copacabana Palace Vista', 5, 165000, '2027-01-20', '2027-02-20', 3),
  h(6, 3, 'Pousada Ipanema', 3, 52000, '2027-01-20', '2027-02-20', 10),
  h(7, 4, 'Casa Roma Reforma', 4, 71000, '2027-03-03', '2027-03-29', 6),
  h(8, 4, 'Hostal Zócalo', 2, 29000, '2027-03-03', '2027-03-29', 12),
  h(9, 5, 'Hotel Gran Vía', 4, 98000, '2027-04-02', '2027-04-30', 5),
  h(10, 5, 'Hostal Retiro', 2, 41000, '2027-04-02', '2027-04-30', 0),
  h(11, 6, 'Shinjuku Granbell', 4, 105000, '2027-05-06', '2027-06-08', 8),
  h(12, 6, 'Capsule Asakusa', 2, 38000, '2027-05-06', '2027-06-08', 20),
];

const rootValue = {
  vuelos: ({ destinoId }) => vuelos.filter((x) => x.destinoId === destinoId),
  hoteles: ({ destinoId }) => hoteles.filter((x) => x.destinoId === destinoId),
};

// Ejecuta una consulta contra el esquema mock (con latencia simulada).
export async function ejecutarConsulta(query, variables) {
  await new Promise((r) => setTimeout(r, 400));
  return graphql({ schema, source: query, rootValue, variableValues: variables });
}
