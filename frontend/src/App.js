import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
