import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Historial = () => {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const user = JSON.parse(localStorage.getItem('usuario'));

    const obtenerDatos = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/pedidos/historial');
            setVentas(res.data);
        } catch (err) {
            console.error("Error al cargar historial:", err);
            Swal.fire('Error', 'No se pudo cargar el historial', 'error');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, []);

    const moverAPapelera = async (id) => {
        const result = await Swal.fire({
            title: '¿Cancelar venta?',
            text: 'La venta se moverá a la papelera y el stock será restaurado',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No'
        });

        if (!result.isConfirmed) return;

        try {
            await axios.put(`http://localhost:3000/api/pedidos/cancelar/${id}`);

            Swal.fire({
                icon: 'success',
                title: 'Venta cancelada',
                text: 'La venta fue movida a la papelera correctamente'
            });

            obtenerDatos();
        } catch (err) {
            console.error("Error al cancelar:", err);
            Swal.fire('Error', 'No se pudo cancelar la venta', 'error');
        }
    };

    if (cargando) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
                    <h4 className="mb-0">📊 Historial de Ventas Activas</h4>
                    <span className="badge bg-primary fs-6">{ventas.length} pedidos</span>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th className="px-4">ID Pedido</th>
                                <th>Fecha</th>
                                <th>Vendedor</th>
                                <th className="text-end">Total</th>
                                {user?.rol === 'admin' && <th className="text-center">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.length > 0 ? (
                                ventas.map(v => (
                                    <tr key={v.id_pedido}>
                                        <td className="px-4 fw-bold text-primary">
                                            #{v.id_pedido}
                                        </td>
                                        <td>{new Date(v.fecha).toLocaleString()}</td>
                                        <td>
                                            <span className="badge rounded-pill bg-light text-dark border">
                                                👤 {v.vendedor}
                                            </span>
                                        </td>
                                        <td className="text-end fw-bold text-success px-3">
                                            ${Number(v.total).toFixed(2)}
                                        </td>
                                        {user?.rol === 'admin' && (
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => moverAPapelera(v.id_pedido)}
                                                >
                                                    🗑️ Cancelar
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        No hay ventas registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Historial;
