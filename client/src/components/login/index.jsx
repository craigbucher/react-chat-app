import { useState, useEffect } from "react";
import { usePostLoginMutation, usePostSignUpMutation } from "@/state/api";

const Login = ({ setUser, setSecret }) => {     // setUser, setSecret functions passed-in as props
  const [isRegister, setIsRegister] = useState(false);  // local state
  const [username, setUsername] = useState("");   // temporary store of username
  const [password, setPassword] = useState("");   // temporary store of password
  const [triggerLogin, resultLogin] = usePostLoginMutation(); // resultLogin = response from backend
  const [triggerSignUp] = usePostSignUpMutation();

  // wrapper function:
  const handleLogin = () => {
    triggerLogin({ username, password });
  };

  // wrapper function:
  const handleRegister = () => {
    triggerSignUp({ username, password });
  };

  useEffect(() => {
    // if have a response from triggerLogin:
    if (resultLogin.data?.response) {
      setUser(username);
      setSecret(password);
    }
  // run anytime response from triggerLogin changes
  }, [resultLogin.data]); // eslint-disable-line

   // all CSS defined in index.scss
  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="title">CHATGPT APP</h2>
        <p
          className="register-change"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Already a user?" : "Are you a new user?"}
        </p>

        <div>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // set username to input value
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // set password to input value
          />
        </div>

        <div className="login-actions">
          {isRegister ? (
            // invoke 'handleRegister', above
            <button type="button" onClick={handleRegister}>
              Register
            </button>
          ) : (
            // invoke 'handleLogin', above
            <button type="button" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
