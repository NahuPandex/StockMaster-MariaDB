import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
    const [credenciales, setCredenciales] = useState({
        correo: '',
        contraseña: ''
    });

    const navigate = useNavigate();

    const manejarLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                'http://localhost:3000/api/usuarios/login',
                credenciales
            );

            localStorage.setItem('usuario', JSON.stringify(res.data));

            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Acceso correcto',
                timer: 1500,
                showConfirmButton: false
            });

            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 1500);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Correo o contraseña incorrectos'
            });
        }
    };

    return (
        <div className="vw-100 vh-100 d-flex align-items-center justify-content-center bg-dark">
            <div
                className="card shadow-lg p-4"
                style={{ width: '100%', maxWidth: '380px' }}
            >
                <div className="card-body">
                    <h2 className="text-center fw-bold mb-4">
                        SISTEMA
                    </h2>

                    <form onSubmit={manejarLogin}>
                        <div className="mb-3">
                            <label className="form-label">Correo</label>
                            <input
                                type="email"
                                className="form-control form-control-lg"
                                required
                                onChange={(e) =>
                                    setCredenciales({
                                        ...credenciales,
                                        correo: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                required
                                onChange={(e) =>
                                    setCredenciales({
                                        ...credenciales,
                                        contraseña: e.target.value
                                    })
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 fw-bold"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
