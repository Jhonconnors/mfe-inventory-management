
import { useState } from "react";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  LoginOutlined
} from "@mui/icons-material";

import "./LoginForm.css";

const LoginForm = ({ onLogin, notice }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await onLogin(correo, password);
      if (!result.success) setError(result.message);
    } finally {
      setIsSubmitting(false);
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
        <label htmlFor="correo">Correo</label>

        <input
          id="correo"
          type="email"
          placeholder="Ingresa tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
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

      {(error || notice) && (
        <div className="login-error">
          {error || notice}
        </div>
      )}

      <button type="submit" className="login-button" disabled={isSubmitting}>
        <span>{isSubmitting ? "Ingresando..." : "Ingresar"}</span>
        <LoginOutlined />
      </button>

      <div className="login-footer">
        <span>Sistema de Gestión de Activos Tecnológicos</span>
      </div>
    </form>
  );
};

export default LoginForm;
