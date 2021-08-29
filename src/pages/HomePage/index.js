import React from 'react'
import {
    InfoCard,
    Title,
    Container,
    TextBox,
    MenuBtn
} from "./HomepageElements";
import { Button } from "../../values/ButtonElements";

function HomePage(props) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "700px",
                width: "700px",
                color: "#000000",
                background: "white",
                margin: "0 auto",
            }}
        >
            <div style={{
                display: "flex",
                flexDirection: "column",
            }}
            >
                <MenuBtn>
                    <Title>Start Your Coding <br/> Journey with Kodo</Title>
                    <Button primary={true} big={true} fontBig={true} to="/signup">Sign Up</Button>
                </MenuBtn>
                <br/>
                <Title>What is Kodo?</Title>
                <TextBox primary={true}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.</TextBox>
                <Container>
                    <InfoCard primary>
                        <h2><b>Computing-centric</b></h2>
                        <h5> Kodo specialises in providing Computing courses and
                        appropriate tools for them such as collaborative whiteboards,
                            code editors and compiling environments</h5>
                    </InfoCard>
                    <InfoCard primary>
                        <h2>Collaborative</h2>
                        <h5> Here at Kodo, we believe in the power of collaboration amongst
                        fellow coders. Access collaborative tools like, real-time shared
                        whiteboards, code editors and voice-calls to learn in real-time your
                            peers or instructors.</h5>
                    </InfoCard>
                    <InfoCard primary>
                        <h2>Curated</h2>
                        <h5> Sieving through mountains of courses online is a hassle.
                            Learn hassle-free with our curated suggestions for your learning.</h5>
                    </InfoCard>
                </Container>
            </div>
        </div>
    )
}

export default HomePage
