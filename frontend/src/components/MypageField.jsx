// src/components/MyPageField.jsx

import ProfileImage from "./ProfileImage";
import SwitchButton from "./SwitchButton";
import DiaryList from "./DiaryList";

export default function MyPageField({ profileImg, diaries, onSwitch }) {
    return (
        <div className="space-y-6">

            {/* 프로필 */}
            <div className="flex items-center space-x-4">
                <ProfileImage src={profileImg} />
                <div className="flex flex-col">
                    <span className="text-lg font-semibold">이름</span>
                    <span className="text-sm text-gray-600">기록한 기간</span>
                </div>
            </div>

            {/* 스위치 버튼 */}
            <div className="flex justify-center">
                <SwitchButton
                    defaultText="리스트 보기"
                    activeText="그래프 보기"
                    onClick={onSwitch}
                />
            </div>

            {/* 게시글 리스트 */}
            <DiaryList diaries={diaries} />
        </div>
    );
}
