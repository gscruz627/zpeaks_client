import { useSelector, useDispatch } from "react-redux";
import { setStories } from "../store";
import Stories from "../components/Stories";
import SidePanel from "../components/SidePanel";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useMediaQuery, Box } from "@mui/material";
import Following from "../components/Following";

const StoriesFilter = ({isAgree, isDisagree}) => {
    const isWideScreen = useMediaQuery("(min-width:1000px)");
    console.log(isAgree, isDisagree)
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
        <Stories isAgree={isAgree} isDisagree={isDisagree}
        />
        <Following/>
      </Box>
    </>
    )
}
export default StoriesFilter;