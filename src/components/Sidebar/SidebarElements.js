import styled from "styled-components";
import { colours } from "../../values/Colours";
import { Link } from "react-router-dom";
//import SearchIcon from '@material-ui/icons/Search';
//import TrackChangesIcon from '@material-ui/icons/TrackChanges';

export const SidebarContainer = styled.aside`
  display: flex;
  position: fixed;
  width: 300px;
  margin-top: 80px;
  margin-left: 300px;
  background: #000;
  padding: 30px 0px;
`;

export const SidebarWrapper = styled.div`
  width: 240px;
  height: 100%;
  margin-top: 80px;
  margin-left: 300px;
  border-right: 1px solid ${colours.GRAY6};
  border-left: 1px solid ${colours.GRAY6};
  background: ${colours.WHITE};
  position: fixed;
`;

export const SidebarMenu = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(6, 75px);
  text-align: center;
  margin-left: -40px;
`;

export const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 18px;
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
