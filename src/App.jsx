import { useState } from "react";

import LoginPage from "../src/pages/auth/LoginPage";
import HomePage from "../src/pages/dashboard/HomePage";
import { getCurrentUser, login, logout } from "./services/authentication";

import "./App.css";

function App() {
  const [session, setSession] = useState(null);
  const [logoutNotice, setLogoutNotice] = useState("");

  const handleLogin = async (correo, password) => {
    try {
      const tokens = await login(correo, password);
      const profile = await getCurrentUser(tokens.access_token);

      if (!profile.rol?.nombre) {
        throw new Error("El backend no devolvió el rol del usuario.");
      }

      setSession({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        user: {
          id: profile.id_usuario,
          username: profile.correo,
          name: profile.nombre,
          role: profile.rol.nombre
        }
      });
      setLogoutNotice("");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : "No fue posible iniciar sesión."
      };
    }
  };

  const handleLogout = async () => {
    if (!session) return;

    const activeSession = session;
    setSession(null);
    setLogoutNotice("");

    try {
      await logout(activeSession.accessToken, activeSession.refreshToken);
    } catch (error) {
      const reason = error instanceof Error ? `: ${error.message}` : ".";
      setLogoutNotice(
        `La sesión local se cerró, pero el backend no confirmó el cierre${reason}`
      );
    }
  };

  return (
    <div className="app-container">
      {session ? (
        <HomePage
          user={session.user}
          onLogout={handleLogout}
          accessToken={session.accessToken}
        />
      ) : (
        <LoginPage onLogin={handleLogin} notice={logoutNotice} />
      )}
    </div>
  );
}

export default App;
