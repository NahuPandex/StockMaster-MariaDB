import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [user, setUser] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    rol: 'vendedor',
    contraseña: ''
  });

  const API_URL = 'http://localhost:3000/api/usuarios';

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsuarios(res.data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los usuarios'
      });
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const guardar = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, user);

      Swal.fire({
        icon: 'success',
        title: 'Usuario creado',
        text: 'El usuario fue registrado correctamente',
        timer: 2000,
        showConfirmButton: false
      });

      setUser({
        nombre: '',
        apellido: '',
        correo: '',
        rol: 'vendedor',
        contraseña: ''
      });

      obtenerUsuarios();

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'No se pudo conectar con el servidor'
      });
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">

        {/* FORMULARIO */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0 fw-bold">👤 Registro de Usuarios</h5>
            </div>

            <div className="card-body p-4">
              <form onSubmit={guardar}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Nombre</label>
                  <input
                    className="form-control"
                    placeholder="Ej: Juan"
                    value={user.nombre}
                    onChange={e => setUser({ ...user, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Apellido</label>
                  <input
                    className="form-control"
                    placeholder="Ej: Pérez"
                    value={user.apellido}
                    onChange={e => setUser({ ...user, apellido: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="correo@ejemplo.com"
                    value={user.correo}
                    onChange={e => setUser({ ...user, correo: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Rol</label>
                  <select
                    className="form-select"
                    value={user.rol}
                    onChange={e => setUser({ ...user, rol: e.target.value })}
                  >
                    <option value="vendedor">Vendedor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={user.contraseña}
                    onChange={e => setUser({ ...user, contraseña: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm">
                  🚀 Guardar Usuario
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">👥 Equipo Registrado</h5>
              <span className="badge bg-primary">{usuarios.length} Miembros</span>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Nombre Completo</th>
                      <th>Correo</th>
                      <th className="text-center pe-4">Rol</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuarios.length > 0 ? (
                      usuarios.map(u => (
                        <tr key={u.id_user}>
                          <td className="ps-4 fw-bold">
                            {u.nombre} {u.apellido}
                          </td>
                          <td className="text-muted">{u.correo}</td>
                          <td className="text-center pe-4">
                            <span className={`badge rounded-pill px-3 py-2 ${
                              u.rol === 'admin'
                                ? 'bg-danger-subtle text-danger'
                                : 'bg-info-subtle text-info'
                            }`}>
                              {u.rol.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-5 text-muted">
                          No hay usuarios registrados
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Usuarios;
