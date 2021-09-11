import styled from "styled-components";
import { colours } from "../../../values/Colours";
import { Link } from "react-router-dom";
import { fontSizes } from "../../../values/FontSizes";


export const SidebarWrapper = styled.div`
  width: 240px;
  height: 100%;
  background: ${colours.GRAY7};
  position: relative;
  margin-left: -10.4rem;
  padding-left: 2rem;
`;

export const SidebarMenu = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(10, 75px);
  text-align: center;
  justify-content: center;
  padding-top: 20px;
`;

export const CourseBannerWrapper = styled.div`
  padding-top: 28px;
  padding-left: 2.4rem;
  height: 100px;
  width: 100%;
`;

export const CourseBanner = styled.img`
    height: 100px;
    width: 100%
    border-radius: 50%;

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

export const SidebarLink = styled(Link)`
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


