import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Message from "./components/Message";
import Home from "./components/Home";
import About from "./components/About";
import Profile from "./components/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="home" element={<Home />} />
        <Route path="message" element={<Message />} />
        <Route path="about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;