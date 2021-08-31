import styled from "styled-components";
import { colours } from "../../../values/Colours";
import { fontSizes} from "../../../values/FontSizes";
import Chip from '@material-ui/core/Chip';

export const MenuBtn = styled.nav`
	display: flex;
  align-items: center;
  flex-direction: column;
`;

export const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  
`;

export const Tag = styled(Chip)`
  color: ${colours.GRAY5};
  padding-right: 8px;

  &.active {
    color: ${colours.BLUE1};
 }
  &:hover {
    color: ${colours.BLUE1};
  }
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

export const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const Form = styled.form`
  margin: 0 auto;
  width: 100%;
  max-width: 414px;
  padding: 1.3rem;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Input = styled.input`
  max-width: 100%;
  padding: 11px 13px;
  background: #f9f9fa;
  color: ${colours.GRAY1};
  margin-bottom: 0.9rem;
  border-radius: 4px;
  outline: 0;
  border: 1px solid rgba(245, 245, 245, 0.7);
  font-size: ${fontSizes.SUBTEXT};
  transition: all 0.3s ease-out;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.1);
  :focus,
  :hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.15), 0 1px 5px rgba(0, 0, 0, 0.1);
  }
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
