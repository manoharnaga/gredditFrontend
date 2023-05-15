import React from "react";
import { useState,useEffect } from "react";
import { Navigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CopyRight from "./CopyRight";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import AltSignIn from "./SignInAlt";

const theme = createTheme();

const usernameRegex = /\s/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phnoRegex = /^[0-9]{10}$/;
const age = /^(?:100|[1-9][0-9]?|[1-9])$/;

const SignUp = (props) => {
  // const [newUser, setUser] = useState(0);

  const [inpError, setError] = useState(0);
  const [RegisterDisabled, setRegisterDisabled] = useState(1);
  const [usernameErr, setUsernameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [phnoErr, setPhnoErr] = useState("");
  const [ageErr, setAgeErr] = useState("");
  const [allUsernames, setAllUsernames] = useState([]);
  const [allEmails, setAllEmails] = useState([]);
  
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
          setAllUsernames(data.usernames);
          setAllEmails(data.emails);
        })
        .catch((error) => console.error("Error:", error));
    };

    getAllUsernames();   
  }, []);

  if (props.Loginval === "true") {
    // already logged in!
    console.log("Home" + inpError);
    return <Navigate to="/" />;
  }
  // Register functions
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...RegisterData,
      [e.target.name]: e.target.value,
    });

    let checkRegister = 1;
    for (const key in RegisterData) {
      if (key !== e.target.name && key !== "followers" && key !== "following") {
        checkRegister = checkRegister && RegisterData[key].length > 0;
        // console.log(RegisterData[key]);
      }
    }
    if(e.target.value.length === 0){
      setUsernameErr("");
      setEmailErr("");
      setPhnoErr("");
      setAgeErr("");
      return;
    }

    if (e.target.name === "username") {
      if(usernameRegex.test(e.target.value)){
        setUsernameErr("Username cannot contain spaces");
        return;
      }
      setUsernameErr("");
    }
    if (e.target.name === "emailid") {
      if(!emailRegex.test(e.target.value)){
        setEmailErr("Invalid Email");
        return;
      } 
      setEmailErr("");
    }
    if (e.target.name === "phno") {
      if(!phnoRegex.test(e.target.value)){
        setPhnoErr("Invalid Phone Number");
        return;
      } 
      setPhnoErr("");
    }
    if (e.target.name === "age") {
      if(!age.test(e.target.value)){
        setAgeErr("Invalid Age");
        return;
      }
      setAgeErr("");
    }
    
    for (let i = 0; i < allUsernames.length; i++) {
      if (e.target.value === allUsernames[i] && e.target.name === "username") {
        setUsernameErr("Username already exists!!");
        return;
      }
      if (e.target.value === allEmails[i] && e.target.name === "emailid") {
        setEmailErr("Email already exists!!");
        return;
      }
  }
  setUsernameErr("");
  setEmailErr("");
    setRegisterDisabled(!(checkRegister && e.target.value.length > 0));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (RegisterDisabled) return;
    await fetch(`http://localhost:7000/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(RegisterData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "Error submitting new UserRegistration!") {
          alert("Error submitting new UserRegistration!");
          window.location.href = "/signup";
        } else {
          alert("Registration Successful!");
          window.location.href = "/signin";
        }
      })
      .catch((error) => console.error("Error:", error));
  };
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            {/* {uniqueUserErr ? <p style={{ color: "red" }}>username already exists!</p> : null} */}
            <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField autoComplete="given-name" required fullWidth id="fname" label="First Name" onChange={handleRegisterChange} value={RegisterData.fname} type="text" name="fname" autoFocus />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth id="lname" label="Last Name" onChange={handleRegisterChange} value={RegisterData.lname} type="text" name="lname" autoComplete="family-name" />
                </Grid>
                <Grid item xs={12}>
                  <TextField required fullWidth id="username" label="User Name" onChange={handleRegisterChange} value={RegisterData.username} type="text" name="username" autoComplete="username" error={Boolean(usernameErr)} helperText={usernameErr}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField required fullWidth id="emailid" label="Email Id" onChange={handleRegisterChange} value={RegisterData.emailid} type="email" name="emailid" autoComplete="email" error={Boolean(emailErr)} helperText={emailErr}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField required fullWidth id="age" label="Age" onChange={handleRegisterChange} value={RegisterData.age} type="text" name="age" autoComplete="off" error={Boolean(ageErr)} helperText={ageErr}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField required fullWidth id="phno" label="Phone Number" onChange={handleRegisterChange} value={RegisterData.phno} type="text" name="phno" autoComplete="tel" error={Boolean(phnoErr)} helperText={phnoErr}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField required fullWidth label="Password" id="password" onChange={handleRegisterChange} value={RegisterData.password} type="password" name="password" autoComplete="new-password" />
                </Grid>
                {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid> */}
              </Grid>
              <Button type="submit" disabled={RegisterDisabled} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/signin" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <CopyRight sx={{ mt: 5 }} />
        </Container>
        <AltSignIn signFlag={0} />
      </ThemeProvider>
    </div>
  );
};

export default SignUp;
