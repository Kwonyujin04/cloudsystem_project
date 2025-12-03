// frontend/src/pages/FindIdPage/FindIdPage.jsx

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FindIdForm from ".//FindIdForm";

export default function FindIdPage() {
    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col min-w-[360px] min-h-[670px]">
            <Header />

            <div className="flex-grow flex justify-center items-center px-4">
                <FindIdForm />
            </div>

            <Footer />
        </div>
    );
}
