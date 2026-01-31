import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Inicio = () => {
    const user = JSON.parse(localStorage.getItem('usuario'));
    const esAdmin = user?.rol === 'admin';

    const [stats, setStats] = useState({
        totalVentas: 0,
        bajoStock: 0,
        ventasHoy: 0
    });

    // 🔔 Bienvenida con SweetAlert (solo una vez)
    useEffect(() => {
        const yaMostrado = sessionStorage.getItem('bienvenida');
        if (!yaMostrado && user) {
            Swal.fire({
                icon: esAdmin ? 'warning' : 'success',
                title: esAdmin ? 'Modo Administrador' : `Buen turno, ${user.nombre}`,
                text: esAdmin
                    ? 'Tenés control total del sistema'
                    : 'Listo para registrar ventas',
                timer: 2500,
                showConfirmButton: false
            });
            sessionStorage.setItem('bienvenida', 'ok');
        }
    }, [esAdmin, user]);

    // 📊 Estadísticas solo Admin
    useEffect(() => {
        if (esAdmin) {
            const cargarStats = async () => {
                try {
                    const res = await axios.get('http://localhost:3000/api/pedidos/stats');
                    setStats(res.data);
                } catch (err) {
                    console.error("Error al cargar estadísticas", err);
                }
            };
            cargarStats();
        }
    }, [esAdmin]);

    return (
        <div className="container py-5">
            {/* ENCABEZADO */}
            <div className="row mb-5 align-items-center">
                <div className="col-md-8">
                    <h1 className="display-5 fw-bold">
                        {esAdmin
                            ? '⚡ Panel de Administración'
                            : `👋 ¡Buen turno, ${user?.nombre}!`}
                    </h1>
                    <p className="text-muted">
                        {esAdmin
                            ? 'Resumen general del sistema'
                            : 'Registrá tus ventas rápidamente'}
                    </p>
                </div>
                <div className="col-md-4 text-md-end">
                    <span className={`badge p-3 fs-6 rounded-pill ${
                        esAdmin ? 'bg-danger' : 'bg-primary'
                    }`}>
                        {esAdmin ? 'ADMINISTRADOR' : 'VENDEDOR'}
                    </span>
                </div>
            </div>

            {/* DASHBOARD ADMIN */}
            {esAdmin && (
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card bg-success text-white shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="text-uppercase opacity-75">Ingresos Totales</h6>
                                <h3>${Number(stats.totalVentas).toLocaleString('es-AR')}</h3>
                                <small>Histórico</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-info text-white shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="text-uppercase opacity-75">Ventas Hoy</h6>
                                <h3>{stats.ventasHoy}</h3>
                                <small>Pedidos del día</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-warning text-dark shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="text-uppercase opacity-75">Stock Crítico</h6>
                                <h3 className={stats.bajoStock > 0 ? 'text-danger fw-bold' : ''}>
                                    {stats.bajoStock}
                                </h3>
                                <small>Productos &lt; 5 unidades</small>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ACCIONES */}
            <div className="row g-4">
                <div className={esAdmin ? "col-md-3" : "col-md-6"}>
                    <div className="card h-100 shadow-sm border-0 border-bottom border-primary border-4 transition-card">
                        <div className="card-body text-center">
                            <div className="display-4 text-primary">🛒</div>
                            <h4>Caja</h4>
                            <p className="text-muted small">Registrar ventas</p>
                            <Link to="/pedidos" className="btn btn-primary w-100 fw-bold">
                                NUEVA VENTA
                            </Link>
                        </div>
                    </div>
                </div>

                <div className={esAdmin ? "col-md-3" : "col-md-6"}>
                    <div className="card h-100 shadow-sm border-0 border-bottom border-secondary border-4 transition-card">
                        <div className="card-body text-center">
                            <div className="display-4 text-secondary">📋</div>
                            <h4>Historial</h4>
                            <p className="text-muted small">Ventas anteriores</p>
                            <Link to="/ventas" className="btn btn-secondary w-100 fw-bold">
                                VER TICKETS
                            </Link>
                        </div>
                    </div>
                </div>

                {esAdmin && (
                    <>
                        <div className="col-md-3">
                            <div className="card h-100 shadow-sm border-0 border-bottom border-success border-4 transition-card">
                                <div className="card-body text-center">
                                    <div className="display-4 text-success">📦</div>
                                    <h4>Inventario</h4>
                                    <p className="text-muted small">Stock y precios</p>
                                    <Link to="/productos" className="btn btn-success w-100 fw-bold">
                                        GESTIONAR
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="card h-100 shadow-sm border-0 border-bottom border-info border-4 transition-card">
                                <div className="card-body text-center">
                                    <div className="display-4 text-info">👥</div>
                                    <h4>Usuarios</h4>
                                    <p className="text-muted small">Personal</p>
                                    <Link to="/usuarios" className="btn btn-info w-100 fw-bold">
                                        ADMINISTRAR
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .transition-card {
                    transition: all 0.3s ease;
                }
                .transition-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                }
            `}</style>
        </div>
    );
};

export default Inicio;
