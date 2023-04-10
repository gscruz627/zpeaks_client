import {
  Box,
  CircularProgress,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStories } from "../store";
import Story from "./Story";
import { ArrowDropDown } from "@mui/icons-material";

const Stories = ({
  userId = null,
  isProfile = false,
  isTopic = false,
  topic = null,
  isAgree = false,
  isDisagree = false,
  isSearch = null,
  searchKeyword = null,
}) => {
  const dispatch = useDispatch();
  const stories = useSelector((state) => state.stories);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [filter, setFilter] = useState(null);
  const [anchor, setAnchor] = useState(null);
  const getStories = async (filter) => {
    let response = null;
    if (user) {
      response = await fetch(`http://localhost:8080/stories?filter=${filter}`, {
        method: "GET",
        headers: {
          Authorization: `Tkn_bearer ${token}`,
        },
      });
    } else {
      response = await fetch(`http://localhost:8080/stories?filter=${filter}`, {
        method: "GET",
      });
    }

    const storiesData = await response.json();
    dispatch(setStories({ stories: storiesData }));
  };
  const getUserStories = async (filter) => {
    let response = null;
    if (user) {
      response = await fetch(
        `http://localhost:8080/${userId}/stories?filter=${filter}`,
        {
          method: "GET",
          headers: {
            Authorization: `Tkn_bearer ${token}`,
          },
        }
      );
    } else {
      response = await fetch(
        `http://localhost:8080/${userId}/stories?filter=${filter}`,
        {
          method: "GET",
        }
      );
    }
    const storiesData = await response.json();
    dispatch(setStories({ stories: storiesData }));
  };
  const getTopicStories = async (filter) => {
    let response = null;
    if (user) {
      response = await fetch(
        `http://localhost:8080/topics/${topic}?filter=${filter}`,
        {
          method: "GET",
          headers: {
            Authorization: `Tkn_bearer ${token}`,
          },
        }
      );
    } else {
      response = await fetch(
        `http://localhost:8080/topics/${topic}?filter=${filter}`,
        {
          method: "GET",
        }
      );
    }
    const storiesData = await response.json();
    dispatch(setStories({ stories: storiesData }));
  };
  const getAgreeStories = async (filter) => {
    const response = await fetch(
      `http://localhost:8080/${user._id}/agree?filter=${filter}`,
      {
        method: "GET",
        headers: {
          Authorization: `Tkn_bearer ${token}`,
        },
      }
    );
    const stories = await response.json();
    dispatch(setStories({ stories: stories }));
  };
  const getDisagreeStories = async (filter) => {
    const response = await fetch(
      `http://localhost:8080/${user._id}/disagree?filter=${filter}`,
      {
        method: "GET",
        headers: {
          Authorization: `Tkn_bearer ${token}`,
        },
      }
    );
    const stories = await response.json();
    dispatch(setStories({ stories: stories }));
  };
  const getSearchResults = async () => {
    const response = await fetch(
      `http://localhost:8080/search/stories/${searchKeyword}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const storiesRes = await response.json();
    dispatch(setStories({ stories: storiesRes }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserStories(filter);
    } else if (isTopic) {
      getTopicStories(filter);
    } else if (isAgree) {
      getAgreeStories(filter);
      console.log("agree");
    } else if (isDisagree) {
      getDisagreeStories(filter);
    } else if (isSearch) {
      getSearchResults(filter);
    } else {
      console.log("no nothing");
      getStories(filter);
    }
  }, []);
  useEffect(() => {
    if (isProfile) {
      getUserStories(filter);
    } else if (isTopic) {
      getTopicStories(filter);
    } else if (isAgree) {
      getAgreeStories(filter);
      console.log("agree");
    } else if (isDisagree) {
      getDisagreeStories(filter);
    } else if (isSearch) {
      getSearchResults(filter);
    } else {
      getStories(filter);
    }
  }, [filter]);
  console.log(isAgree);
  return (
    <Box flexBasis="50%">
      
      {topic && (
        <Typography variant="h3" textAlign="center" mt="2rem">
          {topic}
        </Typography>
      )}
      {isAgree && (
        <Typography variant="h3" textAlign="center" mt="2rem">
          Agreed Stories
        </Typography>
      )}
      {isDisagree && (
        <Typography variant="h3" textAlign="center" mt="2rem">
          Disagreed Stories
        </Typography>
      )}
      {isSearch && (
        <Typography variant="h3" textAlign="center" mt="2rem">
          Search Results for "{searchKeyword}"
        </Typography>
      )}
      {(!isDisagree && isAgree) || !(isDisagree && !isAgree) && (
        <>
        <Box
        mt="2rem"
        onClick={(e) => {
          setAnchor(e.currentTarget);
        }}
        display="flex"
        alignItems="center"
        gap="1rem"
      >
        <Typography>{filter || "No Filters"}</Typography> &nbsp; &nbsp;
        <ArrowDropDown />
      </Box>
        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => {
            setAnchor(null);
          }}
        >
          <MenuItem onClick={() => setFilter("mostrated")}>
            <Typography>Most Rated</Typography>
          </MenuItem>
          <MenuItem onClick={() => setFilter("worstrated")}>
            <Typography>Worst Rated</Typography>
          </MenuItem>
          <MenuItem onClick={() => setFilter("mostagreed")}>
            <Typography>Most Agreed</Typography>
          </MenuItem>
          <MenuItem onClick={() => setFilter("leastagreed")}>
            <Typography>Least Agreed</Typography>
          </MenuItem>
          <MenuItem onClick={() => setFilter("mostresponses")}>
            <Typography>Most responses</Typography>
          </MenuItem>
          <MenuItem onClick={() => setFilter("recent")}>
            <Typography>Recent</Typography>
          </MenuItem>
        </Menu>
      </>)}
      

      {stories ? (
        Object.keys(stories).length > 0 ? (
          stories.map(
            ({
              _id,
              userId,
              username,
              userPicturePath,
              title,
              imagePath,
              content,
              agree,
              disagree,
              rating,
              responseStory,
              comments,
              topic,
              commentsFull,
              responses,
            }) => (
              <Story
                key={_id}
                storyId={_id}
                storyUserId={userId}
                username={username}
                userPicturePath={userPicturePath}
                title={title}
                imagePath={imagePath}
                content={content}
                agree={agree}
                disagree={disagree}
                rating={rating}
                comments={commentsFull}
                topic={topic}
                isTopic={isTopic}
                responses={responses}
                response={responseStory}
              />
            )
          )
        ) : (
          <Typography mt="2rem">No Results</Typography>
        )
      ) : (
        <CircularProgress textAlign="center" />
      )}
    </Box>
  );
};

export default Stories;
