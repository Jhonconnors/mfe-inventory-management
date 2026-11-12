
import LoginForm from "../../components/auth/LoginForm";
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
  return (
    <main className="login-page">

      <header className="login-header">
        <div className="brand">
          <span className="brand-icon">AT</span>
          <span>Gestión de Activos Tecnológicos</span>
        </div>
      </header>

      <section className="login-content">

        <div className="login-presentation">
          <span className="presentation-tag">
            PLATAFORMA DE GESTIÓN
          </span>

          <h1>
            Gestión inteligente
            <br />
            de activos tecnológicos.
          </h1>

          <p>
            Centraliza la administración de equipos,
            controla asignaciones y mantén la trazabilidad
            de los activos tecnológicos de tu organización.
          </p>

          <div className="presentation-features">
            <span>✓ Control de activos tecnológicos</span>
            <span>✓ Gestión de custodios y ubicaciones</span>
            <span>✓ Historial y trazabilidad de operaciones</span>
          </div>
        </div>

        <div className="login-card">
          {/* IMPORTANTE: transmitir onLogin */}
          <LoginForm onLogin={onLogin} />
        </div>

      </section>

      <footer className="login-page-footer">
        <span>
          © 2026 Gestión de Activos Tecnológicos
        </span>

        <span>Versión MVP 1.0</span>
      </footer>

    </main>
  );
};

export default LoginPage;
