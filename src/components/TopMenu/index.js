import React, { useEffect, useState } from "react";
import { Container, MenuContainer, NavLogo, MenuBtn } from "./TopMenuElements";
import { Button} from "../../values/ButtonElements";

function TopMenu(props) {
  const [scrollNav, setScrollNav] = useState(false);

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
  }, []);

  const isLoggedIn = props.pathname;
  if (isLoggedIn !== "/login") {
    return (
      <Container scrollNav={scrollNav}>
        <MenuContainer>
          <NavLogo to="/">kodo</NavLogo>
          <MenuBtn>
            <Button
                primary={true}
                big={true}
                fontBig={true}
                to="/login"
            >
                Log In
            </Button>
          </MenuBtn>
        </MenuContainer>
      </Container>
    );
  } else if (isLoggedIn === "/login") {
    return (
      <Container scrollNav={scrollNav}>
        <MenuContainer>
          <NavLogo to="/">kodo</NavLogo>
          <MenuBtn>
            <Button primary={true} big={false} fontBig={true} to="/signup">Sign Up</Button>
          </MenuBtn>
        </MenuContainer>
      </Container>
    );
  }
};

export default TopMenu;
