import { Routes, Route } from "react-router-dom";
import "./assets/style/main.css";
import PublicLayout from "./pages/layouts/PublicLayout";
import Login from "./pages/public/Login";
import Confirm from "./pages/public/ConfirmCode";
import Register from "./pages/public/Registration";
import ProtectedLayout from "./pages/layouts/ProtectedLayout";
import Explore from "./pages/explore/Explore";
import Home from "./pages/home/Home";
import Direct from "./pages/direct/Direct";
import SavedPosts from "./pages/saved/SavedPosts";
import Account from "./pages/account/Account";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/" element={<ProtectedLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="direct" element={<Direct />} />
          <Route path="saved" element={<SavedPosts />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
