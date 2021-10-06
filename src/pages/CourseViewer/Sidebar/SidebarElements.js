import styled from "styled-components";
import { colours } from "../../../values/Colours";
import { fontSizes } from "../../../values/FontSizes";
import { Link } from "react-router-dom";

import ForumIcon from '@material-ui/icons/Forum';
import HomeIcon from '@material-ui/icons/Home';

export const SidebarWrapper = styled.div`
  min-width: 240px;
  height: 100vh;
  background: ${colours.GRAY7};
  position: fixed;
  padding: 1px 0;
`;

export const SidebarMenu = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(10, 70px);
  text-align: center;
  justify-content: center;
`;

export const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${fontSizes.ITEM};
  text-decoration: none;
  list-style: none;
  transition: 0.2s ease-in-out;
  color: ${colours.GRAY5};
  cursor: pointer;
  padding: 2rem;


  &.active {
    color: ${colours.BLUE1};
  }
  &:hover {
    color: ${colours.BLUE1};
    transition: 0.2s ease-in-out;
  }
`;


export const CourseBanner = styled.img`
    height: 100px;
    width: 100%;
    filter: brightness(0.8);
`;

export const LessonLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 20px;
  text-decoration: none;
  list-style: none;
  transition: 0.2s ease-in-out;
  color: ${colours.GRAY5};
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  padding-left: 20px;


  &.active {
    color: ${colours.BLUE1};
    background: ${colours.GRAY7};
  }
  &:hover {
    color: ${colours.BLUE1};
    background: ${colours.GRAY7};
    transition: 0.2s ease-in-out;
  }
`;

export const Home = styled(HomeIcon)`
  padding-right: 8px;
`;

export const Forum = styled(ForumIcon)`
  padding-right: 8px;
`;