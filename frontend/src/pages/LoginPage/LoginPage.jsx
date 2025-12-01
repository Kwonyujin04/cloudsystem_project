// frontend/src/pages/LoginPage/LoginPage.jsx

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoginForm from ".//LoginForm";

export default function LoginPage() {
    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col">
            <Header />

            <div className="flex-grow flex justify-center items-center px-4">
                <LoginForm />
            </div>

            <Footer />
        </div>
    );
}
