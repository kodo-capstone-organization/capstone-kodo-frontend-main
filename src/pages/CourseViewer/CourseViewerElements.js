import styled from "styled-components";
import {colours} from "../../values/Colours";
import {fontSizes} from "../../values/FontSizes";


export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: ${colours.WHITE};
`
export const MessageContainer = styled.div`
  display: ${({ isEnrolled, isTutor}) =>
  isEnrolled || isTutor ? "flex" : "none"};
  margin: 3rem;
  align-items: center;
  justify-content: center;
`

export const Message = styled.h1`
  display: ${({ isEnrolled, isTutor}) =>
  isEnrolled || isTutor ? "flex" : "none"};
  color: ${colours.BLUE1}
`

export const BtnWrapper = styled.div`
  display: ${({ isEnrolled, isTutor}) =>
  isEnrolled || isTutor ? "flex" : "none"};
  align-items: center;
  justify-content: center;
  align-self: center
  width: 150px;
`