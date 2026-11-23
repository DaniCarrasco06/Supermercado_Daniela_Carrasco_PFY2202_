# Supermercado – Gestión de inventario (PFY2202)

Sitio React + Vite + Tailwind CSS.

Funcionalidades:
- Agregar artículos (nombre, marca, categoría, precio, cantidad)
- Lista de inventario con filtro por categoría (sin perder los datos originales) y búsqueda
- Detalle del artículo y botón "Agregar al carrito" (descuenta del inventario)
- Carrito de compras: aumentar/disminuir cantidades, quitar, vaciar y finalizar compra (el inventario se actualiza en tiempo real)

- Librería : categorías y libros consumidos desde una API REST mock (`public/api/categorias.json` y `public/api/libros.json`) con `fetch`, navegación con React Router (`/libreria` y `/libreria/:slug`)

Ejecutar: `npm install` y `npm run dev`.

- Viajes (Semana 5 – "Integrando nuestro frontend con backend"): agencia de viajes con React Router (`/viajes` y `/viajes/:slug`).
  - API REST mock: `public/api/destinos.json` (país y actividades populares), consumida con `fetch` (`src/services/api.js`).
  - API GraphQL mock: esquema y datos en `src/mock/graphqlServer.js` (librería `graphql`), consultada desde `src/services/graphql.js` para vuelos y hoteles (precios, fechas y disponibilidad) del destino elegido.
  - Al elegir vuelo y hotel se muestra un total estimado del plan de viaje.
