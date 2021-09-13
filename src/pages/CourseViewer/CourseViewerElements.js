import styled from "styled-components";
import {colours} from "../../values/Colours";

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: ${colours.WHITE};
`
export const MessageContainer = styled.div`
  display: ${({ isEnrolled, isTutor}) =>
  isEnrolled || isTutor ? "none" : "flex"};
  margin: 3rem;
  align-items: center;
  justify-content: center;
`

export const Message = styled.h1`
  display: ${({ isEnrolled, isTutor}) =>
  isEnrolled || isTutor ? "none" : "flex"};
  color: ${colours.BLUE1}
`

export const BtnWrapper = styled.div`
  display: ${({ isEnrolled, isTutor}) =>
  isEnrolled || isTutor ? "none" : "flex"};
  align-items: center;
  justify-content: center;
  align-self: center
  width: 150px;
`