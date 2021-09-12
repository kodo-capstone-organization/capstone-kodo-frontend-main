import React from 'react'
import {
    InfoCard,
    Title,
    Container,
    TextBox,
    MenuBtn
} from "./HomepageElements";
import { Button } from "../../values/ButtonElements";
import img from "../../assets/Homepage/img.png";

function HomePage(props: any) {
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
                <div style={{display: "flex", marginTop:"100px"}}>
                    <img src={img} alt="people" style={{height: "350px"}}/>
                    <MenuBtn>
                        <Title>Start Your Coding<br /> Journey with Kodo</Title>
                        <Button primary big fontBig to="/signup">Sign Up</Button>
                    </MenuBtn>
                </div>

                <br />
                <TextBox primary>
                    <Title>Why Kodo?</Title>
                    <h3>
                        Kodo boasts a catalogue of computing-related courses to specifically address market shifts towards a digital world.
                    </h3>
                </TextBox>
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
