import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const KakaoLogin = "/images/login/kakao.png";
const NaverLogin = "/images/login/naver.png";
const GoogleLogin = "/images/login/google.png";

import Image from "next/image";
export type SnsLoginType = "kakao" | "naver" | "google";

const snsLoginType = {
  kakao: {
    image: KakaoLogin,
    text: "카카오로 로그인하기",
    className: "kakao-login",
  },
  naver: {
    image: NaverLogin,
    text: "네이버로 로그인하기",
    className: "naver-login",
  },
  google: {
    image: GoogleLogin,
    text: "구글로 로그인하기",
    className: "google-login",
  },
};

interface Props {
  onClick?: () => void;
  type: SnsLoginType;
  loading?: boolean;
}

export default function SnsLoginButton({ onClick, type, loading }: Props) {
  return (
    <button
      className={`relative btn ${snsLoginType[type].className}`}
      onClick={onClick}
    >
      {loading ? (
        <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
      ) : (
        <div className="flex items-center justify-between gap-2 ">
          <Image
            src={snsLoginType[type].image}
            alt={type}
            width={48}
            height={48}
            className="absolute left-4"
            aria-hidden="true"
          />
          <span>{snsLoginType[type].text}</span>
        </div>
      )}
    </button>
  );
}
