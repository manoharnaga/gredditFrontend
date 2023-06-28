import { useState } from "react";

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import CopyRight from "./CopyRight";
import app from "./firebase-config";

import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, getAdditionalUserInfo, signOut, signInWithRedirect, getRedirectResult } from "firebase/auth";

const auth = getAuth(app);
const Gprovider = new GoogleAuthProvider();
const Fprovider = new FacebookAuthProvider();

Gprovider.setCustomParameters({
  login_hint: "user@gmail.com",
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: "25px",
  boxShadow: 24,
  p: 10,
};

const checkRegexMobile = (mobile) => {
  mobile = mobile.slice(-10);
  const regex = /^[6-9]\d{9}$/;
  // console.log(mobile);
  return regex.test(mobile);
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// const signInWithFacebook = (handleClickSnack2) => {
//   const auth = getAuth();
//   signInWithPopup(auth, Fprovider)
//     .then((result) => {
//       // The signed-in user info.
//       const user = result.user;
//       console.log(user);
//       handleClickSnack2();
//       // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//       // const credential = FacebookAuthProvider.credentialFromResult(result);
//       // const accessToken = credential.accessToken;
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//       const credential = FacebookAuthProvider.credentialFromError(error);
//     });
// };

const AltSignIn = (props) => {
  const [userData, setUserData] = useState({
    phno: " +91 ",
    otpVal: "",
  });

  const [otpHidden, setOtpHidden] = useState(true);
  const [buttonsHidden, setButtonsHidden] = useState(false);
  const [errorPhone, setErrorPhone] = useState("");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setErrorPhone("");
    setUserData({
      phno: " +91 ",
      otpVal: "",
    });
  };

  const [openSnack1, setOpenSnack1] = React.useState(false);
  const [openSnack2, setOpenSnack2] = React.useState(false);

  const handleClickSnack1 = () => {
    setOpenSnack1(true);
  };

  const handleCloseSnack1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack1(false);
  };

  const handleClickSnack2 = () => {
    setOpenSnack2(true);
  };

  const handleCloseSnack2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack2(false);
  };

  const handleSignInChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const altSignin = async (userinfo,altType) => {
    await fetch(`http://localhost:7000/api/auth/altlogin`, {
      method: "POST",
      body: JSON.stringify({userinfo, altType}),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Invalid Signin Request!!");
        }
        return res.json();
      })
      .then((data) => {
        const token = data.token;
        localStorage.setItem("token", JSON.stringify(token));
        props.setUserData(data.user);
        props.Loginfunc("true");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const signInWithGoogle = (handleClickSnack2) => {
    const auth = getAuth();
    signInWithPopup(auth, Gprovider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        handleClickSnack2();
        const signFlag = props.signFlag;
        if (!signFlag) {
          const encodedData = encodeURIComponent(JSON.stringify({ userinfo: user.email, altType: "google"}));
          window.location.href = `/altsignupusername?data=${encodedData}`;
        } else {
          altSignin(user.email,"google");
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };


  const reCaptchaVerify = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "normal",
        callback: (response) => {
          phoneNumberVerify();
        },
        "expired-callback": () => {
          alert("Please solve the Captcha Again");
        },
      },
      auth
    );
  };

  const phoneNumberVerify = () => {
    reCaptchaVerify();
    const phoneNumber = userData.phno;
    // console.log(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        setOtpHidden(false);
        handleClickSnack1();
        // ...
      })
      .catch((error) => {
        console.log("Error: SMS not sent");
      });
  };

  const otpVerify = () => {
    const code = userData.otpVal;
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        const signFlag = props.signFlag;
        // handleClickSnack2();
        if (!signFlag) {
          const encodedData = encodeURIComponent(JSON.stringify({ userinfo: user.phoneNumber, altType: "phno"}));
          window.location.href = `/altsignupusername?data=${encodedData}`;
        } else {
          altSignin(user.phno,"phno");
        }
      })
      .catch((error) => {
        alert("Wrong OTP!,please Try again");
        // User couldn't sign in (bad verification code?)
        // ...
      });
  };

  


  return (
    <div>
      <div>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button variant="outlined" size="large" sx={{ mt: 1, mb: 1.5 }} onClick={handleOpen} startIcon={<PhoneIcon />} fullWidth>
              {props.signFlag ? "Sign in":"Sign up"} with Phone
            </Button>

            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box sx={style}>
                <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                  <IconButton onClick={handleClose}>
                    <CloseIcon sx={{ fontSize: "2rem", fontWeight: "300" }} />
                  </IconButton>
                </Box>
                <Typography textAlign={"center"} variant="h6" color="primary">
                {props.signFlag ? "Sign in":"Sign up"} with Phone No.
                </Typography>
                <Typography textAlign={"center"} hidden={otpHidden}>
                  One-time password Has been sent
                </Typography>
                <Typography textAlign={"center"} hidden={otpHidden} sx={{ fontWeight: "bold" }}>
                  {userData.phno}
                </Typography>
                <TextField margin="normal" id="phno" label="Phone Number" type="text" value={userData.phno} onChange={handleSignInChange} name="phno" autoFocus fullWidth error={Boolean(errorPhone)} helperText={errorPhone} required />
                <TextField margin="normal" label="*****" id="otpVal" type="password" value={userData.otpVal} onChange={handleSignInChange} name="otpVal" hidden={otpHidden} autoFocus fullWidth />
                <Button
                  type="button"
                  variant="contained"
                  size="large"
                  sx={{ mt: 0, mb: 5 }}
                  hidden={!otpHidden}
                  onClick={() => {
                    const inputPhno = userData.phno;
                    const test = checkRegexMobile(inputPhno);
                    // console.log(test);
                    if (test) {
                      setErrorPhone("");
                      setButtonsHidden(true);
                      phoneNumberVerify();
                    } else {
                      setErrorPhone("Please Enter Valid Phone Number");
                    }
                  }}
                  fullWidth
                >
                  SEND OTP
                </Button>
                <div id="recaptcha-container" hidden={!otpHidden}></div>
                <Button
                  type="button"
                  variant="contained"
                  size="large"
                  sx={{ mt: 1, mb: 0.5 }}
                  hidden={otpHidden}
                  onClick={() => {
                    otpVerify();
                  }}
                  fullWidth
                >
                  Verify OTP
                </Button>
              </Box>
            </Modal>
            <Button
              type="button"
              variant="contained"
              size="large"
              sx={{ mt: 0, mb: 1 }}
              onClick={() => {
                signInWithGoogle(handleClickSnack2, props.signFlag, props.setUniqueUserErr);
              }}
              hidden={buttonsHidden}
              fullWidth
              startIcon={<GoogleIcon />}
            >
              {props.signFlag ? "Sign in":"Sign up"} With Google
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{
                "&:hover": { backgroundColor: "#FB4A7B" },
                mt: 0,
                mb: 2.5,
                color: "#fff",
                backgroundColor: "#EA255B",
              }}
              onClick={() => {
                // signInWithFacebook(handleClickSnack2, props.signFlag);
              }}
              hidden={buttonsHidden}
              fullWidth
              startIcon={<FacebookIcon />}
            >
              {props.signFlag ? "Sign in":"Sign up"} With Facebook
            </Button>
            <CopyRight />
          </Box>
        </Container>

        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={openSnack1} autoHideDuration={6000} onClose={handleCloseSnack1}>
            <Alert onClose={handleCloseSnack1} severity="success">
              Success: OTP sent!
            </Alert>
          </Snackbar>

          <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={openSnack2} autoHideDuration={6000} onClose={handleCloseSnack2}>
            <Alert onClose={handleCloseSnack2} severity="success">
              Login Successfull!
            </Alert>
          </Snackbar>
        </Stack>

      </div>
    </div>
  );
};

export default AltSignIn;
