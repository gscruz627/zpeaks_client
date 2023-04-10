import { useEffect } from "react";
import { setStories } from "../store";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import SidePanel from "../components/SidePanel";
import { CircularProgress, useMediaQuery, Box } from "@mui/material";
const ImagesStories = () => {
  const isWideScreen = useMediaQuery("(min-width:1000px)");
  const stories = useSelector((state) => state.stories);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const getStories = async () => {
    let response = null;
    if (user) {
      response = await fetch("http://localhost:8080/stories", {
        method: "GET",
        headers: {
          Authorization: `Tkn_bearer ${token}`,
        },
      });
    } else {
      response = await fetch("http://localhost:8080/stories", {
        method: "GET",
      });
    }

    const storiesData = await response.json();
    dispatch(setStories({ stories: storiesData }));
  };

  useEffect(() => {
    getStories();
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
        <SidePanel flexBasis={isWideScreen ? "30%" : undefined} />
        <Box flexBasis="70%" display={isWideScreen ? "flex" : "block"} flexWrap="wrap" gap="3%">
          {stories ? (
            stories.length > 0 &&
            stories.map(
              (story) =>
                story.imagePath && (
                  <img
                    src={story.imagePath}
                    width={isWideScreen ? "30%" : "100%"}
                    height={isWideScreen ? "170px" : ""}
                    
                    sx={{ marginTop: isWideScreen ? "" : "25px", borderRadius: "5px", objectFit: "cover" }}
                  />
                )
            )
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Box>
    </>
  );
};
export default ImagesStories;
