import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  TextareaAutosize,
  useTheme,
  Typography,
  Box,
  Button,
  useMediaQuery,
  TextField,
  Alert,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import Dropzone from "react-dropzone";
import CompWrapper from "../components/CompWrapper";
import Navbar from "../components/Navbar";

const NewStory = () => {
  const isWideScreen = useMediaQuery("(min-width:1000px)");
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { response } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState(null);
  const [picture, setPicture] = useState(null);
  const [topicsSelect, setTopicsSelect] = useState([]);
  const [contentValid, setContentValid] = useState(true);

  
  const getTopics = async () => {
    const response = await fetch("https://yodm-server.onrender.com//topics", {
      method: "GET",
    });
    const topicsJson = await response.json();
    setTopics(topicsJson);
  };
  const uploadStory = async (e) => {
    e.preventDefault();
    if (content.split(" ").length >= 100) {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("topic", topicsSelect);
      if (response) {
        formData.append("response", response);
      }
      if (picture) {
        formData.append("picture", picture);
      }
      const fetchResponse = await fetch("https://yodm-server.onrender.com/newStory", {
        method: "POST",
        headers: { Authorization: `Tkn_bearer ${token}` },
        body: formData,
      });
      navigate("/");
    } else {
      setContentValid(false);
    }
  };
  const getResponseStoryData = async () => {
    const fetchResponse = await fetch(
      `https://yodm-server.onrender.com/story/${response}`, {
        method: "GET"
      }
    )
    const storyData = await fetchResponse.json();
    setResponseData(storyData);
  }
  useEffect(() => {
    getTopics();
    if(response){
      getResponseStoryData();
    }
  }, []);
  return (
    <>
      <Navbar />
      <Box
        borderRadius="5px"
        borderColor="primary"
        width={isWideScreen ? "auto" : "90%"}
        margin="auto auto"
      >
        <Box
          maxWidth="600px"
          margin="auto auto"
          padding="2rem 6%"
          textAlign="center"
        >
          <Typography fontWeight="bold" variant="h1">
            Posting a new story
          </Typography>
          {responseData && (
            <Typography sx={{ color: "navy"}}>On response to {responseData.title} - {responseData.username}</Typography>
          )}
        </Box>
        <form onSubmit={(e) => uploadStory(e)}>
          <Box
            display="grid"
            gap="30px"
            margin="auto auto"
            maxWidth="600px"
            textAlign="center"
            sx={{
              "& > div": { gridColumn: isWideScreen ? undefined : "span 4" },
            }}
          >
            <TextField
              label="Title: "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ gridColumn: "span 2" }}
              required
            ></TextField>
            {!contentValid && (
              <Alert severity="error">
                Content has to be at least 100 words.
              </Alert>
            )}
            <Select multiple value={topicsSelect} onChange={(e) => setTopicsSelect(e.target.value)}>
              {topics ? (
                  topics.map((topic) => (
                    <MenuItem key={topic._id} value={topic.name}>{topic.name}</MenuItem>
                  ))
              ) : (
                <CircularProgress/>
              )
              }
            </Select>
            <TextField
              label="Content: "
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              sx={{
                gridColumn: "span 2",
                backgroundColor: "transparent",
                padding: "0.3rem",
              }}
              multiline
              cols="30"
              rows="20"
              required
              placeholder="Min 100 words"
            />
            <Dropzone
              acceptedFiles=".jpg, .jpeg, .png, .bmp"
              multiple={false}
              onDrop={(droppedFile) => {
                setPicture(droppedFile[0]);
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps()}
                  border={`2px solid ${palette.primary.main}`}
                  borderRadius="10px"
                  padding="1rem"
                  sx={{
                    gridColumn: "span 2",
                    "&:hover": { cursor: "pointer" },
                  }}
                  width="100%"
                >
                  <input {...getInputProps()} />
                  {picture ? (
                    <>
                      <CompWrapper>
                        <Typography> {picture.name} </Typography>
                        <EditOutlined />
                      </CompWrapper>
                      <CompWrapper>
                        <img
                          src={URL.createObjectURL(picture)}
                          style={{
                            textAlign: "center",
                            margin: "1rem auto",
                            maxWidth: "300px",
                          }}
                        />
                      </CompWrapper>
                    </>
                  ) : (
                    <p> Upload an image (not required) </p>
                  )}
                </Box>
              )}
            </Dropzone>
            <Box width="100%" textAlign="center" margin="auto auto">
              <Button
                fullWidth
                margin="auto auto"
                type="submit"
                variant="fill"
                padding="1rem"
                sx={{
                  backgroundColor: palette.primary.main,
                }}
                onClick={(e) => {
                  uploadStory(e);
                }}
              >
                POST
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default NewStory;
