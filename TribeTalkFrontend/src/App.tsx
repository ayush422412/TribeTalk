import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp.tsx";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

     
    </Routes>
  );
}

export default App;
