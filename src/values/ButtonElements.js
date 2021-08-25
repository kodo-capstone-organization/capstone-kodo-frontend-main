import styled from "styled-components";
import { colours } from "./Colours";
import { Link as LinkR } from "react-router-dom";

export const Button = styled(LinkR)`
  border-radius: 10px;
  background: ${({ primary }) => (primary ? colours.BLUE1 : colours.GRAY7)};
  white-space: nowrap;
  padding: ${({ big }) => (big ? "14px 48px" : "12px 30px")};
  color: ${({ dark }) => (dark ? colours.GRAY2 : colours.WHITE)};
  text-decoration: none;
  font-size: ${({ fontBig }) => (fontBig ? "20px" : "1 6px")};
  font-family: 
  outline: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
  font-family: "Roboto", sans-serif;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: ${({ primary }) => (primary ? colours.BLUE2 : colours.WHITE)};
    color: ${({ dark }) => (dark ? colours.GRAY2 : colours.WHITE )};


  }
`;