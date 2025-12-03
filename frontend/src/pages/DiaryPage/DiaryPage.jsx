// frontend/src/pages/DiaryPage/DiaryForm.jsx

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DiaryForm from ".//DiaryForm";

export default function FindIdPage() {
    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col min-w-[360px]">
            <Header />

            <div className="flex-grow flex justify-center items-center px-4">
                <DiaryForm />
            </div>

            <Footer />
        </div>
    );
}
