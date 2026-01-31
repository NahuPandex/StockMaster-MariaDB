import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState({ nombre: '', precio: '', stock: '' });
    const [editandoId, setEditandoId] = useState(null);

    const API_URL = 'http://localhost:3000/api/productos';

    const user = JSON.parse(localStorage.getItem('usuario'));
    const esAdmin = user?.rol === 'admin';

    const cargarProductos = async () => {
        try {
            const res = await axios.get(API_URL);
            setProductos(res.data);
        } catch (error) {
            console.error("Error al cargar productos", error);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(form.stock) < 0) {
            Swal.fire('Error', 'El stock no puede ser negativo', 'warning');
            return;
        }

        if (Number(form.precio) < 0) {
            Swal.fire('Error', 'El precio no puede ser negativo', 'warning');
            return;
        }

        try {
            if (editandoId) {
                await axios.put(`${API_URL}/${editandoId}`, form);
                Swal.fire('Actualizado', 'Producto modificado correctamente', 'success');
                setEditandoId(null);
            } else {
                await axios.post(API_URL, form);
                Swal.fire('Agregado', 'Producto creado correctamente', 'success');
            }

            setForm({ nombre: '', precio: '', stock: '' });
            cargarProductos();
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el producto', 'error');
        }
    };

    const eliminar = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Eliminar producto?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
            cargarProductos();
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
        }
    };

    const prepararEdicion = (p) => {
        setEditandoId(p.id);
        setForm({
            nombre: p.nombre,
            precio: p.precio,
            stock: p.stock
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">📦 Control de Inventario</h2>
                <span className="badge bg-secondary">
                    Total: {productos.length} productos
                </span>
            </div>

            {/* FORMULARIO ADMIN */}
            {esAdmin && (
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                            {editandoId ? '📝 Editar Producto' : '➕ Agregar Producto'}
                        </h5>
                    </div>

                    <div className="card-body bg-light">
                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-md-4">
                                <input
                                    className="form-control"
                                    placeholder="Nombre del producto"
                                    value={form.nombre}
                                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-md-3">
                                <div className="input-group">
                                    <span className="input-group-text">$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control"
                                        placeholder="Precio"
                                        value={form.precio}
                                        onChange={e => setForm({ ...form, precio: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-3">
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    placeholder="Stock"
                                    value={form.stock}
                                    onChange={e => setForm({ ...form, stock: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-md-2">
                                <button
                                    type="submit"
                                    className={`btn w-100 fw-bold ${editandoId ? 'btn-warning' : 'btn-success'}`}
                                >
                                    {editandoId ? 'Guardar' : 'Agregar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TABLA */}
            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th className="ps-4">Producto</th>
                                <th className="text-center">Precio</th>
                                <th className="text-center">Stock</th>
                                {esAdmin && <th className="text-center pe-4">Acciones</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {productos.map(p => (
                                <tr key={p.id} className={p.stock <= 5 ? 'table-danger' : ''}>
                                    <td className="ps-4 fw-bold">{p.nombre}</td>
                                    <td className="text-center">
                                        ${Number(p.precio).toFixed(2)}
                                    </td>
                                    <td className="text-center fw-bold">
                                        {p.stock}
                                        {p.stock <= 5 && ' ⚠️'}
                                    </td>

                                    {esAdmin && (
                                        <td className="text-center pe-4">
                                            <button
                                                onClick={() => prepararEdicion(p)}
                                                className="btn btn-sm btn-outline-primary me-2"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => eliminar(p.id)}
                                                className="btn btn-sm btn-outline-danger"
                                            >
                                                🗑️ Borrar
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Productos;
