import React from 'react'
import { useState } from "react";
import { Navigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CopyRight from './CopyRight';

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const SignUp = (props) => {
  const [newUser, setUser] = useState(0);

    const [inpError, setError] = useState(0);
  const [RegisterDisabled, setRegisterDisabled] = useState(1);
  const [uniqueUserErr, setUniqueUserErr] = useState(false);
  

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
    // console.log(checkRegister,e.target.value);
    setRegisterDisabled(!(checkRegister && e.target.value.length > 0));
    // console.log(RegisterDisabled);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (RegisterDisabled) return;
    await fetch(`http://localhost:7000/api/auth/register`, {
      method: "POST",
      crossDomain: true,
      body: JSON.stringify(RegisterData),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "Username already exists!!") {
          setUniqueUserErr(true);
        } else {
          setUser(0); // correct input
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
            {uniqueUserErr ? (
              <p style={{ color: "red" }}>username already exists!</p>
            ) : null}
            <Box
              component="form"
              noValidate
              onSubmit={handleRegister}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    required
                    fullWidth
                    id="fname"
                    label="First Name"
                    onChange={handleRegisterChange}
                    value={RegisterData.fname}
                    type="text"
                    name="fname"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lname"
                    label="Last Name"
                    onChange={handleRegisterChange}
                    value={RegisterData.lname}
                    type="text"
                    name="lname"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="User Name"
                    onChange={handleRegisterChange}
                    value={RegisterData.username}
                    type="text"
                    name="username"
                    autoComplete="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="emailid"
                    label="Email Id"
                    onChange={handleRegisterChange}
                    value={RegisterData.emailid}
                    type="email"
                    name="emailid"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="age"
                    label="Age"
                    onChange={handleRegisterChange}
                    value={RegisterData.age}
                    type="number"
                    name="age"
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="phno"
                    label="Phone Number"
                    onChange={handleRegisterChange}
                    value={RegisterData.phno}
                    type="tel"
                    name="phno"
                    autoComplete="tel"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    id="password"
                    onChange={handleRegisterChange}
                    value={RegisterData.password}
                    type="password"
                    name="password"
                    autoComplete="new-password"
                  />
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
              <Button
                type="submit"
                disabled={RegisterDisabled}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    href="/signin"
                    variant="body2"
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <CopyRight sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default SignUp
