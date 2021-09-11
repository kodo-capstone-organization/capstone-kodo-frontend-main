import styled from "styled-components";
import { colours } from "../../values/Colours";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import {fontSizes} from "../../values/FontSizes";

export const SidebarWrapper = styled.div`
  width: 240px;
  height: 100%;
  margin-top: 8px;
  border-right: 1px solid ${colours.GRAY6};
  background: ${colours.WHITE};
  position: fixed;
`;

export const SidebarMenu = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(6, 75px);
  text-align: center;
`;

export const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${fontSizes.SUBTEXT};
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
  padding-right: 8px;

`;

export const TrackChanges = styled(TrackChangesIcon)`
  padding-right: 8px;

`;

export const PersonOutline = styled(PersonOutlineIcon)`
  padding-right: 8px;

`;

export const CallSplit = styled(CallSplitIcon)`
  padding-right: 8px;
`;


export const SidebarItems = [
    {
        route: "/browsecourse",
        label: "Browse Courses",
        icon: () => <Search />
    },
    {
        route: "/progresspage",
        label: "My Progress",
        icon: () => <TrackChanges />
    },
    {
        route: "/profile",
        label: "My Profile",
        icon: () => <PersonOutline />
    },
    {
        route: "/session",
        label: "Sessions",
        icon: () => <CallSplit />
    },
]