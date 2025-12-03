// frontend/src/pages/AnalysisPage/AnalysisPage.jsx

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AnalysisResult from "./AnalysisResult";
import { useLocation } from "react-router-dom";

export default function AnalysisPage() {
    const { state } = useLocation();

    // 새로고침 등으로 state가 없을 때 대비
    if (!state) {
        return (
            <div className="w-full min-h-screen bg-gray-100 flex flex-col min-w-[360px]">
                <Header />
                <div className="flex-grow flex justify-center items-center text-gray-600 text-center px-6">
                    분석 결과가 없습니다.<br />
                    일기를 작성한 후 분석을 다시 시도해주세요.
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col min-w-[360px]">
            <Header />

            <div className="flex-grow flex justify-center items-center px-4">
                <AnalysisResult
                    diaryText={state.diaryText}
                    analysis={state.analysis}
                    emotion={state.emotion}
                    music={state.music}
                />
            </div>

            <Footer />
        </div>
    );
}
