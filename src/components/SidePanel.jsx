import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  useTheme,
  IconButton,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import CompWrapper from "./CompWrapper";
import {
  Home,
  Article,
  ThumbUp,
  ThumbDown,
  Image,
  ArrowDropDown,
  ArrowDropUp,
  PlusOne,
} from "@mui/icons-material";

const SidePanel = () => {
  const { palette } = useTheme();
  const isWideScreen = useMediaQuery("(min-width:1000px)");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [topics, setTopics] = useState(null);
  const [openTopics, setOpenTopics] = useState(isWideScreen);
  const getTopics = async () => {
    const response = await fetch("http://localhost:8080/topics", {
      method: "GET",
    });
    const topicsJson = await response.json();
    setTopics(topicsJson);
  };
  useEffect(() => {
    getTopics();
  }, []);
  useEffect(() => {
    console.log(topics);
  }, [topics]);
  return (
    <Box
      display="flex"
      margin="2rem 0"
      flexDirection="column"
      boxShadow={`0px 0px 15px ${palette.neutral.light}`}
      padding="1.8rem"
      borderRadius="0.4rem"
      width="100%"
      height="auto"
      flexBasis="25%"
    >
      <Typography
        marginBottom="1rem"
        variant="h4"
        fontWeight="bold"
        color={palette.neutral.medium}
      >
        MENU
      </Typography>
      <CompWrapper
        flexDirection="column"
        sx={{
          "& :hover & > div": { backgroundColor: palette.neutral.dark },
          alignItems: "flex-start",
        }}
        width="100%"
      >
        <Box
          display="flex"
          flexDirection="row"
          width="129.1%"
          margin="0 0 0 -28.5px"
          alignItems="center"
          padding="5px 0 5px 20px"
          sx={{
            "&:hover": {
              backgroundColor: palette.primary.light,
              cursor: "pointer",
              "& > p": { color: "#000" },
            },
          }}
          onClick={() => (navigate("/"), navigate(0))}
        >
          <IconButton>
            <Home sx={{ color: palette.primary.main }} />
          </IconButton>
          <Typography color={palette.neutral.medium}>Home</Typography>
        </Box>
        {user && (
          <>
          <Box
            display="flex"
            flexDirection="row"
            width="129.1%"
            margin="0 0 0 -28.5px"
            alignItems="center"
            padding="5px 0 5px 20px"
            sx={{
              "&:hover": {
                backgroundColor: palette.primary.light,
                cursor: "pointer",
                "& > p": { color: "#000" },
              },
            }}
            onClick={() => (navigate(`/user/${user._id}`), navigate(0))}
          >
            <IconButton>
              <Article sx={{ color: palette.primary.main }} />
            </IconButton>
            <Typography color={palette.neutral.medium}>Your Stories</Typography>
          </Box>
          <Box
          display="flex"
          flexDirection="row"
          width="129.1%"
          margin="0 0 0 -28.5px"
          alignItems="center"
          padding="5px 0 5px 20px"
          sx={{
            "&:hover": {
              backgroundColor: palette.primary.light,
              cursor: "pointer",
              "& > p": { color: "#000" },
            },
          }}
          onClick={() => navigate(`/newstory`)}
        >
          <IconButton>
            <PlusOne sx={{ color: palette.primary.main }} />
          </IconButton>
          <Typography color={palette.neutral.medium}>New Story</Typography>
        </Box>
        </>)}
        <Box
          display="flex"
          flexDirection="row"
          width="129.1%"
          margin="0 0 0 -28.5px"
          alignItems="center"
          padding="5px 0 5px 20px"
          sx={{
            "&:hover": {
              backgroundColor: palette.primary.light,
              cursor: "pointer",
              "& > p": { color: "#000" },
            },
          }}
          onClick={ () => (navigate("/images"), navigate(0))}
        >
          <IconButton>
            <Image sx={{ color: palette.primary.main }} />
          </IconButton>
          <Typography color={palette.neutral.medium}>
            Images from Stories
          </Typography>
        </Box>
        
        {user && (<>
        <Box
          display="flex"
          flexDirection="row"
          width="129.1%"
          margin="0 0 0 -28.5px"
          alignItems="center"
          padding="5px 0 5px 20px"
          sx={{
            "&:hover": {
              backgroundColor: palette.primary.light,
              cursor: "pointer",
              "& > p": { color: "#000" },
            },
          }}
          onClick={() => (
            navigate("/agree"), navigate(0)
        )}
        >
          <IconButton>
            <ThumbUp sx={{ color: palette.primary.main }} />
          </IconButton>
          <Typography color={palette.neutral.medium}>Stories agreed</Typography>
        </Box>
          <Box
          display="flex"
          flexDirection="row"
          width="129.1%"
          margin="0 0 0 -28.5px"
          alignItems="center"
          padding="5px 0 5px 20px"
          sx={{
            "&:hover": {
              backgroundColor: palette.primary.light,
              cursor: "pointer",
              "& > p": { color: "#000" },
            },
          }}
          onClick={() => (navigate("/disagree"), navigate(0))}
        >
          <IconButton>
            <ThumbDown sx={{ color: palette.primary.main }} />
          </IconButton>
          <Typography color={palette.neutral.medium}>
            Stories disagreed
          </Typography>
        </Box>
        </>)}
        
      </CompWrapper>
      <Typography
        mt="1.5rem"
        variant="h4"
        fontWeight="bold"
        color={palette.neutral.medium}
      >
        TOPICS
        <IconButton onClick={() => setOpenTopics(!openTopics)}>
          {openTopics ? <ArrowDropUp /> : <ArrowDropDown />}
        </IconButton>
      </Typography>

      <CompWrapper
        flexDirection="column"
        sx={{
          "& :hover & > div": { backgroundColor: palette.neutral.dark },
          alignItems: "flex-start",
        }}
        width="100%"
      >
        {topics ?
          openTopics &&
          topics.map((topic) => (
            <Box
              display="flex"
              flexDirection="row"
              width="129.1%"
              margin="0 0 0 -28.5px"
              alignItems="center"
              padding="10px 0 10px 30px"
              sx={{
                "&:hover": {
                  backgroundColor: palette.primary.light,
                  cursor: "pointer",
                  "& > p": { color: "#000" },
                },
              }}
              onClick={() => {
                navigate(`/topic/${topic.name}`);
                navigate(0);
              }}
            >
              <Typography color={palette.neutral.medium}>
                {topic.name}
              </Typography>
            </Box>
          )) : <CircularProgress/>}
      </CompWrapper>
    </Box>
  );
};

export default SidePanel;
