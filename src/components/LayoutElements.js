import styled from "styled-components";
import {colours} from "../values/Colours";

export const LayoutContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 10rem;
  background: ${colours.WHITE};
  /* Account for Topbar's height */
  margin-top: 50px; 
`;

export const LayoutContentPage = styled.div`
  height: 100%;
  width: 100%;
  /* Conditionally account for for Sidebar's fixed width */
  margin-left: ${({showSideBar}) => (showSideBar ? "240px" : "") } 
`;