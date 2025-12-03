// frontend/src/pages/FindPwPage/FindPwPage.jsx

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FindPwForm from ".//FindPwForm";

export default function FindPwPage() {
    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col min-w-[360px] min-h-[670px]">
            <Header />

            <div className="flex-grow flex justify-center items-center px-4">
                <FindPwForm />
            </div>

            <Footer />
        </div>
    );
}
