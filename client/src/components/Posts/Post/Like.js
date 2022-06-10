import React, { useEffect } from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { useSelector } from "react-redux";
function Like({ likes }) {
  const user = useSelector((state) => state.auth);

  useEffect(() => {}, [user]); //
  if (likes?.length > 0) {
    return likes?.find(
      (id) => id === (user?.profile?._id || user?.profile?.googleId)
    ) ? (
      <>
        <ThumbUpAltIcon fontSize="small" />
        &nbsp;
        {likes.length > 2
          ? `You and ${likes.length - 1} others`
          : `${likes.length} like${likes.length > 1 ? "s" : ""}`}
      </>
    ) : (
      <>
        <ThumbUpAltOutlinedIcon fontSize="small" />
        &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
      </>
    );
  }
  return (
    <>
      <ThumbUpAltOutlinedIcon fontSize="small" />
      &nbsp;Like
    </>
  );
}

export default Like;
