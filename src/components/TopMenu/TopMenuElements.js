import styled from "styled-components";
import { Link as LinkR } from "react-router-dom";
import { colours } from "../../values/Colours";
//import { AccountCircleIcon } from '@material-ui/icons/AccountCircle';

export const Container = styled.nav`
	display: flex;
    background: ${({ scrollNav }) => (scrollNav ? colours.GRAY7 : colours.WHITE )};
    height: 50px;
	top: 0;
    border-bottom: 1px solid ${colours.BLUE1};=
	position: sticky;
`;

export const MenuContainer = styled.div`
	display: flex;
	justify-content: space-between;
	height: 100%;
	width: 100%;
	padding: 0 15rem;
`;

// export const NavLogo = styled(LinkR)`
//     display: flex;
//     justify-content: center;
//     align-self: center;
// 	cursor: pointer;
// 	font-size: 32px;
// 	align-items: center;
// 	font-weight: bold;
//     text-decoration: none;
//     margin-left: 500px;
// 	color: ${({ scrollNav }) => (scrollNav ? colours.GRAY1 : colours.BLUE1)};

// 	&.active {
// 		color: ${colours.BLUE1};
// 	}

// 	&:hover {
// 		color: ${colours.BLUE1};
// 	}
// `;

export const NavLogo = styled(LinkR)`
    display: flex;
	cursor: pointer;
	font-size: 32px;
	font-weight: bold;
	text-decoration: none;
	justify-content: center;
	align-self: center;
	margin: 0 auto;
	color: ${({ scrollNav }) => (scrollNav ? colours.GRAY1 : colours.BLUE1)};
`;

export const MenuBtn = styled.nav`
	display: flex;
	align-items: center;
	margin-left: 0
`;


