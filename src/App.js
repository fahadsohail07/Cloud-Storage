import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";
import Signup from "./components/Auth/Signup/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import User from "./store/user";

function App() {
  const { Userlogged } = User();
  return (
    <Router>
      <Navbar />
      <Routes>
        {Userlogged == "invalid" && <Route path="/login" element={<Login />} />}
        {Userlogged == "invalid" && (
          <Route path="/signup" element={<Signup />} />
        )}
        {Userlogged == "invalid" && <Route path="/" element={<Home />} />}
        {Userlogged == "valid" && (
          <Route path="/Dashboard" element={<Dashboard />} />
        )}
        {Userlogged == "valid" && (
          <Route path="/Dashboard/:id" element={<Dashboard />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
