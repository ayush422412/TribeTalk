import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp.tsx";

// import { socketGateway } from "./gateway/socket"
// import { registerSocketEvents } from "./gateway/events"
// import { useAuth } from "./auth/useAuth"

import "./App.css";

function App() {
  // const { token, isAuthenticated } = useAuth()

  // useEffect(() => {
  //   if (!isAuthenticated || !token) return

  //   socketGateway.connect(token)
  //   registerSocketEvents()
    // registerMessageEvents()      // messages

  //   return () => {
  //     // optional cleanup on logout
  //     socketGateway.disconnect?.()
  //   }
  // }, [isAuthenticated, token])


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

     
    </Routes>
  );
}

export default App;
