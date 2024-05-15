import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Home from "./Home";
import Profile from "./Profile";
import MySubGreddits from "./MySubgreddits";
import SubGredditMod from "./SubgredditMod";
import AkaSubGreddit from "./AkaSubgreddiit";
import Post from "./Post";

import * as React from "react";
// import { Toolbar } from "@mui/material";
import SavedPost from "./SavedPost";
import EditProfile from "./EditProfile";
import AltSignUp from "./SignUpAlt";

const App = () => {
  const [isLoggedin, setLogin] = useState(() => {
    const initialValue = JSON.parse(localStorage.getItem("login-key"));
    return initialValue || "";
  });
  const [userData, setUserData] = useState(0);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // storing input name
    localStorage.setItem("login-key", JSON.stringify(isLoggedin));
  }, [isLoggedin]);
  
  useEffect(() => {
    // function to be called on page load/refresh
    const userObj = async () => {
      console.log("Page loaded/refreshed");

      const tokenLocal = localStorage.getItem("token");
      // alert(tokenLocal);
      // if (!tokenLocal) {
      //   alert("No token found!");
      // }
      // else{
        setToken(tokenLocal);
      // }

      await fetch(`http://localhost:7000/api/auth/loginstore`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${tokenLocal}`,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            if(res.status === 401){
              // alert("hfsda");
              // logout
              localStorage.removeItem("token");
              localStorage.removeItem("login-key");
              localStorage.removeItem("profilepic");
              // alert("app.jsx");
              // setLogin("true");
              // logout from google also check flag for how does he login - #TODO
            }
            else{
              throw new Error("Invalid token!");
            }
          }
          return res.json();
        })
        .then((data) => {
          const userdata = data.user;
          // localStorage.setItem("token", data.token);
          localStorage.setItem("profilepic", userdata.profilepic);
          setUserData(userdata);
          setLogin("true");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    userObj();
  }, []);

  return (
    <div>
      <Routes>
        <Route exact path="/signin" element={<SignIn token={token} Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/altsignupusername" element={<AltSignUp token={token} Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/signup" element={<SignUp token={token} Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/" element={<Home token={token} Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/profile" element={<Profile token={token} Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/editprofile" element={<EditProfile token={token} Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/mysubgreddits" element={<MySubGreddits token={token}  Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route path="/mysubgreddits/:id" element={<SubGredditMod token={token} Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/akasubgreddits" element={<AkaSubGreddit Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/akasubgreddits/:id" element={<Post token={token} Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/savedpost" element={<SavedPost token={token} Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
      </Routes>
    </div>
  );
};

export default App;
