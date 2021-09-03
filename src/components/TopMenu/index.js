import React, { useEffect, useState } from "react";
import { Container, MenuContainer, NavLogo, MenuBtn } from "./TopMenuElements";
import { Button } from "../../values/ButtonElements";
import { useHistory } from "react-router";



function TopMenu(props) {
  const [scrollNav, setScrollNav] = useState(false);
  const history = useHistory();

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
    window.sessionStorage.removeItem("loggedInAccount");
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
        <MenuBtn>
          {
            window.sessionStorage.getItem("loggedInAccount") ? <Button primary={true} big={false} fontBig={false} to="/" onClick={handleLogOut}> Log Out</Button> :
          <Button primary={true} big={false} fontBig={false} onClick={handleClick}>{window.location.pathname === "/login" ? "Sign Up" : "Log In"}</Button>
          }
        </MenuBtn>
      </MenuContainer>
    </Container>
  );
};

export default TopMenu;
