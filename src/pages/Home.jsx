import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import UploadStory from "../components/UploadStory";
import CompWrapper from "../components/CompWrapper";
import { Box } from "@mui/system";
import { useMediaQuery } from "@mui/material";
import Stories from "../components/Stories";
import Following from "../components/Following";
import SidePanel from "../components/SidePanel";
const Home = () => {
  const user = useSelector((state) => state.user);
  const isWideScreen = useMediaQuery("(min-width:1000px)");
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
        <Stories flexBasis={isWideScreen ? "50%" : undefined} />
        <Following flexBasis={isWideScreen ? "30%" : undefined} />
      </Box>
    </>
  );
};

export default Home;
