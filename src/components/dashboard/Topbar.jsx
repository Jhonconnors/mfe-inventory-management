
import {
  NotificationsNone,
  AccountCircle,
  KeyboardArrowDown
} from "@mui/icons-material";

import "./Topbar.css";

const moduleTitles = {
  inicio: "Inicio",
  activos: "Activos tecnológicos",
  asignaciones: "Asignaciones de equipos",
  traslados: "Traslados de activos",
  auditoria: "Bitácora de auditoría",
  usuarios: "Usuarios y roles"
};

const Topbar = ({ activeModule, user }) => {
  return (
    <header className="topbar">

      <div className="topbar-heading">
        <span>Gestión de activos</span>
        <h2>{moduleTitles[activeModule]}</h2>
      </div>

      <div className="topbar-actions">

        <button className="notification-button" aria-label="Notificaciones">
          <NotificationsNone />
          <span className="notification-dot"></span>
        </button>

        <div className="topbar-user">
          <AccountCircle />

          <div className="topbar-user-info">
            <strong>{user.username}</strong>
            <span>
              {user.role === "admin" ? "Administrador" : "Consulta"}
            </span>
          </div>

          <KeyboardArrowDown />
        </div>

      </div>

    </header>
  );
};

export default Topbar;
