import {Grid, Menu, MenuItem } from "@material-ui/core";
import { useState } from "react";
import { CodeEditorPanelWrapper, LanguageSelectorButton } from "./StageTabPanelsElements";

function CodeEditorTabPanel (props: any) {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("Python");

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (language: string) => {
        setSelectedLanguage(language);
        // TODO send dc message to everyone that language is changed
        setAnchorEl(null);
    };

    return (
        <CodeEditorPanelWrapper>
            <Grid container style={{ justifyContent: "flex-end", padding: "0.5rem" }}>
                <LanguageSelectorButton
                    aria-controls="language-menu"
                    variant="extended"
                    size="medium"
                    color="primary"
                    aria-label="select-language"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    {selectedLanguage}
                </LanguageSelectorButton>
                <Menu
                    id="language-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => handleClose("Python")}>Python</MenuItem>
                    <MenuItem onClick={() => handleClose("Java")}>Java</MenuItem>
                    <MenuItem onClick={() => handleClose("Javascript")}>Javascript</MenuItem>
                </Menu>
            </Grid>
        </CodeEditorPanelWrapper>
    )
}

export default CodeEditorTabPanel;