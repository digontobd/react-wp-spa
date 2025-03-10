import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./auth/privateRoute.jsx";
import Login from "./pages/login.jsx";
import PostList from "./components/Post/PostList.jsx";
import "./App.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PostList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
