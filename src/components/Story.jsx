import {
  ChatBubbleOutline,
  ChatBubble,
  Reply,
  ThumbUp,
  ThumbDown,
  Star,
  Send,
  CloseRounded,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
  Popover,
  MenuList,
  MenuItem,
  InputBase,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  
} from "@mui/material";
import CompWrapper from "./CompWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setStory } from "../store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfilePicture from "./ProfilePicture";

const Story = ({
  storyId,
  storyUserId,
  username,
  userPicturePath,
  title,
  imagePath,
  content,
  agree,
  disagree,
  response,
  responses,
  comments,
  topic,
  rating,
  isTopic,
}) => {
  const [update, setUpdate] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const stories = useSelector((state) => state.stories);
  const isWideScreen = useMediaQuery("(min-width: 1000px)");
  const primaryLight = theme.palette.primary.light;
  const primaryDark = theme.palette.primary.dark;
  const main = theme.palette.neutral.main;
  const medium = theme.palette.neutral.medium;
  const light = theme.palette.neutral.light;
  const [ratingAnchor, setRatingAnchor] = useState(null);
  const [openComments, setOpenComments] = useState(false);
  const [comment, setComment] = useState("");
  const [confirmComment, setConfirmComment] = useState(false);
  const [confirmStory, setConfirmStory] = useState(false);
  let isAgree;
  let isDisagree;
  let hasRated;
console.log(comments)
  if (user) {
    isAgree = Boolean(agree[user._id]);
    isDisagree = Boolean(disagree[user._id]);
    hasRated = Boolean(rating[user._id]);
  }
  const agreePercentage = Math.round(
    (Object.keys(agree).length /
      (Object.keys(agree).length + Object.keys(disagree).length)) *
      100
  );

  const ratingAverage = (
    Object.values(rating).reduce((acc, curr) => acc + curr, 0) /
    Object.values(rating).length
  ).toFixed(2);
  const handleRating = async (value) => {
    const response = await fetch(
      `http://localhost:8080/story/${storyId}/rate`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Tkn_bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, value: value }),
      }
    );
    const updatedStory = await response.json();
    dispatch(setStory({ story: updatedStory }));
  };

  const handleAgree = async () => {
    const response = await fetch(
      `http://localhost:8080/story/${storyId}/agree`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Tkn_bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      }
    );
    const updatedStory = await response.json();
    dispatch(setStory({ story: updatedStory }));
    setUpdate((prevUpdate) => !prevUpdate);
  };

  const handleDisagree = async () => {
    const response = await fetch(
      `http://localhost:8080/story/${storyId}/disagree`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Tkn_bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      }
    );
    const updatedStory = await response.json();
    dispatch(setStory({ story: updatedStory }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:8080/story/${storyId}/newComment`,
      {
        method: "POST",
        headers: {
          Authorization: `Tkn_bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: comment, userId: user._id }),
      }
    );
    const updatedStory = await response.json();
    dispatch(setStory({ story: updatedStory }));
  };

  const handleCommentAgree = async (commentId) => {
    const response = await fetch(
      `http://localhost:8080/comment/${commentId}/agree`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Tkn_bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      }
    );
    const savedStory = await response.json();
    dispatch(setStory({ story: savedStory }));
  };
  const handleCommentDisagree = async (commentId) => {
    const response = await fetch(
      `http://localhost:8080/comment/${commentId}/disagree`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Tkn_bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      }
    );
    const savedStory = await response.json();
    dispatch(setStory({ story: savedStory }));
  };
  const handleDeleteStory = async () => {
    const response = await fetch(`http://localhost:8080/story/${storyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Tkn_bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user._id }),
    });
    const responseFinal = await response.json();
    navigate(0);
  };
  const handleDeleteComment = async (thisCommentId) => {
    const response = await fetch(`http://localhost:8080/story/${thisCommentId}/comment`, {
      method: "DELETE",
      headers: {
        Authorization: `Tkn_bearer ${token}`,
        "Content-Type" : "application/json",
      },
      body: JSON.stringify({userId: user._id})
    });
    const story = await response.json();
    dispatch(setStory({story: story}))
  };
  return (
    <CompWrapper
      margin="2rem 0"
      flexDirection="column"
      boxShadow={`0px 0px 15px ${light}`}
      padding="1.2rem"
      borderRadius="0.4rem"
    >
      <CompWrapper width="100%">
        <CompWrapper gap="1rem">
          <ProfilePicture size="35px" picturePath={userPicturePath} />
          <Box>
            <Typography
              color={main}
              variant="h5"
              fontWeight="500"
              sx={{ "&:hover": { color: medium, cursor: "pointer" } }}
              onClick={() => (navigate(`/user/${storyUserId}`), navigate(0))}
            >
              {username}
            </Typography>
          </Box>
        </CompWrapper>
        {user && (
          <Box display="flex" alignItems="center" gap="1.25rem">
            <Typography>{responses}</Typography>
            <IconButton
              onClick={() => {
                navigate(`/newstory/response/${storyId}`);
              }}
              sx={{ backgroundColor: primaryLight, padding: "0.6rem" }}
            >
              <Reply />
            </IconButton>
          </Box>
        )}
      </CompWrapper>
      {response && (
        <Typography sx={{ color: "navy" }}>
          On Response to: "{response.title}" - {response.username}
        </Typography>
      )}
      {user && (
        <>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ marginTop: "1.5rem" }}
          textTransform="uppercase"
          fontWeight="bold"
          mb="0.4rem"
        >
          {title} &nbsp;
          {storyUserId === user._id && (
            <IconButton onClick={() => setConfirmStory(true)}>
              <CloseRounded />
            </IconButton>
          )}
        </Typography>
        <Dialog
        open={confirmStory}
        onClose={() => setConfirmStory(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this story?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmStory(false)}>Cancel</Button>
          <Button onClick={() => handleDeleteStory()} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </>)}

      {!isTopic &&
        topic.map((name) => (
          <Typography
            padding="0.1rem 0.3rem"
            color="#FFF"
            backgroundColor="#283593"
            borderRadius="5px"
          >
            {name}
          </Typography>
        ))}
      <Typography sx={{ marginTop: "1rem", lineHeight: "2.5" }}>
        {content}
      </Typography>
      {imagePath && (
        <img
          width="100%"
          height="auto"
          alt="story"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={imagePath}
        />
      )}
      <CompWrapper mt="0.25rem">
        <CompWrapper gap={isWideScreen ? "1rem" : "0"} width="100%" flexGrow="2">
          {user && (
            <>
              <CompWrapper gap="0.3rem">
                <Typography variant={isWideScreen ? "h3" : "h5"} color="primary">
                  {isNaN(ratingAverage) ? "--" : `[${ratingAverage}]`}
                </Typography>
                <IconButton
                  onClick={(e) => setRatingAnchor(e.currentTarget)}
                  disabled={user ? hasRated : false}
                >
                  <Star />
                  {user && hasRated && (
                    <Typography>{rating[user._id]}</Typography>
                  )}
                </IconButton>
                <Popover
                  open={Boolean(ratingAnchor)}
                  anchorEl={ratingAnchor}
                  onClose={() => setRatingAnchor(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <MenuList>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <MenuItem
                        key={rating}
                        onClick={() => handleRating(rating)}
                      >
                        {rating}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Popover>
              </CompWrapper>
              <Divider orientation="vertical" flexItem />
            </>
          )}

          <CompWrapper gap="0.3rem">
            <IconButton
              disabled={user ? false : true}
              onClick={() => handleAgree()}
              
            >
              <ThumbUp sx={{ color: isAgree ? "DodgerBlue" : "Inherit", fontSize: !isWideScreen && "14px" }} />
            </IconButton>
            <Typography fontSize="12px">
              {isNaN(agreePercentage) ? "--" : agreePercentage} %
            </Typography>
            <IconButton
              disabled={user ? false : true}
              onClick={() => handleDisagree()}
            >
              <ThumbDown sx={{ color: isDisagree ? "IndianRed" : "Inherit", fontSize: !isWideScreen && "14px"  }} />
            </IconButton>
            <Typography fontSize="12px">
              {isNaN(100 - agreePercentage) ? "--" : 100 - agreePercentage} %
            </Typography>
            <Typography fontSize="12px">
              ( {Object.keys(agree).length + Object.keys(disagree).length} )
            </Typography>
          </CompWrapper>
          <Divider orientation="vertical" flexItem />
          <CompWrapper gap="0.3rem">
            <IconButton onClick={() => setOpenComments(!openComments)}>
              {openComments ? <ChatBubbleOutline sx={{ fontSize: !isWideScreen && "14px"}}/> : <ChatBubble sx={{ fontSize: !isWideScreen && "14px"}}/>}
            </IconButton>
          </CompWrapper>
        </CompWrapper>
      </CompWrapper>
      {openComments && (
        <Box mt="0.5rem" mb="0.5rem" width="100%">
          
          {comments ? (comments.map((comment) => (
            <>
              <Divider />
              <CompWrapper key={comment._id}>
                <ProfilePicture
                  picturePath={comment.userPicturePath}
                  size="35px"
                  onClick={() => (navigate(`/user/${comment.userId}`), navigate(0))}
                  flexBasis="7%"
                />
                <Typography
                  margin="0.5rem 0"
                  paddingLeft="1rem"
                  flexBasis="93%"
                  float="left"
                >
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                    onClick={() => (navigate(`/user/${comment.userId}`), navigate(0))}
                  >
                    {comment.username}
                  </Typography>
                  {comment.text}
                </Typography>
                {user && comment.userId === user._id && (
                  <>
                  <IconButton onClick={() => setConfirmComment(true)}>
                    <CloseRounded />
                  </IconButton>
                  <Dialog
          open={confirmComment}
          onClose={() => setConfirmComment(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Confirm
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this comment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmComment(false)}>Cancel</Button>
            <Button onClick={() => handleDeleteComment(comment._id)} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        </>
                )}
                <IconButton
                  disabled={user ? false : true}
                  onClick={() => handleCommentAgree(comment._id)}
                >
                  <ThumbUp
                    sx={{
                      color: user
                        ? Boolean(comment.agree[user._id])
                          ? "DodgerBlue"
                          : "Inherit"
                        : "Inherit",
                    }}
                  />
                </IconButton>
                &nbsp;
                <Typography>{Object.keys(comment.agree).length}</Typography>
                <IconButton
                  disabled={user ? false : true}
                  onClick={() => handleCommentDisagree(comment._id)}
                >
                  <ThumbDown
                    sx={{
                      color: user
                        ? Boolean(comment.disagree[user._id])
                          ? "IndianRed"
                          : "Inherit"
                        : "Inherit",
                    }}
                  />
                </IconButton>
                &nbsp;{" "}
                <Typography>{Object.keys(comment.disagree).length}</Typography>
              </CompWrapper>
            </>
          )) ) : (<CircularProgress/>)}
        </Box>
      )}
      {user && (
        <>
          <Divider />
          <CompWrapper width="100%" gap="0.3rem">
            <ProfilePicture
              picturePath={user.userPicturePath}
              size="35px"
              flexBasis="7%"
            />
            <form
              onSubmit={(e) => handleComment(e)}
              style={{ flexBasis: "93%" }}
            >
              <InputBase
                sx={{
                  border: `1px solid ${light}`,
                  borderRadius: "5px",
                  padding: "0.3rem",
                  margin: "0.3rem",
                  width: "85%",
                }}
                placeholder="Write a comment..."
                onChange={(e) => setComment(e.target.value)}
                required
                value={comment}
              />
              <IconButton color={main} type="submit">
                <Send />
              </IconButton>
            </form>
          </CompWrapper>
        </>
      )}
    </CompWrapper>
  );
};
export default Story;
