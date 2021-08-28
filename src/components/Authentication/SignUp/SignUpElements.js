import styled from "styled-components";
import { colours } from "../../../values/Colours";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import { colors } from "@material-ui/core";

export const MenuBtn = styled.nav`
	display: flex;
  align-items: center;
  flex-direction: column;
`;

export const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  
`;

export const InfoCard = styled.div`
  background: ${({ primary }) => (primary ? colours.BLUE1 : colours.WHITE)};
  color: ${props => props.primary ? colours.WHITE : colours.BLUE1};
  border: 2px solid ${colours.BLUE1};
  border-radius: 25px;
  width: 500px;
  height: 500px;
  padding: 0px 100px 0px 100px;
  text-align: center;
  justify-content: center;
  font-family: "Roboto", sans-serif;
`;

export const Input = styled.input.attrs(props => ({
  type: "text",
  size: props.size || "1em",
}))`
  color: ${colours.GRAY1};
  font-size: 1em;
  border: 2px solid ${colours.GRAY1};
  border-radius: 3px;

  /* here we use the dynamically computed prop */
  margin: ${props => props.size};
  padding: ${props => props.size};
`;

export const Title = styled.h1`
  font-size: 2.0em;
  text-align: center;
  color: ${colours.BLUE1};
  font-family: "Roboto", sans-serif;
`;

export const TextBox = styled.h5`
  text-align: center;
  color: ${props => props.primary ? colours.BLUE1 : colours.WHITE};
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
