import { Link } from "react-router-dom";
import { useState } from "react";
import User from "../../../store/user";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { UserLogged, setUser } = User();

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/user/login/`,
        JSON.stringify({
          email: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.statusText == "OK") {
        debugger;
        setUser(response.data.user);
      } else {
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed:", error);
    }
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  return (
    <div className="sign-up">
      <div className="sign-up-form">
        <p
          style={{
            color: "white",
            fontSize: "40px",
            margin: 0,
            paddingBottom: "10px",
          }}
        >
          LOGIN
        </p>
        <p
          style={{
            color: "#757575",
            fontSize: "20px",
            margin: 0,
            paddingBottom: "20px",
          }}
        >
          Please enter your email and password!
        </p>
        <form onSubmit={formSubmitHandler}>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div className="">
            <button type="submit">Login</button>
          </div>
        </form>
        <p
          style={{
            color: "#757575",
            fontSize: "15px",
            margin: 0,
          }}
        >
          Don't have an account?{" "}
          <Link to="/signup" className="link">
            <span
              style={{
                color: "white",
                fontSize: "20px",
                textDecoration: "underline",
                textUnderlineOffset: "6px",
              }}
            >
              Signup
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
