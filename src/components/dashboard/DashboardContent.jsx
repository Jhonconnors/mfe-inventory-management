
import {
  Computer,
  Laptop,
  Print,
  DevicesOther,
  Add,
  Search,
  Edit,
  Visibility,
  SwapHoriz
} from "@mui/icons-material";

import "./DashboardContent.css";

const assets = [
  {
    id: 1,
    serial: "DELL-2025-001",
    name: "Dell Latitude 5440",
    type: "Notebook",
    brand: "Dell",
    model: "Latitude 5440",
    custodian: "Juan Pérez",
    location: "Oficina Central",
    status: "Asignado"
  },
  {
    id: 2,
    serial: "HP-2025-002",
    name: "HP ProDesk 400",
    type: "Desktop",
    brand: "HP",
    model: "ProDesk 400",
    custodian: "María González",
    location: "Departamento TI",
    status: "Asignado"
  },
  {
    id: 3,
    serial: "LEN-2025-003",
    name: "Lenovo ThinkPad E14",
    type: "Notebook",
    brand: "Lenovo",
    model: "ThinkPad E14",
    custodian: "Sin asignar",
    location: "Bodega TI",
    status: "Disponible"
  },
  {
    id: 4,
    serial: "EPSON-2025-004",
    name: "Epson EcoTank",
    type: "Impresora",
    brand: "Epson",
    model: "L3250",
    custodian: "Pedro Soto",
    location: "Oficina Central",
    status: "Asignado"
  }
];

const activities = [
  {
    user: "admin",
    action: "Registro de activo",
    asset: "DELL-2025-001",
    date: "11/11/2026 09:30"
  },
  {
    user: "admin",
    action: "Asignación de equipo",
    asset: "HP-2025-002",
    date: "11/11/2026 10:15"
  },
  {
    user: "admin",
    action: "Traslado de activo",
    asset: "EPSON-2025-004",
    date: "11/11/2026 11:20"
  }
];

const DashboardContent = ({ activeModule, user }) => {

  const isAdmin = user.role === "admin";

  const renderAssets = () => (
    <>
      <div className="content-toolbar">
        <div>
          <h3>Inventario de equipos</h3>
          <p>Consulta y administra los activos tecnológicos registrados.</p>
        </div>

        {isAdmin && (
          <button className="primary-action">
            <Add /> Nuevo activo
          </button>
        )}
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search />
          <input placeholder="Buscar por serie, marca o modelo..." />
        </div>

        <select defaultValue="all">
          <option value="all">Todos los estados</option>
          <option>Asignado</option>
          <option>Disponible</option>
          <option>En reparación</option>
        </select>
      </div>

      <div className="table-container">
        <table className="assets-table">
          <thead>
            <tr>
              <th>N.º SERIE</th>
              <th>EQUIPO</th>
              <th>CUSTODIO</th>
              <th>UBICACIÓN</th>
              <th>ESTADO</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className="serial-cell">{asset.serial}</td>
                <td>
                  <strong>{asset.name}</strong>
                  <small>{asset.brand} / {asset.model}</small>
                </td>
                <td>{asset.custodian}</td>
                <td>{asset.location}</td>
                <td>
                  <span className={`status-badge ${
                    asset.status === "Asignado" ? "assigned" : "available"
                  }`}>
                    {asset.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button title="Consultar">
                      <Visibility />
                    </button>

                    {isAdmin && (
                      <button title="Editar">
                        <Edit />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderHome = () => (
    <>
      <div className="welcome-banner">
        <div>
          <span>PLATAFORMA DE GESTIÓN</span>
          <h2>Bienvenido, {user.username}</h2>
          <p>
            Administra y consulta los activos tecnológicos de tu organización.
          </p>
        </div>

        <DevicesOther className="welcome-icon" />
      </div>

      <div className="content-section-title">
        <h3>Estado del inventario</h3>
        <p>Información operativa de los activos registrados.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Computer /></div>
          <div>
            <span>Total de activos</span>
            <strong>248</strong>
            <small>Equipos registrados</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><Laptop /></div>
          <div>
            <span>Asignados</span>
            <strong>186</strong>
            <small>Con custodio responsable</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow"><DevicesOther /></div>
          <div>
            <span>Disponibles</span>
            <strong>42</strong>
            <small>En bodega</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple"><Print /></div>
          <div>
            <span>En reparación</span>
            <strong>20</strong>
            <small>Con estado de reparación</small>
          </div>
        </div>
      </div>

      <div className="content-section-title">
        <h3>Últimos movimientos</h3>
        <p>Actividad reciente registrada en el sistema.</p>
      </div>

      <div className="table-container">
        <table className="assets-table">
          <thead>
            <tr>
              <th>USUARIO</th>
              <th>ACCIÓN</th>
              <th>ACTIVO</th>
              <th>FECHA</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((item, index) => (
              <tr key={index}>
                <td>{item.user}</td>
                <td>{item.action}</td>
                <td className="serial-cell">{item.asset}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderAssignments = () => (
    <>
      <div className="content-toolbar">
        <div>
          <h3>Asignaciones de equipos</h3>
          <p>Consulta los custodios y ubicaciones de cada activo.</p>
        </div>

        {isAdmin && (
          <button className="primary-action">
            <Add /> Nueva asignación
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="assets-table">
          <thead>
            <tr>
              <th>ACTIVO</th>
              <th>N.º SERIE</th>
              <th>CUSTODIO</th>
              <th>UBICACIÓN</th>
              <th>ESTADO</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td className="serial-cell">{asset.serial}</td>
                <td>{asset.custodian}</td>
                <td>{asset.location}</td>
                <td>
                  <span className={`status-badge ${
                    asset.status === "Asignado" ? "assigned" : "available"
                  }`}>
                    {asset.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderTransfers = () => (
    <>
      <div className="content-toolbar">
        <div>
          <h3>Traslados de activos</h3>
          <p>Gestiona los movimientos entre ubicaciones físicas.</p>
        </div>

        <button className="primary-action">
          <SwapHoriz /> Nuevo traslado
        </button>
      </div>

      <div className="empty-module">
        <SwapHoriz />
        <h3>Gestión de traslados</h3>
        <p>
          Aquí podrás registrar el origen, destino, custodio responsable
          y fecha del movimiento de cada equipo.
        </p>
      </div>
    </>
  );

  const renderAudit = () => (
    <>
      <div className="content-toolbar">
        <div>
          <h3>Bitácora de auditoría</h3>
          <p>Historial de operaciones realizadas sobre los activos.</p>
        </div>
      </div>

      <div className="table-container">
        <table className="assets-table">
          <thead>
            <tr>
              <th>USUARIO</th>
              <th>ACCIÓN</th>
              <th>ACTIVO</th>
              <th>FECHA Y HORA</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((item, index) => (
              <tr key={index}>
                <td>{item.user}</td>
                <td>{item.action}</td>
                <td className="serial-cell">{item.asset}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderUsers = () => (
    <>
      <div className="content-toolbar">
        <div>
          <h3>Usuarios y roles</h3>
          <p>Perfiles de acceso configurados en el entorno de prueba.</p>
        </div>
      </div>

      <div className="table-container">
        <table className="assets-table">
          <thead>
            <tr>
              <th>USUARIO</th>
              <th>ROL</th>
              <th>PERMISOS</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>admin</td>
              <td><span className="status-badge assigned">Administrador</span></td>
              <td>Gestión y consulta</td>
            </tr>

            <tr>
              <td>consulta</td>
              <td><span className="status-badge available">Consulta</span></td>
              <td>Solo lectura</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  const views = {
    inicio: renderHome,
    activos: renderAssets,
    asignaciones: renderAssignments,
    traslados: renderTransfers,
    auditoria: renderAudit,
    usuarios: renderUsers
  };

  return (
    <section className="dashboard-content">
      {views[activeModule]?.() || renderHome()}
    </section>
  );
};

export default DashboardContent;
