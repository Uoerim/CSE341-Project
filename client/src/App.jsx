import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth/Auth";
import Main from "./pages/Main/Main";
import ProtectedRoute from "./components/ProtectedRoute";
import ExplorePage from "./pages/ExplorePage/ExplorePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explore" 
          element={
          <ProtectedRoute>
            <ExplorePage /> 
          </ProtectedRoute>
        } 
        />
      </Routes>
    </Router>
  );
}

export default App;
