// src/components/MyPageField.jsx

import ProfileImage from "./ProfileImage";
import SwitchButton from "./SwitchButton";
import DiaryList from "./DiaryList";

export default function MyPageField({ profileImg, diaries }) {
    return (
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">

            {/* 프로필 */}
            <ProfileImage src={profileImg} />

            {/* 스위치 버튼 */}
            <SwitchButton text="switch button" onClick={() => { }} />

            {/* 게시글 리스트 */}
            <DiaryList diaries={diaries} />

        </div>
    );
}
