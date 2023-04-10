import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
const ProfilePicture = ({ size, picturePath, target=null, username}) => {
  const navigate = useNavigate();
  return (
    <Box width={size} height={size} onClick={ target ? () => (navigate(target), navigate(0)) : undefined}>
      
      <img
        style={{ objectFit: "cover", borderRadius: "50%",  cursor: "pointer"}}
        width={size}
        height={size}
        alt="User"
        src={picturePath}
        title={username}
      />
    </Box>
  );
};

export default ProfilePicture;
