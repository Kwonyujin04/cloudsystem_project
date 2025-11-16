// src/components/SwitchButton.jsx

export default function SwitchButton({ text, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-black text-white py-3 rounded-md text-center active:opacity-80"
        >
            {text}
        </button>
    );
}
