
import { useState } from "react";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  LoginOutlined
} from "@mui/icons-material";

import "./LoginForm.css";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const result = onLogin(username, password);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form-icon">
        <LockOutlined />
      </div>

      <h2>Iniciar sesión</h2>

      <p className="login-subtitle">
        Ingresa tus credenciales para continuar
      </p>

      <div className="login-field">
        <label htmlFor="username">Usuario</label>

        <input
          id="username"
          type="text"
          placeholder="Ingresa tu usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>

      <div className="login-field">
        <label htmlFor="password">Contraseña</label>

        <div className="password-container">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Mostrar u ocultar contraseña"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </button>
        </div>
      </div>

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}

      <button type="submit" className="login-button">
        <span>Ingresar</span>
        <LoginOutlined />
      </button>

      <div className="login-footer">
        <span>Sistema de Gestión de Activos Tecnológicos</span>
      </div>
    </form>
  );
};

export default LoginForm;
