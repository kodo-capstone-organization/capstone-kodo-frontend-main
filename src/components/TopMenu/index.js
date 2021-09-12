import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, MenuContainer, NavLogo, MenuBtn } from "./TopMenuElements";
import { Button } from "../../values/ButtonElements";

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
  
  const handleLogOut = () => {
    window.sessionStorage.removeItem("loggedInAccountId");
    window.sessionStorage.removeItem("loggedInAccountUsername");
    window.sessionStorage.removeItem("loggedInAccountPassword");
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
  }, []);
  return (
    <Container scrollNav={scrollNav}>
      <MenuContainer>
        <NavLogo to="/">kodo</NavLogo>
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
      </MenuContainer>
    </Container>
  );
};

export default TopMenu;
