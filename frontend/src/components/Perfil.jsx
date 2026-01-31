import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Perfil = () => {
    const user = JSON.parse(localStorage.getItem('usuario'));

    const [passData, setPassData] = useState({
        actual: '',
        nueva: '',
        confirmar: ''
    });

    const cambiarPassword = async (e) => {
        e.preventDefault();

        if (passData.nueva !== passData.confirmar) {
            Swal.fire(
                'Error',
                'Las nuevas contraseñas no coinciden',
                'warning'
            );
            return;
        }

        const confirm = await Swal.fire({
            title: '¿Cambiar contraseña?',
            text: 'Se cerrará la sesión después del cambio',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.put(
                `http://localhost:3000/api/usuarios/cambiar-password/${user.id_user}`,
                {
                    actual: passData.actual,
                    nueva: passData.nueva
                }
            );

            await Swal.fire(
                'Contraseña actualizada',
                'Volvé a iniciar sesión',
                'success'
            );

            localStorage.removeItem('usuario');
            window.location.href = '/login';

        } catch (err) {
            Swal.fire(
                'Error',
                err.response?.data?.error || 'No se pudo cambiar la contraseña',
                'error'
            );
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow border-0">
                        <div className="card-header bg-dark text-white text-center py-3">
                            <h4 className="mb-0">👤 Configuración de Perfil</h4>
                        </div>

                        <div className="card-body p-4">
                            <div className="text-center mb-4">
                                <h5 className="fw-bold">{user?.nombre}</h5>
                                <span className={`badge ${user?.rol === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                    {user?.rol}
                                </span>
                            </div>

                            <form onSubmit={cambiarPassword}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">
                                        Contraseña Actual
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passData.actual}
                                        onChange={e =>
                                            setPassData({ ...passData, actual: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold">
                                        Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passData.nueva}
                                        onChange={e =>
                                            setPassData({ ...passData, nueva: e.target.value })
                                        }
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passData.confirmar}
                                        onChange={e =>
                                            setPassData({ ...passData, confirmar: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 fw-bold py-2"
                                >
                                    Actualizar Contraseña
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
