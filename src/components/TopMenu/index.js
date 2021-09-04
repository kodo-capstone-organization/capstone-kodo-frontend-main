import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, MenuContainer, NavLogo, MenuBtn } from "./TopMenuElements";
import { Button } from "../../values/ButtonElements";
import { useHistory } from "react-router";

// import IconButton from '@material-ui/core/IconButton';
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import MenuItem from '@material-ui/core/MenuItem';
// import Menu from '@material-ui/core/Menu';



function TopMenu(props) {
  const [scrollNav, setScrollNav] = useState(false);
  const [isNotLoginPage, setIsNotLoginPage] = useState(null);
  const history = useHistory();

  useEffect(() => {
    setIsNotLoginPage(history.location.pathname !== "/login");
  }, [history.location.pathname])

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    window.sessionStorage.removeItem("loggedInAccountId");
    window.sessionStorage.removeItem("loggedInAccountUsername");
    window.sessionStorage.removeItem("loggedInAccountPassword");
  };

  const handleClick = () => {
    if(window.location.pathname === "/login"){
      history.push("/signup")
    }else {
      history.push("login")
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
  }, []);
  return (
    <Container scrollNav={scrollNav}>
      <MenuContainer>
        <NavLogo to="/">kodo</NavLogo>
<<<<<<< HEAD
        {
          isNotLoginPage &&
          <MenuBtn>
            {
              window.sessionStorage.getItem("loggedInAccountId") ?
                  <Button primary={false} big={false} fontBig={false} to="/login" onClick={handleLogOut}> Log Out</Button>
                  : <Button primary={true} big={false} fontBig={false} to="/login" > Log In</Button>
            }
          </MenuBtn>
        }
=======
        <MenuBtn>
          {
            window.sessionStorage.getItem("loggedInAccountId") ? <Button primary={true} big={false} fontBig={false} to="/" onClick={handleLogOut}> Log Out</Button> :
          <Button primary={true} big={false} fontBig={false} onClick={handleClick}>{window.location.pathname === "/login" ? "Sign Up" : "Log In"}</Button>
          }
        </MenuBtn>
>>>>>>> feature/auth
      </MenuContainer>
    </Container>
  );
};

export default TopMenu;
