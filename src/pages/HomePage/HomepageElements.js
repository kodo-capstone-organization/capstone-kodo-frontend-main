import styled from "styled-components";
import { colours } from "../../values/Colours";

export const MenuBtn = styled.nav`
	display: flex;
  align-items: center;
  flex-direction: column;
`;

export const FlexBox = styled.div`
	display: flex;
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
