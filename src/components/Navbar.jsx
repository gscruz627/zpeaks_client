import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Menu,
  Button,
} from "@mui/material";
import {
  Search,
  DarkMode,
  LightMode,
  Help,
  Close,
  Logout,
  Settings,
  Menu as MenuIcon,
  ArrowDownward,
  ArrowDropDown,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { setTheme, setLogout } from "../store";
import CompWrapper from "./CompWrapper";
import ProfilePicture from "./ProfilePicture";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let theme = useTheme();
  const user = useSelector((state) => state.user);
  const isWideScreen = useMediaQuery("(min-width: 1000px)");
  const neutralLight = theme.palette.neutral.main;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primary = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;
  const light = theme.palette.neutral.light;
  const [anchor, setAnchor] = useState(null);
  const [anchor2, setAnchor2] = useState(null);
  const [isDropdown, setIsDropdown] = useState(false);
  const [searchChoice, setSearchChoice] = useState("stories");
  const [keyword, setKeyword] = useState("");

  return (
    <CompWrapper padding="1rem 6%" backgroundColor={primary}>
      <CompWrapper gap="1.75rem" flexBasis="34%">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 1.5rem, 2rem)"
          color={dark}
          onClick={() => ( navigate("/"), navigate(0))}
          sx={{
            "&:hover": {
              color: neutralLight,
              cursor: "pointer",
            },
          }}
        >
          YODM
        </Typography>
      </CompWrapper>
      {isWideScreen && (
        <CompWrapper
          fontSize="26px"
          backgroundColor={primaryDark}
          borderRadius="4px"
          gap="3rem"
          padding="0.1rem 1.5rem"
          width="25rem"
          flexBasis="58%"
        >
          <InputBase
            placeholder="Search..."
            sx={{ color: light, width: "100%" }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            }
            onKeyPress={(e) =>
              e.key === "Enter" && /\S/.test(keyword)
                ? ( navigate(`/search/${searchChoice}/${keyword}`), navigate(0) )
                : undefined
            }
            endAdornment={
              <>
                <Typography color={light} padding="5px 10px">
                  {searchChoice}
                </Typography>
                <IconButton
                  onClick={(event) => setAnchor2(event.currentTarget)}
                >
                  <ArrowDropDown />
                </IconButton>
                <Menu
                  anchorEl={anchor2}
                  open={Boolean(anchor2)}
                  onClose={() => {
                    setAnchor2(null);
                  }}
                >
                  <MenuItem onClick={() => setSearchChoice("users")}>
                    <Typography>Users</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => setSearchChoice("stories")}>
                    <Typography>Stories</Typography>
                  </MenuItem>
                </Menu>
              </>
            }
          ></InputBase>
        </CompWrapper>
      )}

      {isWideScreen ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          gap="2rem"
          flexBasis="33.5%"
        >
          <IconButton onClick={() => dispatch(setTheme())}>
            {theme.palette.mode === "dark" ? (
              <LightMode sx={{ fontSize: "26px" }}></LightMode>
            ) : (
              <DarkMode sx={{ fontSize: "26px" }}></DarkMode>
            )}
          </IconButton>
          {user ? (
            <>
              <ProfilePicture
                size="35px"
                picturePath={user.userPicturePath}
                sx={{ cursor: "pointer" }}
                target={`/user/${user._id}`}
              />
              <IconButton onClick={(event) => setAnchor(event.currentTarget)}>
                <Settings />
              </IconButton>
              <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => {
                  setAnchor(null);
                }}
              >
                <MenuItem onClick={() => ( navigate("/settings"), navigate(0))}>
                  <Settings /> &nbsp; &nbsp; Settings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(setLogout());
                  }}
                >
                  <Logout /> &nbsp; &nbsp; Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="text"
                sx={{ color: dark }}
                size="large"
                onClick={() => (navigate("/login"), navigate(0))}
              >
                Log In
              </Button>
              <Button
                variant="text"
                sx={{ color: dark }}
                size="large"
                onClick={() => (navigate("/login"), navigate(0))}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      ) : (
        <IconButton onClick={() => setIsDropdown(!isDropdown)}>
          <MenuIcon sx={{ fontSize: "36px" }} />
        </IconButton>
      )}
      {!isWideScreen && isDropdown && (
        <Box
          position="fixed"
          right="0"
          top="0"
          height="auto"
          zIndex="10"
          width="300px"
          backgroundColor={background}
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton onClick={() => setIsDropdown(!isDropdown)}>
              <Close sx={{ fontSize: "36px", marginLeft: "auto" }} />
            </IconButton>
          </Box>
          <CompWrapper
            flexDirection="column"
            justifyContent="flex-start"
            gap="3rem"
          >
            <Box display="flex" textAlign="center" alignItems="center">
              <IconButton onClick={() => dispatch(setTheme())}>
                {theme.palette.mode === "dark" ? (
                  <LightMode sx={{ fontSize: "36px" }}></LightMode>
                ) : (
                  <DarkMode sx={{ fontSize: "36px" }}></DarkMode>
                )}
              </IconButton>
              <Typography variant="h3"> &nbsp; &nbsp; Theme</Typography>
            </Box>
            {user ? (
              <>
                <ProfilePicture
                  picturePath={user.userPicturePath}
                  target={`/user/${user._id}`}
                  size="35px"
                />
                <Box display="flex" textAlign="center" alignItems="center">
                  <IconButton onClick={ () => navigate("/settings")}>
                    <Settings sx={{ fontSize: "36px" }} />
                  </IconButton>
                  <Typography variant="h3"> &nbsp; &nbsp; Settings</Typography>
                </Box>
                <Box display="flex" textAlign="center" alignItems="center">
                  <IconButton onClick={ () => dispatch(setLogout())}>
                    <Logout sx={{ fontSize: "36px" }} />
                  </IconButton>
                  <Typography variant="h3"> &nbsp; &nbsp; Logout</Typography>
                </Box>
              </>
            ) : (
              <>
                <Button variant="text" sx={{ color: dark, fontSize: "24px" }} onClick={() => (navigate("/login"), navigate(0))}>
                  Log In
                </Button>
                <Button variant="text" sx={{ color: dark, fontSize: "24px" }} onClick={() => (navigate("/login"), navigate(0))}>
                  Sign Up
                </Button>
              </>
            )}
          </CompWrapper>
        </Box>
      )}
    </CompWrapper>
  );
};

export default Navbar;
