import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Pedidos = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [idProducto, setIdProducto] = useState('');
    const [cantidad, setCantidad] = useState(1);

    const user = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/productos');
            setProductos(res.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        }
    };

    const agregarAlCarrito = () => {
        if (!idProducto) return;

        const prod = productos.find(p => p.id === parseInt(idProducto));

        if (prod.stock < cantidad) {
            Swal.fire(
                'Stock insuficiente',
                `Solo quedan ${prod.stock} unidades disponibles`,
                'warning'
            );
            return;
        }

        const existe = carrito.find(item => item.id === prod.id);

        if (existe) {
            setCarrito(carrito.map(item =>
                item.id === prod.id
                    ? { ...item, cantidadSeleccionada: item.cantidadSeleccionada + parseInt(cantidad) }
                    : item
            ));
        } else {
            setCarrito([...carrito, { ...prod, cantidadSeleccionada: parseInt(cantidad) }]);
        }

        setCantidad(1);
        setIdProducto('');
    };

    const eliminarDelCarrito = (id) => {
        setCarrito(carrito.filter(item => item.id !== id));
    };

    const finalizarPedido = async () => {
        const total = carrito.reduce(
            (acc, p) => acc + (p.precio * p.cantidadSeleccionada),
            0
        );

        const confirm = await Swal.fire({
            title: 'Confirmar venta',
            html: `<b>Total a cobrar:</b> $${total.toFixed(2)}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Cobrar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirm.isConfirmed) return;

        const pedido = {
            id_usuario: user.id_user,
            total,
            detalles: carrito.map(p => ({
                id_producto: p.id,
                cantidad: p.cantidadSeleccionada,
                precio: p.precio
            }))
        };

        try {
            await axios.post('http://localhost:3000/api/pedidos', pedido);

            Swal.fire(
                'Venta registrada',
                'El pedido fue cargado correctamente',
                'success'
            );

            setCarrito([]);
            cargarProductos();
        } catch (error) {
            Swal.fire('Error', 'No se pudo procesar la venta', 'error');
        }
    };

    const calcularTotal = () =>
        carrito.reduce((acc, p) => acc + (p.precio * p.cantidadSeleccionada), 0).toFixed(2);

    return (
        <div className="container py-4">
            <div className="text-center mb-4">
                <h2 className="fw-bold">🛒 Terminal de Ventas</h2>
                <p className="text-muted">Seleccioná productos y registrá la venta</p>
            </div>

            {/* Selector de productos */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body bg-light">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Producto</label>
                            <select
                                className="form-select form-select-lg"
                                value={idProducto}
                                onChange={e => setIdProducto(e.target.value)}
                            >
                                <option value="">--- Elegir producto ---</option>
                                {productos.map(p => (
                                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                                        {p.nombre} - ${p.precio} ({p.stock} disp.)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                className="form-control form-control-lg text-center"
                                value={cantidad}
                                onChange={e => setCantidad(e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <button
                                className="btn btn-primary btn-lg w-100 fw-bold"
                                onClick={agregarAlCarrito}
                            >
                                ➕ Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carrito */}
            <div className="card shadow-sm border-0">
                <div className="card-header fw-bold">Detalle del pedido</div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th className="ps-4">Producto</th>
                                <th className="text-center">Cant.</th>
                                <th className="text-center">Precio</th>
                                <th className="text-center">Subtotal</th>
                                <th className="text-center pe-4">Acción</th>
                            </tr>
                        </thead>

                        <tbody>
                            {carrito.length > 0 ? carrito.map(p => (
                                <tr key={p.id}>
                                    <td className="ps-4 fw-bold">{p.nombre}</td>
                                    <td className="text-center">
                                        <span className="badge bg-secondary">{p.cantidadSeleccionada}</span>
                                    </td>
                                    <td className="text-center">${p.precio}</td>
                                    <td className="text-center fw-bold text-success">
                                        ${(p.precio * p.cantidadSeleccionada).toFixed(2)}
                                    </td>
                                    <td className="text-center pe-4">
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => eliminarDelCarrito(p.id)}
                                        >
                                            Quitar
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        Carrito vacío
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {carrito.length > 0 && (
                    <div className="card-footer bg-white py-4">
                        <div className="row align-items-center">
                            <div className="col-md-6 text-center text-md-start">
                                <h3 className="fw-bold">
                                    TOTAL: <span className="text-success">${calcularTotal()}</span>
                                </h3>
                            </div>
                            <div className="col-md-6 text-center text-md-end">
                                <button
                                    className="btn btn-success btn-lg px-5 fw-bold"
                                    onClick={finalizarPedido}
                                >
                                    🤝 Finalizar venta
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pedidos;
