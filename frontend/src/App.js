import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import MyPage from "./pages/MyPage/MyPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import FindIdPage from "./pages/FindIdPage/FindIdPage";
import FindPwPage from "./pages/FindPwPage/FindPwPage";
import DiaryPage from "./pages/DiaryPage/DiaryPage";
import AnalysisPage from "./pages/AnalysisPage/AnalysisPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/find-pw" element={<FindPwPage />} />
        <Route path="/diary" element={<DiaryPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
