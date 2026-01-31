import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import Productos from './components/Productos';
import Usuarios from './components/Usuarios';
import Login from './components/Login'; 
import Pedidos from './components/Pedidos';
import Ventas from './components/Ventas';
import Historial from './components/Historial'; 
import Inicio from './components/Inicio';
import Perfil from './components/Perfil';
import Papelera from './components/Papelera';

function App() {
  const user = JSON.parse(localStorage.getItem('usuario'));

  return (
    <Router>
      {/* El NavBar solo aparece si hay usuario */}
      {user && <NavBar />} 
      
      {/* QUITAMOS el div container de aquí para que el Login 
          pueda usar TODO el ancho y alto de la pantalla 
      */}
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Para las demás rutas, podemos crear un "wrapper" o simplemente 
            poner el container dentro de cada componente. 
            Aquí lo haremos envolviendo las rutas protegidas:
        */}
        <Route path="/" element={
          user ? <div className="container mt-4"><Inicio /></div> : <Navigate to="/login" />
        } />
        
        <Route path="/productos" element={
          user?.rol === 'admin' ? <div className="container mt-4"><Productos /></div> : <Navigate to="/" />
        } />
        
        <Route path="/pedidos" element={
          user ? <div className="container mt-4"><Pedidos /></div> : <Navigate to="/login" />
        } />

        <Route path="/ventas" element={
          user ? <div className="container mt-4"><Ventas /></div> : <Navigate to="/login" />
        } />

        <Route path="/historial" element={
          user ? <div className="container mt-4"><Historial /></div> : <Navigate to="/login" />
        } />
        
        <Route path="/usuarios" element={
          user?.rol === 'admin' ? <div className="container mt-4"><Usuarios /></div> : <Navigate to="/" />
        } />
        <Route path="/perfil" element={
          user ? <div className="container mt-4"><Perfil /></div> : <Navigate to="/login" />
        } />

        <Route path="/papelera" element={
          user ? <div className="container mt-4"><Papelera /></div> : <Navigate to="/login" />
        } />


        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;