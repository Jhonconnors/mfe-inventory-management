import { useState } from "react";

import LoginPage from "../src/pages/auth/LoginPage";
import HomePage from "../src/pages/dashboard/HomePage";

import "./App.css";

const dummyUsers = [
  {
    username: "admin",
    password: "admin",
    role: "admin",
    name: "Administrador"
  },
  {
    username: "consulta",
    password: "consulta",
    role: "consulta",
    name: "Usuario de consulta"
  }
];

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username, password) => {
    const foundUser = dummyUsers.find(
      (item) =>
        item.username === username &&
        item.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Usuario o contraseña incorrectos."
      };
    }

    setUser({
      username: foundUser.username,
      name: foundUser.name,
      role: foundUser.role
    });

    return { success: true };
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="app-container">
      {user ? (
        <HomePage
          user={user}
          onLogout={handleLogout}
        />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
