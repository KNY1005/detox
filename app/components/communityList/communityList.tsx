import { faCommentDots, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Link from "next/link";

interface Props {
  href: string;
  userName: string;
  timeAgo: string;
  communityTitle: string;
  communityContent: string;
  likeCount: number;
  commentCount: number;
}
export default function CommunityList({
  href,
  userName,
  timeAgo,
  communityTitle,
  communityContent,
  likeCount,
  commentCount,
}: Props) {
  return (
    <Link href={href} className="community-item">
      <div className="profile-info">
        {/* <div className="thumb">
        프로필사진
        </div> */}
        <div className="text-wrap">
          <div className="item-name">{userName}</div>
          <span className="item-time">{timeAgo}</span>
        </div>
      </div>
      <div className="item-content">
        <h6>{communityTitle}</h6>
        <p>{communityContent}</p>
      </div>
      <div className="reaction-bar">
        <div className="like">
          <FontAwesomeIcon icon={faThumbsUp} size="sm" />
          <span className="count">{likeCount}</span>
        </div>
        <div className="comment">
          <FontAwesomeIcon icon={faCommentDots} size="sm" />
          <span className="count">{commentCount}</span>
        </div>
      </div>
    </Link>
  );
}
