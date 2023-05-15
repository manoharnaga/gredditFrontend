import { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import CircularProgress from "@mui/material/CircularProgress";
import Navbar from "./Navbar";

import app from "./firebase-config";
import {ref, uploadString, getDownloadURL,getStorage} from "firebase/storage";
const storage = getStorage(app);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = (props) => {
  const [display, setDisplay] = useState({
    Follower: "none",
    Following: "none",
  });
  // const [EditProfile,setEditProfile] = useState("");
  const [profilepic, setProfilepic] = useState(props.userData.profilepic);
  const [changedProfilepic, setChangedProfilepic] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let location = useLocation();
  let navigate = useNavigate();

  const [open, setOpen] = useState(() => {
    let flag = location?.state?.editprofile === "successfull";
    location.state = {};
    // console.log(flag);
    return flag;
  });

  if (props.Loginval === "false") {
    return <Navigate to="/signin" />;
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const removeFollow = async (username, followerUsername, flagFollow) => {
    await fetch(`http://localhost:7000/api/profile/followers`, {
      method: "PUT",
      body: JSON.stringify({
        username: username,
        followerUsername: followerUsername,
        flagFollow: flagFollow,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.userData.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Invalid request!");
        }
        return res.json();
      })
      .then((data) => {
        const userdata = data.firstResponse;
        props.setUserData(userdata);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleProfiePicChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      // reader onload event is triggered when the reader is done reading the file
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 270;
          const maxHeight = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const base64Image = canvas.toDataURL(file.type);
          setFileName(file.name);
          setChangedProfilepic(true);
          setProfilepic(base64Image);
        };
      };
      reader.onerror = (error) => {
        console.log("Error: ", error);
      };
    } else{
      alert("Error in uploading image");
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if(profilepic.length <= 0){
      alert("NO image selected!");
      return;
    }

    setIsLoading(true);
    const base64Image = profilepic.split(",")[1];
    const imgRef = ref(storage, `images/${fileName}`);

    const snapshot = await uploadString(imgRef, base64Image, "base64");

    const imgUrl = await getDownloadURL(snapshot.ref);

    await fetch(`http://localhost:7000/api/profile/uploadimage`, {
      method: "PUT",
      body: JSON.stringify({
        imgUrl: imgUrl,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.userData.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const userdata = data.user;
        if (data.status === "Updated Profilepic successfully!") {
          setIsLoading(false);
          setProfilepic(userdata.profilepic);
          props.setUserData(userdata);
        } else {
          alert("Can't fetch ImageURL!");
        }
        setChangedProfilepic(false);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <Navbar Loginval={props.Loginval} Loginfunc={props.Loginfunc} userData={props.userData} setUserData={props.setUserData} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <TableContainer style={{ overflow: "auto" }} component={Paper} className="container">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={2}>
                {isLoading && <CircularProgress size="5.2rem" sx={{position:"relative",top:30,left:110,zIndex:2}}/>}
                {isLoading && <img src={profilepic} alt="profilepic" style={{ width: "150px", height: "150px", borderRadius: "50%", filter: "blur(2px)" }} />}
                {!isLoading && <img src={profilepic} alt="profilepic" style={{ width: "150px", height: "150px", borderRadius: "50%" }} />}
                <Button type="input" sx={{ position: "relative", top: 70, right: 45 }}>
                <label htmlFor="image-upload" className="upload-label">
                <EditTwoToneIcon sx={{ fontSize: "1.7rem" }} />
            </label>
                  <input type="file" id="image-upload" name="image" onChange={handleProfiePicChange} hidden={true}/>
                </Button>
                <Button hidden={!changedProfilepic} variant="contained" sx={{backgroundColor:"#3E6417","&:hover": { backgroundColor: "#253E0B" },}} onClick={handleImageUpload}>Update Profile Pic</Button>
                <Button hidden={!changedProfilepic} onClick={()=>{
                  setChangedProfilepic(false);
                  setProfilepic(props.userData.profilepic);
                  setIsLoading(false);
                }}>Cancel</Button>
              </TableCell> 
            </TableRow>

            <TableRow>
              <TableCell align="left" colSpan={2}>
                <Typography variant="h3" color="#072F4A" gutterBottom>
                  Helo @{props.userData.username}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {Object.keys(props.userData).map((key) => (
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }} key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{props.userData[key]}</TableCell>
              </TableRow>
            ))} */}
            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>First Name</TableCell>
              <TableCell>{props.userData.fname}</TableCell>
            </TableRow>

            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>Last Name:</TableCell>
              <TableCell>{props.userData.lname}</TableCell>
            </TableRow>

            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>User Name:</TableCell>
              <TableCell>{props.userData.username}</TableCell>
            </TableRow>

            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>Email id:</TableCell>
              <TableCell>{props.userData.emailid}</TableCell>
            </TableRow>

            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>Age:</TableCell>
              <TableCell>{props.userData.age}</TableCell>
            </TableRow>

            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>Phone No:</TableCell>
              <TableCell>{props.userData.phno}</TableCell>
            </TableRow>

            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell colSpan={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<EditIcon />}
                  onClick={() => {
                    // setEditProfile("openEditProfilePage");
                    navigate("/editprofile");
                  }}
                >
                  Edit Profile
                </Button>
              </TableCell>
            </TableRow>

            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>
                <Button
                  //   color={display?.Following==="none" && 'secondary'}
                  onClick={() => {
                    setDisplay({ Follower: "", Following: "none" });
                  }}
                >
                  Followers {props.userData.followers?.length}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  //   color={display?.Follower==="none" && 'secondary'}
                  onClick={() => {
                    setDisplay({ Follower: "none", Following: "" });
                  }}
                >
                  Following {props.userData.following?.length}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} className="container" style={{ display: display.Follower }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {props.userData.followers?.map((follower, index) => (
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }} key={index}>
                <TableCell align="center">{follower}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                      removeFollow(props.userData.username, follower, 1);
                    }}
                    style={{ backgroundColor: "#656768" }}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell align="center" colSpan={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setDisplay({ Follower: "none", Following: "none" });
                  }}
                  color="action"
                >
                  close
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} className="container" style={{ display: display.Following }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {props.userData.following?.map((following, index) => (
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }} key={index}>
                <TableCell align="center">{following}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                      removeFollow(props.userData.username, following, 2);
                    }}
                    style={{ backgroundColor: "#656768" }}
                  >
                    Unfollow
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell align="center" colSpan={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setDisplay({ Follower: "none", Following: "none" });
                  }}
                  color="action"
                >
                  close
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
            Profile Edited Successfully!
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
};

export default Profile;
