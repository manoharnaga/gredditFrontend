import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CollectionsIcon from "@mui/icons-material/Collections";
import LogoutIcon from "@mui/icons-material/Logout";
import ModeIcon from "@mui/icons-material/Mode";
import SaveIcon from '@mui/icons-material/Save';

const pages = [
  "home",
  "profile",
  "editprofile",
  "mysubgreddits",
  "akasubgreddits",
  "savedpost",
];

const settings = ["profile", "ediprofile", "Logout"];

const Navbar = (props) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  let navigate = useNavigate();

  if (props.Loginval === "false") {
    return <Navigate to="/signin" />;
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (path) => {
    if (path !== "menuPhone") {
      if (path === "home") {
        navigate("/");
      } else {
        navigate(`/${path}`);
      }
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            GREDDIIT
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu("menuPhone")}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography textAlign="center">
                    {page[0].toLocaleUpperCase() + page.slice(1, page?.length)}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Greddiit
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              startIcon={<HomeIcon style={{ fontSize: "1.75rem" }} />}
              onClick={() => handleCloseNavMenu("home")}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                fontSize: "0.8rem",
              }}
            >
              Home
            </Button>
            <Button
              startIcon={<PersonIcon style={{ fontSize: "1.75rem" }} />}
              onClick={() => handleCloseNavMenu("profile")}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                fontSize: "0.8rem",
              }}
            >
              Profile
            </Button>
            <Button
              startIcon={<ModeIcon style={{ fontSize: "1.75rem" }} />}
              onClick={() => handleCloseNavMenu("editprofile")}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                fontSize: "0.8rem",
              }}
            >
              EditProfile
            </Button>
            <Button
              startIcon={<InsertPhotoIcon style={{ fontSize: "1.75rem" }} />}
              onClick={() => handleCloseNavMenu("mysubgreddits")}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                fontSize: "0.8rem",
              }}
            >
              MySubgreddits
            </Button>
            <Button
              startIcon={<CollectionsIcon style={{ fontSize: "1.75rem" }} />}
              onClick={() => handleCloseNavMenu("akasubgreddits")}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                fontSize: "0.8rem",
              }}
            >
              Subgreddits
            </Button>
            <Button
              startIcon={<SaveIcon style={{ fontSize: "1.75rem" }} />}
              onClick={() => handleCloseNavMenu("savedpost")}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                fontSize: "0.8rem",
              }}
            >
              Saved Posts
            </Button>
            <Button
              startIcon={
                <LogoutIcon color="action" style={{ fontSize: "1.75rem" }} />
              }
              onClick={(event) => {
                event.preventDefault();
                localStorage.removeItem("token");
                props.Loginfunc("false");
              }}
              sx={{
                my: 2,
                color: "black",
                display: "block",
                fontSize: "0.8rem",
              }}
            >
              Log out
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
