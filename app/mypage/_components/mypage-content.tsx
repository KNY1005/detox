"use client";

import { isNicknameConflictError } from "@/app/utils/auth/is-nickname-conflict-error";
import Image from "next/image";
import { useRef, useState } from "react";
import Avatar from "@/app/components/avatar";
import Header from "@/app/components/header";
import Input from "@/app/components/input";
import Button from "@/app/components/button";
import BottomNav from "@/app/components/bottom-nav";
import TextButton from "@/app/components/text-button";
import {
  useLogoutMutation,
  useUpdateUserProfileMutation,
  useUserProfileSuspenseQuery,
} from "@/query/users";
import { uploadProfileImage } from "@/services/storage";
import { useToast } from "@/app/hooks/useToast";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
}

export default function MypageContent({ userId }: Props) {
  const router = useRouter();
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userProfile } = useUserProfileSuspenseQuery(userId);
  const logoutMutation = useLogoutMutation();
  const updateProfileMutation = useUpdateUserProfileMutation(userId);

  const [nickname, setNickname] = useState(userProfile?.nickname ?? "");
  const [profileImage, setProfileImage] = useState(
    userProfile?.profile_image ?? ""
  );

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/login");
    } catch (logoutError) {
      console.error(logoutError);
      error("로그아웃에 실패했어요.");
    }
  };

  const trimmedNickname = nickname.trim();

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        nickname: trimmedNickname === "" ? undefined : trimmedNickname,
      });
      success("저장되었어요.");
    } catch (saveError) {
      console.error(saveError);
      if (isNicknameConflictError(saveError)) {
        error("중복된 닉네임이에요.");
        return;
      }

      error("저장에 실패했어요.");
    }
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(
      file.type
    );

    if (!isValidType) {
      error("jpg, png, webp 형식만 업로드할 수 있어요.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      error("이미지 크기는 2MB 이하여야 해요.");
      return;
    }

    try {
      const publicUrl = await uploadProfileImage(userId, file);
      await updateProfileMutation.mutateAsync({ profile_image: publicUrl });
      setProfileImage(publicUrl);
      success("프로필 이미지가 변경되었어요.");
    } catch (uploadError) {
      console.error(uploadError);
      error("프로필 이미지 업로드에 실패했어요.");
    } finally {
      e.target.value = "";
    }
  };

  const displayNickname = userProfile?.nickname ?? "사용자";
  const email = userProfile?.email ?? "이메일 정보가 없어요.";

  return (
    <main className="w-full min-h-screen flex flex-col items-center relative">
      <Header
        variant="text"
        leftText="내 정보"
        rightContent={
          <TextButton
            size="md"
            className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={logoutMutation.isPending}
            onClick={handleLogout}
          >
            로그아웃
          </TextButton>
        }
      />

      <div className="w-full flex flex-col px-6 mt-18 gap-18">
        <div className="flex flex-col gap-4 items-center">
          <div className="relative w-fit">
            <Avatar
              size="xl"
              src={profileImage || undefined}
              alt="my-profile-image"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleProfileImageChange}
            />
            <button
              type="button"
              className="absolute bottom-0 right-[-10px]"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                  fileInputRef.current.click();
                }
              }}
              disabled={updateProfileMutation.isPending}
            >
              <Image
                src="/images/my-page/upload-image.png"
                alt="edit-profile"
                width={44}
                height={44}
              />
            </button>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="body-lg font-bold">{displayNickname}</span>
            <span className="body-md font-normal text-gray-300">{email}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Input
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={
              updateProfileMutation.isPending ||
              trimmedNickname === "" ||
              trimmedNickname === (userProfile?.nickname ?? "").trim()
            }
          >
            저장하기
          </Button>
        </div>
      </div>

      {!userProfile?.is_anonymous ? (
        <TextButton
          size="md"
          underline
          className="absolute left-1/2 -translate-x-1/2 bottom-[108px] w-auto flex items-center justify-center gap-2"
        >
          탈퇴하기
        </TextButton>
      ) : null}

      <BottomNav />
    </main>
  );
}
