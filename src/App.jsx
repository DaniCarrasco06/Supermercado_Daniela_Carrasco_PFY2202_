import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Inicio from './pages/Inicio.jsx';
import AgregarArticulo from './pages/AgregarArticulo.jsx';
import ListaArticulos from './pages/ListaArticulos.jsx';
import DetalleArticulo from './pages/DetalleArticulo.jsx';
import Carrito from './pages/Carrito.jsx';
import Libreria from './pages/Libreria.jsx';
import CategoriaLibros from './pages/CategoriaLibros.jsx';
import Viajes from './pages/Viajes.jsx';
import DetalleDestino from './pages/DetalleDestino.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/agregar" element={<AgregarArticulo />} />
          <Route path="/inventario" element={<ListaArticulos />} />
          <Route path="/inventario/:id" element={<DetalleArticulo />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/libreria" element={<Libreria />} />
          <Route path="/libreria/:slug" element={<CategoriaLibros />} />
          <Route path="/viajes" element={<Viajes />} />
          <Route path="/viajes/:slug" element={<DetalleDestino />} />
          <Route
            path="*"
            element={<p className="text-center text-lg">Página no encontrada.</p>}
          />
        </Routes>
      </main>
    </div>
  );
}
