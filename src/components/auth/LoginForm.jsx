
import { useState } from "react";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  LoginOutlined
} from "@mui/icons-material";

import "./LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Aquí conectaremos posteriormente el servicio de autenticación.
    console.log("Credenciales ingresadas:", {
      email,
      password
    });
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
        <label htmlFor="email">Correo electrónico</label>

        <input
          id="email"
          type="email"
          placeholder="usuario@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </button>
        </div>
      </div>

      <div className="login-options">
        <label className="remember-option">
          <input type="checkbox" />
          Recordarme
        </label>

        <a href="#forgot-password">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <button type="submit" className="login-button">
        <span>Ingresar</span>
        <LoginOutlined />
      </button>

      <div className="login-footer">
        <span>¿Problemas para acceder?</span>
        <a href="mailto:soporte@empresa.com">
          Contactar soporte
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
