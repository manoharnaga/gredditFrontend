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
  
  useEffect(() => {
    // storing input name
    localStorage.setItem("login-key", JSON.stringify(isLoggedin));
  }, [isLoggedin]);

  useEffect(() => {
    // function to be called on page load/refresh
    const userObj = async () => {
      console.log("Page loaded/refreshed");
      let token = null;
      try {
        token = JSON.parse(localStorage.getItem("token"));
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }

      await fetch(`http://localhost:7000/api/auth/loginstore`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Invalid token!");
          }
          return res.json();
        })
        .then((data) => {
          const userdata = data.user;
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
        <Route exact path="/signin" element={<SignIn Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/altsignupusername" element={<AltSignUp Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/signup" element={<SignUp Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/" element={<Home Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/profile" element={<Profile Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/editprofile" element={<EditProfile Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/mysubgreddits" element={<MySubGreddits Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route path="/mysubgreddits/:id" element={<SubGredditMod Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/akasubgreddits" element={<AkaSubGreddit Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/akasubgreddits/:id" element={<Post Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
        <Route exact path="/savedpost" element={<SavedPost Loginval={isLoggedin} Loginfunc={setLogin} userData={userData} setUserData={setUserData} />} />
      </Routes>
    </div>
  );
};

export default App;
