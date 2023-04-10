import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useTheme, Typography } from "@mui/material";
import { setFollowings } from "../store";
import { useDispatch } from "react-redux";
import ProfilePicture from "./ProfilePicture";
import CompWrapper from "./CompWrapper";

const Following = () => {
  let user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  let followingList;
  let getFollowing;
  if (user) {
    getFollowing = async () => {
      const response = await fetch(
        `http://localhost:8080/auth/${user._id}/following`,
        {
          method: "GET",
          headers: {
            Authorization: `Tkn_bearer ${token}`,
          },
        }
      );
      const following = await response.json();
      dispatch(setFollowings({ following: following }));
    };
    followingList =
      Array.from(user.following).length > 0
        ? user.following.length > 5
          ? user.following.slice(0, 4)
          : user.following
        : [];
  }
  useEffect(() => {
    if (user) {
      getFollowing();
    }
  }, []);
  return (
    <Box
      display="flex"
      justifyContent="center"
      margin="2rem 0"
      flexDirection="column"
      boxShadow={`0px 0px 15px ${palette.neutral.light}`}
      padding="1.2rem"
      borderRadius="0.4rem"
      height="100px"
      flexBasis="25%"
    >
      <Typography fontWeight="bold" variant="h4" color={palette.neutral.medium}>
        FOLLOWING
      </Typography>
      <CompWrapper mt="0.5rem">
        {user && followingList.length > 0 ? (
          followingList.map((user) => (
            <ProfilePicture
              key={user._id}
              picturePath={user.userPicturePath}
              size="35px"
              target={`user/${user._id}`}
              username={user.username}
            />
          ))
        ) : (
          <Typography color={palette.neutral.medium}>
            You are not following anyone yet
          </Typography>
        )}
      </CompWrapper>
    </Box>
  );
};

export default Following;
