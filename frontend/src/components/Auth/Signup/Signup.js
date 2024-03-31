import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import User from "../../../store/user";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { Userlogged, setUser } = User();

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/user/signup/`,
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
      if (response.ok) {
        const user = await res.json();
        setUser(user.user);
      } else {
      }
      window.location.href = "/login";
    } catch (error) {
      console.error("Signup failed:", error);
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
          SIGNUP
        </p>
        <p
          style={{
            color: "#757575",
            fontSize: "20px",
            margin: 0,
            paddingBottom: "20px",
          }}
        >
          Please set your email and password!
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
            <button type="submit">Signup</button>
          </div>
        </form>
        <p
          style={{
            color: "#757575",
            fontSize: "15px",
            margin: 0,
          }}
        >
          Already have an account?{" "}
          <Link to="/login" className="link">
            <span
              style={{
                color: "white",
                fontSize: "20px",
                textDecoration: "underline",
                textUnderlineOffset: "6px",
              }}
            >
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
