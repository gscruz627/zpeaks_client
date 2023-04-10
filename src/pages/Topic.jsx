import Stories from "../components/Stories";
import Navbar from "../components/Navbar";
import SidePanel from "../components/SidePanel";
import Following from "../components/Following";
import { Box, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useParams } from "react-router-dom";

const Topic = () => {
  const isWideScreen = useMediaQuery("(min-width:1000px)");
  const { topic } = useParams();
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
        <Stories
          flexBasis={isWideScreen ? "50%" : undefined}
          isTopic={true}
          topic={topic}
        />
        <Following flexBasis={isWideScreen ? "30%" : undefined} />
      </Box>
    </>
  );
};

export default Topic;
