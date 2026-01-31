import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const NavBar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('usuario'));
    const rol = user?.rol?.toLowerCase();

    const cerrarSesion = () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: 'Se cerrará tu sesión actual',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('usuario');

                Swal.fire({
                    title: 'Sesión cerrada',
                    icon: 'success',
                    timer: 1200,
                    showConfirmButton: false
                });

                setTimeout(() => {
                    navigate('/login');
                    window.location.reload();
                }, 1200);
            }
        });
    };

    // 🎨 Colores según rol
    const navbarClass =
        rol === 'admin'
            ? 'navbar-dark bg-danger'
            : 'navbar-dark bg-primary';

    const badgeClass =
        rol === 'admin'
            ? 'bg-dark'
            : 'bg-light text-dark';

    return (
        <nav className={`navbar navbar-expand-lg ${navbarClass} shadow-sm`}>
            <div className="container">

                {/* Marca */}
                <Link className="navbar-brand fw-semibold text-white" to="/">
                    SISTEMA
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">

                    {/* Links */}
                    <ul className="navbar-nav me-auto gap-lg-2">
                        <li className="nav-item">
                            <Link className="nav-link text-white-50" to="/">Inicio</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link text-white-50" to="/pedidos">Pedidos</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link text-white-50" to="/ventas">Ventas</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link text-white-50" to="/historial">Historial</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link text-white-50" to="/perfil">Perfil</Link>
                        </li>

                        {/* 🔐 Admin */}
                        {rol === 'admin' && (
                            <>
                                <li className="nav-item border-start border-light ps-lg-3 ms-lg-3">
                                    <Link className="nav-link text-warning" to="/productos">
                                        Stock
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link text-warning" to="/usuarios">
                                        Usuarios
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link text-warning" to="/papelera">
                                        Papelera
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Usuario */}
                    {user && (
                        <div className="d-flex align-items-center gap-3">
                            <div className="text-end d-none d-md-block">
                                <div className="text-white small fw-semibold">
                                    {user.nombre}
                                </div>
                                <span className={`badge ${badgeClass}`}>
                                    {user.rol}
                                </span>
                            </div>

                            <button
                                onClick={cerrarSesion}
                                className="btn btn-outline-light btn-sm"
                            >
                                Salir
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
