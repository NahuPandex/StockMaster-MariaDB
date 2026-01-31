import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Papelera = () => {
    const [canceladas, setCanceladas] = useState([]);

    const cargarPapelera = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/papelera');
            setCanceladas(res.data);
        } catch (err) {
            console.error("Error al cargar papelera:", err);
        }
    };

    const restaurarVenta = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Restaurar venta?',
            text: 'La venta volverá al historial activo.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, restaurar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.put(`http://localhost:3000/api/papelera/restaurar/${id}`);
            Swal.fire('Restaurada', 'La venta fue restaurada correctamente.', 'success');
            cargarPapelera();
        } catch (err) {
            Swal.fire('Error', 'No se pudo restaurar la venta.', 'error');
        }
    };

    const eliminarDefinitivo = async (id) => {
        const confirm = await Swal.fire({
            title: 'Eliminar definitivamente',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.delete(`http://localhost:3000/api/papelera/eliminar/${id}`);
            Swal.fire('Eliminado', 'El pedido fue eliminado definitivamente.', 'success');
            cargarPapelera();
        } catch (err) {
            Swal.fire('Error', 'No se pudo eliminar el pedido.', 'error');
        }
    };

    useEffect(() => {
        cargarPapelera();
    }, []);

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0">🗑️ Papelera</h5>
                    <span className="badge bg-light text-dark">
                        {canceladas.length} pedidos
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Fecha</th>
                                <th>Vendedor</th>
                                <th className="text-end">Monto</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {canceladas.length > 0 ? (
                                canceladas.map(v => (
                                    <tr key={v.id_pedido}>
                                        <td className="ps-4 fw-semibold text-muted">
                                            #{v.id_pedido}
                                        </td>
                                        <td>{new Date(v.fecha).toLocaleString()}</td>
                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                {v.vendedor}
                                            </span>
                                        </td>
                                        <td className="text-end fw-bold text-danger">
                                            ${Number(v.total).toFixed(2)}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-outline-success me-2"
                                                onClick={() => restaurarVenta(v.id_pedido)}
                                            >
                                                Restaurar
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => eliminarDefinitivo(v.id_pedido)}
                                            >
                                                Borrar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        La papelera está vacía.
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

export default Papelera;
