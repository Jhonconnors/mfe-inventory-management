
import {
  Dashboard,
  Inventory2,
  AssignmentInd,
  SwapHoriz,
  History,
  AdminPanelSettings,
  LocationOn,
  DevicesOther,
  ChevronLeft,
  ChevronRight,
  Logout
} from "@mui/icons-material";

import "./Sidebar.css";

const menuItems = [
  {
    id: "inicio",
    label: "Inicio",
    icon: <Dashboard />,
    permission: "all"
  },
  {
    id: "activos",
    label: "Activos tecnológicos",
    icon: <Inventory2 />,
    permission: "all"
  },
  {
    id: "ubicaciones",
    label: "Ubicaciones",
    icon: <LocationOn />,
    permission: "all"
  },
  {
    id: "asignaciones",
    label: "Asignaciones",
    icon: <AssignmentInd />,
    permission: "all"
  },
  {
    id: "traslados",
    label: "Traslados",
    icon: <SwapHoriz />,
    permission: "all"
  },
  {
    id: "auditoria",
    label: "Bitácora de auditoría",
    icon: <History />,
    permission: "all"
  },
  {
    id: "usuarios",
    label: "Usuarios y roles",
    icon: <AdminPanelSettings />,
    permission: "users"
  }
];

const Sidebar = ({
  activeModule,
  setActiveModule,
  user,
  onLogout,
  collapsed,
  setCollapsed
}) => {

  const canViewUsers = ["ADMINISTRADOR", "ENCARGADO_INVENTARIO"].includes(user.role);
  const visibleItems = menuItems.filter(
    (item) => item.permission !== "users" || canViewUsers
  );

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <DevicesOther />
        </div>

        {!collapsed && (
          <div className="sidebar-brand-text">
            <strong>Asset Manager</strong>
            <span>Gestión tecnológica</span>
          </div>
        )}
      </div>

      <div className="sidebar-section">
        {!collapsed && <span className="sidebar-label">MENÚ PRINCIPAL</span>}

        <nav className="sidebar-menu">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${
                activeModule === item.id ? "active" : ""
              }`}
              onClick={() => setActiveModule(item.id)}
              title={collapsed ? item.label : ""}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">

        <button
          className="sidebar-item collapse-button"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
          {!collapsed && <span>Contraer menú</span>}
        </button>

        <button
          className="sidebar-item logout-item"
          onClick={onLogout}
        >
          <Logout />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;
