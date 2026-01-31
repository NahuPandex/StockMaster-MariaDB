import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [detalle, setDetalle] = useState(null);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [empresa, setEmpresa] = useState({
        nombreEmpresa: 'MI EMPRESA',
        nit: '',
        direccion: '',
        telefono: '',
        mensaje: '¡Gracias por su compra!'
    });

    useEffect(() => {
        cargarVentas();
        const datosGuardados = JSON.parse(localStorage.getItem('datosEmpresa'));
        if (datosGuardados) setEmpresa(datosGuardados);
    }, []);

    const cargarVentas = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/pedidos/historial');
            setVentas(res.data);
        } catch (err) {
            console.error('Error al cargar ventas', err);
        }
    };

    const verDetalle = async (pedido) => {
        try {
            const res = await axios.get(
                `http://localhost:3000/api/pedidos/detalle/${pedido.id_pedido}`
            );
            setDetalle(res.data);
            setPedidoSeleccionado(pedido);
        } catch (err) {
            console.error('Error al cargar detalle', err);
        }
    };

    const imprimirFactura = () => {
        window.print();
    };

    const exportarPDF = async () => {
        const input = document.getElementById('area-impresion');

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Factura_${pedidoSeleccionado.id_pedido}.pdf`);
    };

    return (
        <div className="container py-4">
            <h2 className="no-print mb-4 fw-bold text-primary">
                📋 Registro de Ventas
            </h2>

            {/* TABLA */}
            <div className="table-responsive no-print shadow-sm rounded border">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th># Pedido</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Vendedor</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th className="text-center">Acción</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ventas.map(v => {
                            const fecha = new Date(v.fecha);
                            return (
                                <tr key={v.id_pedido}>
                                    <td className="fw-bold text-primary">
                                        #{v.id_pedido}
                                    </td>
                                    <td>{fecha.toLocaleDateString()}</td>
                                    <td className="text-muted">
                                        {fecha.toLocaleTimeString()}
                                    </td>
                                    <td className="fw-semibold">{v.vendedor}</td>
                                    <td className="fw-bold text-success">
                                        ${Number(v.total).toFixed(2)}
                                    </td>
                                    <td>
                                        <span className="badge bg-success-subtle text-success px-3 py-2">
                                            PAGADO
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => verDetalle(v)}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            👁️ Ver Factura
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* FACTURA */}
            {detalle && (
                <div id="area-impresion" style={styles.factura}>
                    <div style={styles.header}>
                        <div>
                            <h1>{empresa.nombreEmpresa}</h1>
                            <p>{empresa.direccion}</p>
                            <p>
                                {empresa.nit && `NIT/RUT: ${empresa.nit}`}{" "}
                                {empresa.telefono && `| Tel: ${empresa.telefono}`}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2>FACTURA</h2>
                            <p>Nro: #{pedidoSeleccionado.id_pedido}</p>
                            <p>
                                Fecha:{' '}
                                {new Date(pedidoSeleccionado.fecha).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <p><b>Vendedor:</b> {pedidoSeleccionado.vendedor}</p>

                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cant.</th>
                                <th>Precio</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalle.map((d, i) => (
                                <tr key={i}>
                                    <td>{d.nombre}</td>
                                    <td>{d.cantidad}</td>
                                    <td>${d.precio_unitario}</td>
                                    <td>${(d.cantidad * d.precio_unitario).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 style={{ textAlign: 'right' }}>
                        TOTAL: ${pedidoSeleccionado.total}
                    </h3>

                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
                        {empresa.mensaje}
                    </p>

                    {/* BOTONES */}
                    <div className="no-print" style={styles.botonesArea}>
                        <button
                            onClick={imprimirFactura}
                            className="btn btn-success btn-lg me-2"
                        >
                            🖨️ Imprimir
                        </button>
                        <button
                            onClick={exportarPDF}
                            className="btn btn-danger btn-lg me-2"
                        >
                            📄 Exportar PDF
                        </button>
                        <button
                            onClick={() => setDetalle(null)}
                            className="btn btn-secondary btn-lg"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { visibility: hidden; }
                    #area-impresion {
                        visibility: visible;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

const styles = {
    factura: {
        background: '#fff',
        padding: '40px',
        maxWidth: '850px',
        margin: '20px auto',
        border: '1px solid #ddd'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '2px solid #000',
        marginBottom: '20px'
    },
    table: {
        width: '100%',
        marginBottom: '20px'
    },
    botonesArea: {
        marginTop: '30px',
        textAlign: 'center'
    }
};

export default Ventas;
