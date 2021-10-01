import styled from "styled-components";
import {colours} from "../values/Colours";

export const LayoutContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background: ${colours.WHITE};
  /* Account for Topbar's height */
  margin-top: 50px; 
  padding: ${({showSidePadding}) => (showSidePadding ? "0 10rem" : "") } 
`;

export const LayoutContentPage = styled.div`
  height: 100%;
  width: 100%;
  /* Conditionally account for for Sidebar's fixed width */
  margin-left: ${({showSideBar}) => (showSideBar ? "240px" : "") } 
`;