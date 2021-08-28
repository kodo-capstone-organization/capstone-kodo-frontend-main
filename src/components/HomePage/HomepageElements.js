import styled from "styled-components";
import { colours } from "../../values/Colours";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import { colors } from "@material-ui/core";

export const Button = styled.button`
  background: ${props => props.primary ? colours.BLUE1 : colours.WHITE};
  color: ${props => props.primary ? colours.WHITE : colours.BLUE1};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid ${colours.BLUE1};
  border-radius: 3px;
`;

export const InfoCard = styled.div`
  background: ${({ primary }) => (primary ? colours.BLUE1 : colours.GRAY7)};
  color: ${props => props.primary ? colours.WHITE : colours.BLUE1};
  border: 2px solid ${colours.BLUE1};
  padding: 10px;
  margin: 10px;
  border-radius: 25px;
  width: 250px;
  height: 200px;
  text-align: center;
  font-family: "Roboto", sans-serif;
`;

export const Title = styled.h1`
  font-size: 2.0em;
  text-align: center;
  color: ${colours.BLUE1};
  font-family: "Roboto", sans-serif;
`;

export const Container = styled.div`
	display: flex;
	justify-content: space-between;
	height: 80px;
	z-index: 1;
	width: 100%;
	padding: 0 24px;
	max-width: 1100px;
`;

export const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
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

export const Search = styled(SearchIcon)`
  color: ${colours.GRAY5};
  padding-right: 8px;

`;

export const TrackChanges = styled(TrackChangesIcon)`
  color: ${colours.GRAY5};
  padding-right: 8px;

`;

export const PersonOutline = styled(PersonOutlineIcon)`
  color: ${colours.GRAY5};
  padding-right: 8px;

`;

export const CallSplit = styled(CallSplitIcon)`
  color: ${colours.GRAY5};
  padding-right: 8px;

  &.active {
    color: ${colours.BLUE1};
 }
  &:hover {
    color: ${colours.BLUE1};
  }
`;
