import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div class="home">
      Store, access, and share your files securely in the cloud with CloudBin.
      <Link to="/signup" className="link">
        <button>Join now</button>
      </Link>
    </div>
  );
};  

export default Home;
