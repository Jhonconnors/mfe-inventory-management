
import LoginForm from "../../components/auth/LoginForm";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <main className="login-page">

      {/* Barra superior */}
      <header className="login-header">
        <div className="brand">
          <span className="brand-icon">IM</span>
          <span>Inventory Management</span>
        </div>

        <nav className="login-navigation">
          <a href="#home">Inicio</a>
          <a href="#features">Características</a>
          <a href="#support">Soporte</a>
        </nav>
      </header>

      {/* Contenido principal */}
      <section className="login-content">

        {/* Panel informativo */}
        <div className="login-presentation">
          <span className="presentation-tag">
            SISTEMA DE GESTIÓN
          </span>

          <h1>
            Controla tu inventario.
            <br />
            Optimiza tu negocio.
          </h1>

          <p>
            Administra productos, controla existencias
            y supervisa tus operaciones desde una
            plataforma centralizada.
          </p>

          <div className="presentation-features">
            <span>✓ Gestión de productos</span>
            <span>✓ Control de existencias</span>
            <span>✓ Reportes y estadísticas</span>
          </div>
        </div>

        {/* Panel de autenticación */}
        <div className="login-card">
          <LoginForm />
        </div>

      </section>

      {/* Pie de página */}
      <footer className="login-page-footer">
        <span>
          © 2026 Inventory Management. Todos los derechos reservados.
        </span>

        <span>Plataforma de gestión empresarial</span>
      </footer>

    </main>
  );
};

export default LoginPage;
