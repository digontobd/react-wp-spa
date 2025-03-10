import { useState, useContext } from "react";
import { AuthContext } from "../auth/authContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useContext(AuthContext);

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(username, password);
      window.location.href = "/dashboard"; // Redirect after login
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  return (
    <form onSubmit={submitLogin}>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
