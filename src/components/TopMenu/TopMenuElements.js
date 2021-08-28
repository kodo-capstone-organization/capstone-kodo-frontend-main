import styled from "styled-components";
import { Link as LinkR } from "react-router-dom";
import { colours } from "../../values/Colours";
//import { AccountCircleIcon } from '@material-ui/icons/AccountCircle';

export const Container = styled.nav`
    background: ${({ scrollNav }) => (scrollNav ? colours.GRAY7 : colours.WHITE )};
    height: 50px;
    margin-top: -80px;
	display: flex;
	justify-content: center;
	align-items: center;
    font-size: 1rem;
    border-bottom: 1px solid ${colours.BLUE1};
	top: 0;
	z-index: 10;
	position: sticky;
    font-family: "Roboto", sans-serif;

`;

export const MenuContainer = styled.div`
	display: flex;
	justify-content: space-between;
	height: 80px;
	z-index: 1;
	width: 100%;
	padding: 0 24px;
	max-width: 1100px;
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
	align-self: center;
	margin: 0 auto;
	color: ${({ scrollNav }) => (scrollNav ? colours.GRAY1 : colours.BLUE1)};

	&.active {
		color: ${colours.BLUE1};
	}

	&:hover {
		color: ${colours.BLUE1};
	}
`;

export const MenuBtn = styled.nav`
	display: flex;
	align-items: center;
`;

// export const MenuBtn = styled.nav`
// 	display: flex;
// 	position: absolute;
// 	align-items: center;
// `;


