import { useState } from "react";
import { Navigate } from "react-router-dom";

import * as React from "react";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";

import AltSignIn from "./SignInAlt";

const theme = createTheme();

const SignIn = (props) => {
  // const [newUser, setUser] = useState(0);
  const [inpError, setError] = useState(false);
  const [LoginDisabled, setLoginDisabled] = useState(1);

  const [loginData, setLogindata] = useState({
    username: "",
    password: "",
  });

  if (props.Loginval === "true") {
    // already logged in!
    console.log("Home" + inpError);
    return <Navigate to="/" />;
  }

  // Login functions
  const handleLoginChange = (e) => {
    setLogindata({
      ...loginData,
      [e.target.name]: e.target.value,
    });

    let checkLogin = true;
    for (const key in loginData) {
      if (key !== e.target.name) {
        checkLogin = checkLogin && loginData[key].length > 0;
      }
    }
    setLoginDisabled(!(checkLogin && e.target.value.length > 0));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (LoginDisabled === 1) return;
    await fetch(`http://localhost:7000/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          setError(true);
          throw new Error("Invalid Username/Password!!");
        }
        return res.json();
      })
      .then((data) => {
        const token = data.user.token;
        localStorage.setItem("token", JSON.stringify(token));
        props.setUserData(data.user);
        props.Loginfunc("true");
      })
      .catch((error) => {
        setError(true);
        console.error("Error:", error);
      });
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
            <h3
              style={{
                textAlign: "center",
                color: "#000",
                fontFamily: "-moz-initial",
                fontSize: "2.7rem",
                fontWeight: "bolder",
              }}
            >
              Gred
            </h3>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {inpError ? (
              <p style={{ color: "red" }}>Invalid Username/Password!!</p>
            ) : null}
            <Box
              component="form"
              onSubmit={handleLogin}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="username"
                type="text"
                value={loginData.username}
                onChange={handleLoginChange}
                name="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="password"
                type="password"
                id="password"
                value={loginData.password}
                onChange={handleLoginChange}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={LoginDisabled}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
        <AltSignIn signFlag={1} setUserData={props.setUserData} Loginfunc={props.Loginfunc}/>
      </ThemeProvider>
    </div>
  );
};

export default SignIn;
