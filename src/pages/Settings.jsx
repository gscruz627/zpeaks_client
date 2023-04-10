import CompWrapper from "../components/CompWrapper";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Dropzone from "react-dropzone";
import { EditOutlined, Warning } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Form from "../components/Form";
import { useSelector, useDispatch } from "react-redux";
import { setLogin, setLogout } from "../store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { palette } = useTheme();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isWideScreen = useMediaQuery("(min-width: 1000px)");
  const [username, setUsername] = useState(user.username);
  const [usernameValid, setUsernameValid] = useState(true);
  const [changesError, setChangesError] = useState(false);
  const [notPassword, setNotPassword] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [picture, setPicture] = useState(null);
  const [confirmedChanges, setConfirmedChanges] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const resetForm = () => {
    setUsername("");
    setPassword("");
    setPicture(null);
    setEmail("");
    setIsEmailValid(true);
    setIsPasswordValid(true);
  };
  const handleUsername = (e) => {
    setUsername(e.target.value);
    if (
      /^(?=.*[^\s])(?=.*[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]{3,}$/.test(
        e.target.value
      )
    ) {
      setUsernameValid(true);
    } else {
      setUsernameValid(false);
    }
  };
  const handleEmail = (e) => {
    if (
      /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)+$/.test(
        e.target.value
      )
    ) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    if (/^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(e.target.value)) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
    setPassword(e.target.value);
  };
  const handleChanges = async (e) => {
    e.preventDefault();
    let changesMade = false;
    let responseUsername;
    let responseEmail;
    let responsePicture;
    let responsePassword;
    if (user.username !== username && usernameValid) {
      responseUsername = await fetch(
        `http://localhost:8080/auth/changeUsername`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Tkn_bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id, newUsername: username }),
        }
      );
      const responseUsernameJson = await responseUsername.json();
      if (responseUsername.status === 200) {
        changesMade = true;
        dispatch(setLogin({ user: responseUsernameJson, token: token }));
      } else {
        setChangesError(true);
      }
    }
    if (user.email !== email && isEmailValid) {
      responseEmail = await fetch(`http://localhost:8080/auth/changeEmail`, {
        method: "PATCH",
        headers: {
          Authorization: `Tkn_bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, newEmail: email }),
      });
      const responseEmailJson = await responseEmail.json();
      if (responseEmail.status === 200) {
        changesMade = true;
        dispatch(setLogin({ user: responseEmailJson, token: token }));
      } else {
        setChangesError(true);
      }
    }
    if (password && isPasswordValid) {
      console.log("load here");
      responsePassword = await fetch(
        `http://localhost:8080/auth/changePassword`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Tkn_bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user._id,
            oldPassword: oldPassword,
            newPassword: password,
          }),
        }
      );
      const responsePasswordJson = await responsePassword.json();
      if (responsePassword.status === 200) {
        changesMade = true;
        dispatch(setLogin({ user: responsePasswordJson, token: token }));
        setPassword("");
      } else {
        setNotPassword(true);
      }
    }
    if (picture) {
      const formData = new FormData();
      formData.append("picture", picture);
      formData.append("userId", user._id);
      responsePicture = await fetch(
        `http://localhost:8080/auth/changeProfilePicture`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Tkn_bearer ${token}`,
          },
          body: formData,
        }
      );
      const responsePictureJson = await responsePicture.json();
      if (responsePicture.status === 200) {
        changesMade = true;
        dispatch(setLogin({ user: responsePictureJson, token: token }));
      } else {
        setChangesError(true);
      }
    }
    if (changesMade) {
      const allResponses200 = [
        responseUsername,
        responseEmail,
        responsePicture,
        responsePassword,
      ].some((response) => response && response.status === 200);
      if (allResponses200) {
        setConfirmedChanges(true);
      } else {
        if (!password) {
          setChangesError(true);
        }
      }
    }
  };
  const handleDeleteUser = async () => {
    const response = await fetch(`http://localhost:8080/auth/UserDelete`, {
      method: "DELETE",
      headers: {
        Authorization: `Tkn_bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user._id }),
    });
    
    if (response.status === 200) {
      dispatch(setLogout());
      navigate("/");
    } else {
      console.log(response.status);
    }
  };
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
            Settings
          </Typography>
        </Box>

        <form onSubmit={(e) => handleChanges(e)}>
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
            {changesError && (
              <Alert severity="error">
                There was an error processing your request, don't worry, this is
                a server-side error.
              </Alert>
            )}
            {notPassword && (
              <Alert severity="error">
                The password you entered for your account is wrong, check again.
              </Alert>
            )}
            {confirmedChanges && (
              <Alert severity="success">Changes saved successfully</Alert>
            )}
            {!usernameValid && (
              <Alert severity="error">
                Username is invalid, you need at least three characters, and not
                full of whitespace.
              </Alert>
            )}
            <TextField
              label="Change Username: "
              value={username}
              onChange={(e) => handleUsername(e)}
              sx={{ gridColumn: "span 2" }}
            ></TextField>
            <TextField
              label="Change Email: "
              value={email}
              onChange={(e) => {
                handleEmail(e);
              }}
              sx={{ gridColumn: "span 2" }}
              color={isEmailValid ? "primary" : "error"}
            ></TextField>
            {!isPasswordValid && (
              <Alert severity="error">
                Your password is not Complete - Make sure to include an
                uppercase letter, a number, and a symbol. Minimum length: 8
              </Alert>
            )}
            <TextField
              type="password"
              label="Current Password:"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
              sx={{ gridColumn: "span 2" }}
            ></TextField>

            <TextField
              type="password"
              label="New Password:"
              value={password}
              onChange={(e) => {
                handlePasswordChange(e);
              }}
              sx={{ gridColumn: "span 2" }}
            ></TextField>

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
            <Box width="100%" textAlign="center" gridColumn="span 2">
              <Button
                fullWidth
                margin="auto auto"
                type="submit"
                variant="fill"
                padding="1rem"
                sx={{
                  backgroundColor: palette.primary.main,
                  maxWidth: "300px",
                }}
                onClick={(e) => {
                  handleChanges(e);
                }}
              >
                SAVE CHANGES
              </Button>
            </Box>
            <Button
              onClick={() => setDeleteOpen(true)}
              sx={{
                backgroundColor: "indianred",
                color: "#FFF",
                borderRadius: "5px",
                padding: "5px 10px",
                marginTop: "2rem",
                marginBottom: "2rem",
                "&:hover" : {
                  color: "#000",
                  border: "2px solid indianred"
                }
              }}
            >
              <Warning /> &nbsp; &nbsp;{" "}
              <Typography>Delete this account</Typography>
            </Button>
          </Box>
        </form>

        <Dialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Confirm
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button onClick={() => handleDeleteUser()} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Login;
