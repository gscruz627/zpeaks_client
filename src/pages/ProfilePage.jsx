import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setFollowings } from "../store";
import ProfilePicture from "../components/ProfilePicture";
import {
  Typography,
  Box,
  useTheme,
  IconButton,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { PersonAdd, PersonRemove } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import CompWrapper from "../components/CompWrapper";
import { useParams } from "react-router-dom";
import Following from "../components/Following";
import Stories from "../components/Stories";
import SidePanel from "../components/SidePanel"

const ProfilePage = () => {
  const isWideScreen = useMediaQuery("(min-width:1000px)");
  const [thisUser, setThisUser] = useState(null);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const { thisUserId } = useParams();
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const getUserInfo = async () => {
    const response = await fetch(`https://yodm-server.onrender.com/auth/${thisUserId}`, {
      method: "GET",
    });
    const thisUserResponse = await response.json();
    setThisUser(thisUserResponse.user);
  };
  let isFollow = false;
  if(user){
    isFollow = Array.from(user.following).length > 0
    ? user.following.some((following) => following._id === thisUserId)
    : false;
  }
  
  const handleFollow = async () => {
    const response = await fetch(
      `https://yodm-server.onrender.com/auth/follow/${user._id}/${thisUserId}`,
      {
        method: "PATCH",
        headers: { Authorization: `Tkn_bearer ${token}` },
      }
    );
    const newFollowing = await response.json();
    dispatch(setFollowings( {following: newFollowing}))
    getUserInfo();
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <>
      <Navbar />
      <Box
        width="100%"
        padding="1rem 6%"
        display={isWideScreen ? "flex" : "block"}
        justifyContent="space-between"
        gap="2rem"
      >
        <SidePanel/>
        <CompWrapper
          flexBasis={isWideScreen ? "50%" : undefined}
          flexDirection="column"
        >
          <CompWrapper flexDirection="column" gap="1rem" mt="2rem" width="100%">
            {thisUser ? (
              <>
                <ProfilePicture
                  picturePath={thisUser.userPicturePath}
                  size="100px"
                />
                <CompWrapper>
                  <Typography
                    color={palette.neutral.medium}
                    variant="h2"
                    fontWeight="bold"
                  >
                    {thisUser.username}
                  </Typography>
                  {user && thisUserId !== user._id && (
                    <IconButton style={{ marginLeft: "1rem" }} onClick={ () => {handleFollow()}}>
                    {isFollow ? <PersonRemove /> : <PersonAdd />}
                  </IconButton>
                  )}
                  
                </CompWrapper>
                <CompWrapper width="100%">
                  <Box>
                    <Typography variant="h5">
                      Following &nbsp;
                      {thisUser
                        ? Object.keys(thisUser.following).length
                        : "0"}
                      &nbsp; others
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5">
                      Followers: &nbsp;
                      {thisUser
                        ? Object.keys(thisUser.followers).length
                        : " 0"}
                    </Typography>
                  </Box>
                </CompWrapper>

                <Typography>Liked Topics</Typography>
              </>
            ) : (
              <CircularProgress />
            )}
          </CompWrapper>
          <Stories isProfile="true" userId={thisUserId} />
        </CompWrapper>
        <Following flexBasis={isWideScreen ? "30%" : undefined} />
      </Box>
    </>
  );
};

export default ProfilePage;
