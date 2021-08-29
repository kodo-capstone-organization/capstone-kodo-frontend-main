import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "../../../values/ButtonElements";
import { InfoCard, Wrapper } from "./SignUpElements";
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import ButtonGroup from '@material-ui/core/ButtonGroup';

function SignUp({ isOpen, props }) {
    const [auth, setAuth] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btnTags, setBtnTags] = useState('');
    const [tags, setTags] = useState([]);
    // const [value, setValue] = useState('Controlled');

    const useStyles = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '50ch',
            },
        },
    }));

    const classes = useStyles();

    const handleChange = e => {
        setAuth(!auth);
        e.preventDefault();
    };

    const btnClick = e => {
        setBtnTags(e.target.value)
        console.log(`btn btntag`, e.target)
        // console.log(`btn email`, email)
    };

    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };

    return (
        <>
            <div isOpen={isOpen}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "700px",
                    marginTop: "50px",
                    color: "#000000",
                    background: "white",
                }}
            >
                <InfoCard>
                    <Wrapper>
                        <form className={classes.root} noValidate autoComplete="off">
                            <TextField id="filled-basic" label="username" label="Username" variant="filled" value={username} onChange={e  => setUsername(e.target.value)}/>
                            <TextField id="filled-basic" label="email" label="Email" variant="filled" value={email} onChange={e  => setEmail(e.target.value)}/>
                            <TextField id="filled-basic" label="password" label="Password" variant="filled" value={password} onChange={e  => setPassword(e.target.value)}/>
                            <br />
                            <label>Join Kodo as a</label>
                            <ButtonGroup value={btnTags}  variant="contained" primary aria-label="contained primary button group">
                                <Button primary value={'beginner'} onClick={handleChange}>Beginner</Button>
                                <Button primary value={'intermediate'}>Intermediate</Button>
                                <Button primary value={'expert'}>Expert</Button>
                            </ButtonGroup>
                            <br />
                            <label>What subjects are you interested in?</label>
                            <Input>
                                <Chip
                                    label="Deletable"
                                    onDelete={handleDelete}
                                />
                            </Input>
                            <Button>Sign Up</Button>
                        </form>
                    </Wrapper>
                </InfoCard>
                {/* <Button primary={true} onClick={handleChange}>{auth ? 'Logout' : 'Login'}</Button> */}
            </div>
        </>
    )
}

export default SignUp
