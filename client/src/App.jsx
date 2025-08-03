import "./index.css";
import SideBar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import InitialRouter from "./Router/InitialRouter";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="font-poppins">
      {!isLoginPage && <SideBar />}
      {!isLoginPage && <Header />}
      <div className="ml-64">
        <InitialRouter />
      </div>
    </div>
  );
}

export default App;
