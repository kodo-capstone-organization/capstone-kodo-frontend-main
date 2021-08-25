import React, { useEffect, useState } from "react";
import { Container, MenuContainer, NavLogo, MenuBtn } from "./TopMenuElements";
import { Button } from "../../values/ButtonElements";

const TopMenu = () => {
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
  return (
    <Container scrollNav={scrollNav}>
      <MenuContainer>
          <NavLogo to="/">kodo</NavLogo>
          <MenuBtn>
            <Button primary={true} to="/login">Log In</Button>
          </MenuBtn>
      </MenuContainer>
    </Container>
  );
};

export default TopMenu;
