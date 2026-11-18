
import { useState } from "react";

import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import DashboardContent from "../../components/dashboard/DashboardContent";

import "./HomePage.css";

const HomePage = ({ user, onLogout, accessToken }) => {
  const [activeModule, setActiveModule] = useState("inicio");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main className="dashboard-layout">

      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        user={user}
        onLogout={onLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <section className="dashboard-main">

        <Topbar
          activeModule={activeModule}
          user={user}
        />

        <div className="dashboard-workspace">
          <DashboardContent
            activeModule={activeModule}
            user={user}
            accessToken={accessToken}
          />
        </div>

        <footer className="dashboard-footer">
          <span>Gestión de Activos Tecnológicos</span>
          <span>MVP 1.0 · 2026</span>
        </footer>

      </section>

    </main>
  );
};

export default HomePage;
