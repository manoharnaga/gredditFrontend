import React, { useEffect } from "react";
import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
//   border: "2px solid #000",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};
const AltSignUp = () => {
  const [uniqueUserErr, setUniqueUserErr] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const [RegisterData, setRegisterData] = useState({
    fname: "",
    lname: "",
    username: "",
    emailid: "",
    age: "",
    phno: "",
    password: "",
    followers: [],
    following: [],
  });

  useEffect(() => {
    const getAllUsernames = async () => {
      await fetch(`http://localhost:7000/api/auth/getallusernames`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Error in fetching data");
          }
          return res.json();
        })
        .then((data) => {
            console.log(data.usernames);
          setAllUsers(data.usernames);
        })
        .catch((error) => console.error("Error:", error));
    };

    getAllUsernames();   
  }, []);

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...RegisterData,
      [e.target.name]: e.target.value,
    });
    for (let i = 0; i < allUsers.length; i++) {
        if (e.target.value === allUsers[i]) {
          setUniqueUserErr("Username already exists!!");
          return;
        }
    }
    setUniqueUserErr("");
  };

  const handleAltRegister = async () => {
    if(!(RegisterData?.username?.length > 0)){
        setUniqueUserErr("Username cannot be empty!");
        return;
    }
    for (let i = 0; i < allUsers.length; i++) {
      if (RegisterData?.username === allUsers[i]) {
        alert("Username already exists!");
        return;
      }
    }

    if (!(RegisterData?.username?.length > 0)) return;
    const searchParams = new URLSearchParams(window.location.search);
    const encodedData = searchParams.get("data");
    const decodedData = JSON.parse(decodeURIComponent(encodedData));
    const userinfo = decodedData.userinfo;
    const altType = decodedData.altType;
    // console.log(userinfo, altType);
    let altRegisterData = RegisterData;
    if (altType === "google") {
        altRegisterData.emailid = userinfo;
    } else if (altType === "phno") {
      altRegisterData.phno = userinfo;
    } else if (altType === "facebook") {
      // RegisterData.emailid = userinfo;
    }
    await fetch(`http://localhost:7000/api/auth/altregister`, {
      method: "POST",
      body: JSON.stringify(altRegisterData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "All Fields are required!!") {
          alert("empty fields - username,emailid,phno are required");
          window.location.href = "/signup";
        }
        else if(data.status === "Error submitting new AltUserRegistration!"){
          alert("Error in registering user");
          window.location.href = "/signup";
        } else {
          alert("User Registered Successfully!");
          window.location.href = "/signin";
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <Modal open={true} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <TextField autoFocus required fullWidth id="username" label="username" onChange={handleRegisterChange} value={RegisterData.username} type="text" name="username" autoComplete="username" error={Boolean(uniqueUserErr)} helperText={uniqueUserErr} />
          <Button sx={{mt:2}} variant="contained" onClick={()=> {
            handleAltRegister();
          }} fullWidth>Submit</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AltSignUp;
