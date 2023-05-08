import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import LoginReg from "./LoginReg";
// import Navbar from "./Navbar";
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
    const loginDatafunc = () => {
      const usernameSaved = JSON.parse(localStorage.getItem("username"));
      // const passwordSaved = JSON.parse(localStorage.getItem("password"));
      return { username: usernameSaved || "" };
    };

    let loginData = loginDatafunc();
    const userObj = async () => {
      console.log("Page loaded/refreshed");
      console.log("logindata from localStorage", loginData);
      await fetch(`http://localhost:7000/api/auth/loginstore`, {
        method: "POST",
        crossDomain: true,
        body: JSON.stringify(loginData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status === "Login successful!") {
            const userdata = data.user;
            setLogin("true");
            setUserData(userdata);
          } else {
            console.log("Unable to fetch User Data! - App.jsx");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    if (JSON.parse(localStorage.getItem("login-key")) === "true") {
      userObj();
    }
  }, []);

  return (
    <div>
      {/* <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/editprofile">EditProfile</Link>
          </li>
          <li>
            <Link to="/mysubgreddits">My Sub Greddiits</Link>
          </li>
          <li>
            <Link to="/akasubgreddits">AkaSubGreddiits</Link>
          </li>
          <li>
            <Link to="/savedpost">SavedPosts</Link>
          </li>
        </ul>
      </nav> */}
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              Loginval={isLoggedin}
              Loginfunc={setLogin}
              userData={userData}
              setUserData={setUserData}
            />
          }
        />
        <Route
          exact
          path="/login"
          element={
            <LoginReg
              Loginval={isLoggedin}
              Loginfunc={setLogin}
              userData={userData}
              setUserData={setUserData}
            />
          }
        />
        <Route
          exact
          path="/profile"
          element={
            <Profile
              Loginval={isLoggedin}
              Loginfunc={setLogin}
              userData={userData}
              setUserData={setUserData}
            />
          }
        />
        <Route
          exact
          path="/editprofile"
          element={
            <EditProfile
              Loginval={isLoggedin}
              Loginfunc={setLogin}
              userData={userData}
              setUserData={setUserData}
            />
          }
        />
        <Route
          exact
          path="/mysubgreddits"
          element={
            <MySubGreddits
              Loginval={isLoggedin}
              Loginfunc={setLogin}
              userData={userData}
              setUserData={setUserData}
            />
          }
        />
        <Route
          path="/mysubgreddits/:id"
          element={
            <SubGredditMod
              Loginval={isLoggedin}
              Loginfunc={setLogin}
              userData={userData}
              setUserData={setUserData}
            />
          }
        />
        <Route
          exact
          path="/akasubgreddits"
          element={
            <AkaSubGreddit
              Loginval={isLoggedin}
              Loginfunc={setLogin}
              userData={userData}
              setUserData={setUserData}
            />
          }
        />
        <Route
          exact
          path="/akasubgreddits/:id"
          element={
            <Post
              Loginval={isLoggedin}
              Loginfunc={setLogin}
              userData={userData}
              setUserData={setUserData}
            />
          }
        />
        <Route
          exact
          path="/savedpost"
          element={
            <SavedPost
              Loginval={isLoggedin}
              Loginfunc={setLogin}
              userData={userData}
              setUserData={setUserData}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
