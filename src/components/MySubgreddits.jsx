import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import * as React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PeopleIcon from "@mui/icons-material/People";
import Navbar from "./Navbar";

const MySubGreddits = (props) => {
  const [tags, setTags] = useState([]);
  const [bannedKeywords, setBannedKeywords] = useState([]);
  const [SubGredditDisabled, setSubGredditDisabled] = useState(true);
  const [SubGredditData, setSubGredditData] = useState({
    moderator: "",
    name: "",
    description: "",
    joined: [],
    requested: [],
    blocked: [],
    tags: [],
    bannedKeywords: [],
    post: [],
  });

  const [MySubGreddits, setMySubGreddits] = useState();
  const [newSubGreddit, setNewSubGreddit] = useState("none");

  let navigate = useNavigate();

  useEffect(() => {
    // function to be called on page load/refresh
    const SubgredditObj = () => {
      console.log("Page loaded/refreshed");
      fetch(`/api/mysubgreddits/data`, {
        method: "POST",
        crossDomain: true,
        body: JSON.stringify({
          moderator: JSON.parse(localStorage.getItem("username")),
          name: "none",
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status === "mysubgreddits sent") {
            const MySubgreddits = data.MySubgreddits;
            setMySubGreddits(MySubgreddits);
          } else {
            console.log(
              "Unable to fetch MySubgreddit Data! - MySubgreddit.jsx"
            );
          }
        })
        .catch((error) => console.error("Error:", error));
    };
    if (JSON.parse(localStorage.getItem("login-key")) === "true") {
      SubgredditObj();
    }
  }, []);

  if (props.Loginval === "false") {
    return <Navigate to="/login" />;
  }

  const addTags = (e) => {
    if (e.key === " " && e.target.value !== "") {
      // Single word && LowerCase
      // alert("Tags should be Single Word!"); // Handled directly as SPACE ADDS A NEW TAG
      if (/[A-Z]/.test(e.target.value.trim())) {
        alert("Please use Lowercase in Tags!");
      } else {
        setTags([...tags, e.target.value.trim()]);
      }
      e.target.value = "";
    }
  };

  const removeTags = (index) => {
    setTags([...tags.filter((tag) => tags.indexOf(tag) !== index)]);
  };

  const addBannedKeyword = (e) => {
    if (e.key === " " && e.target.value !== "") {
      // Single word - Handled directly as SPACE ADDS A NEW TAG
      // alert("BannedKeywords should be Single Word!");
      setBannedKeywords([...bannedKeywords, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const removeBannedKeyword = (index) => {
    setBannedKeywords([
      ...bannedKeywords.filter(
        (banned) => bannedKeywords.indexOf(banned) !== index
      ),
    ]);
  };

  const handleSubGredditChange = (e) => {
    setSubGredditData({
      ...SubGredditData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "name") {
      console.log(!(e.target.value.length > 0));
      setSubGredditDisabled(!(e.target.value.length > 0));
    }
  };

  const handleSubGreddit = (e) => {
    e.preventDefault();
    if (SubGredditDisabled) return;

    fetch(`/api/mysubgreddits/add`, {
      method: "POST",
      crossDomain: true,
      body: JSON.stringify({
        ...SubGredditData,
        moderator: props.userData.username,
        tags: tags,
        bannedKeywords: bannedKeywords,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setNewSubGreddit("none");
        window.location.reload(false);
      })
      .catch((error) => console.error("Error:", error));
  };

  const DeleteSubGreddit = (_id) => {
    fetch(`/api/mysubgreddits/delete/${_id}`, {
      method: "DELETE",
      crossDomain: true,
      // body: JSON.stringify({id:_id}),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.location.reload(false);
      })
      .catch((error) => console.error("Error:", error));
  };

  const OpenSubGreddit = (_id) => {
    // console.log("Mysubgreddit in New Page!",_id);
    // localStorage.setItem('modsubgredditId', _id);
    navigate(`/mysubgreddits/${_id}`);
  };

  const card = (
    name,
    description,
    postlength,
    joinedlength,
    _id,
    tags,
    bannedKeywords
  ) => {
    return (
      <React.Fragment>
        <CardContent>
          <Typography variant="h4" component="div">
            {name}
          </Typography>
          <Typography variant="body1">{description}</Typography>
          {tags.map((tag, index) => (
            <Typography
              style={{ color: "blue", fontWeight: "bold" }}
              key={index}
              variant="body2"
              display="inline"
            >
              #{tag} ,
            </Typography>
          ))}
          <br />
          {bannedKeywords.map((tag, index) => (
            <Typography
              style={{ color: "darkblue", fontWeight: "bold" }}
              key={index}
              variant="body2"
              display="inline"
            >
              #{tag} ,
            </Typography>
          ))}
        </CardContent>
        <CardActions>
          <IconButton aria-label="no. of posts">
            <PostAddIcon color="primary" />
            <Typography variant="body2">{postlength}</Typography>
          </IconButton>
          <IconButton aria-label="no. of people">
            <PeopleIcon color="primary" />
            <Typography variant="subtitle2">{joinedlength}</Typography>
          </IconButton>
          <Button size="small" onClick={() => DeleteSubGreddit(_id)}>
            DELETE
          </Button>
          <Button size="small" onClick={() => OpenSubGreddit(_id)}>
            OPEN
          </Button>
        </CardActions>
      </React.Fragment>
    );
  };

  return (
    <Box>
      <Navbar
        Loginval={props.Loginval}
        Loginfunc={props.Loginfunc}
        userData={props.userData}
        setUserData={props.setUserData}
      />
      <br />
      <br />
      <br />
      <br />

      <Button
        style={{ margin: "3% 40% 3% 40%" }}
        variant="contained"
        onClick={() => setNewSubGreddit("")}
      >
        Create SubGreddit
      </Button>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "100ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubGreddit}
        className="mysubgreddit-inputform"
        display={newSubGreddit}
      >
        <TextField
          id="outlined-basic"
          name="name"
          label="Enter the name..."
          onChange={handleSubGredditChange}
          variant="outlined"
        />
        <TextField
          id="outlined-basic"
          name="description"
          multiline
          rows={4}
          label="Describe..."
          onChange={handleSubGredditChange}
          variant="outlined"
        />

        <div className="tags-input">
          <ul id="tags">
            {tags.map((tag, index) => (
              <li key={index} className="tag">
                <span className="tag-title">{tag}</span>
                <span
                  className="tag-close-icon"
                  onClick={() => removeTags(index)}
                >
                  x
                </span>
              </li>
            ))}
          </ul>
          <input
            className="input-tags"
            type="text"
            onKeyDown={(e) => addTags(e)}
            placeholder="Press SPACE to add tags.."
          />
        </div>
        <div className="tags-input">
          <ul id="tags">
            {bannedKeywords.map((banned, index) => (
              <li key={index} className="tag">
                <span className="tag-title">{banned}</span>
                <span
                  className="tag-close-icon"
                  onClick={() => removeBannedKeyword(index)}
                >
                  x
                </span>
              </li>
            ))}
          </ul>
          <input
            className="input-tags"
            type="text"
            onKeyDown={(e) => addBannedKeyword(e)}
            placeholder="Press SPACE to add banned keywords.."
          />
        </div>
        <Box style={{ textAlign: "center" }}>
          <Button
            type="submit"
            variant="contained"
            disabled={SubGredditDisabled}
            style={{ width: "100%" }}
          >
            Submit
          </Button>
          <br />
          <Button
            onClick={() => setNewSubGreddit("none")}
            variant="contained"
            style={{ backgroundColor: "#656768", width: "100%" }}
          >
            Close
          </Button>
        </Box>
      </Box>
      {MySubGreddits?.map((subgreddit, index) => (
        <Box key={index} sx={{ minWidth: 275 }}>
          <Card variant="outlined">
            {card(
              subgreddit.name,
              subgreddit.description,
              subgreddit.post.length,
              subgreddit.joined.length,
              subgreddit._id,
              subgreddit.tags,
              subgreddit.bannedKeywords
            )}
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default MySubGreddits;
