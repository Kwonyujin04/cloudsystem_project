// src/components/ProfileImage.jsx

export default function ProfileImage({ src }) {
    return (
        <div className="flex items-center">
            <img
                src={src}
                alt="profile"
                className="w-20 h-20 rounded-full object-cover"
            />
        </div>
    );
}
