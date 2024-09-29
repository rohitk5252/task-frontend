import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading, isSuccess } = useLogin();
  const { handleGoogleLogin } = useGoogleAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <section className="auth">
      <div className="container">
        <h2>Log in</h2>
        <form>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="btn btn-filled btn-filled-blue auth-btn"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            Log in
          </button>
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          <button
            type="button"
            className="btn btn-filled btn-filled-blue google-btn"
            disabled={isLoading}
            onClick={handleGoogleLogin}
          >
            Log in With <b>Google</b>
          </button>
          {isLoading && (
            <div
              className="loading"
            >
              Logging in ...
            </div>
          )}
          {error && <div className="error">{error}</div>}
          {isSuccess && <div className="success">logged in sucessfully</div>}
        </form>
      </div>
    </section>
  );
};

export default Login;
