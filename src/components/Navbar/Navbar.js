import { Link } from "react-router-dom";
import User from "../../store/user";
import "./Navbar.css";

const Navbar = () => {
  const { Userlogged, signedOut } = User();
  return (
    <div class="navbar">
      <Link to="/" className="link">
        <h1
          style={{
            margin: 0,
            color: "white",
            marginLeft: "20px",
            fontSize: "50px",
          }}
        >
          CloudBin
        </h1>
      </Link>
      {Userlogged == "invalid" && (
        <div style={{ display: "flex", gap: "10px", marginRight: "20px" }}>
          <Link to="/login" className="link">
            <button>Login</button>
          </Link>
          <Link to="/signup" className="link">
            <button>Signup</button>
          </Link>
        </div>
      )}
      {Userlogged == "valid" && (
        <Link to="/">
          <button onClick={signedOut} style={{ marginRight: "20px" }}>
            Logout
          </button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
