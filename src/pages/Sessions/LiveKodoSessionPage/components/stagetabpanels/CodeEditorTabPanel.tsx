import MonacoEditor, { monaco } from 'react-monaco-editor';
import { FormControl, IconButton, InputLabel, Menu, MenuItem, Select, Tooltip, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";
import { CodeEditorPanelWrapper, EditorTopBarGrid } from "./StageTabPanelsElements";
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

// Monaco settings
const options = {
    selectOnLineNumbers: true,
    fontSize: 20,
}

const THEMES = ["vs-light", "vs-dark"]

const LANGUAGES = ["javascript", "typescript", "html", "python", "java"]

function CodeEditorTabPanel (props: any) {

    const [selectedTheme, setSelectedTheme] = useState<string>("vs-light")
    const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");
    const [isEditorLoading, setIsEditorLoading] = useState<boolean>(true);
    const [editorCode, setEditorCode] = useState<string>("");

    useEffect(() => {
        if (props.incomingEditorData) {
            window.sessionStorage.setItem("editorData", props.incomingEditorData);
        }
        if (window.sessionStorage.getItem("editorData")) {
            //@ts-ignore
            setEditorCode(window.sessionStorage.getItem("editorData"))
        }
    }, [props.incomingEditorData])

    useEffect(() => {
        if (props.incomingSelectedLanguage) {
            window.sessionStorage.setItem("selectedLanguage", props.incomingSelectedLanguage);
        }
        if (window.sessionStorage.getItem("selectedLanguage")) {
            //@ts-ignore
            setSelectedLanguage(window.sessionStorage.getItem("selectedLanguage"))
        }
    }, [props.incomingSelectedLanguage])

    const handleThemeChange = (event: any) => {
        setSelectedTheme(event?.target?.value as string); // only change for myself
    };

    const handleLanguageChange = (event: any) => {
        setSelectedLanguage(event?.target?.value as string);
        // TODO send dc message to everyone that language is changed
        props.sendEditorEventViaDCCallback(undefined, event?.target?.value as string)
        window.sessionStorage.setItem("selectedLanguage", event?.target?.value as string);
    };

    const editorDidMount = () => {
        // TODO any pre-setup
        setIsEditorLoading(false);
    }

    const onCodeChange = (newCodeValue: string, event: monaco.editor.IModelContentChangedEvent) => {
        // TODO fire datachannel message
        setEditorCode(newCodeValue)
        props.sendEditorEventViaDCCallback(newCodeValue, undefined)
        window.sessionStorage.setItem("editorData", newCodeValue);
    }

    const capitalise = (word: string) => {
        return word[0].toUpperCase() + word.slice(1);
    }

    const getExtension = () => {
        switch(selectedLanguage) {
            case "javascript":
                return "js"
            case "typescript":
                return "ts"
            case "html":
                return "html"
            case "python":
                return "py"
            case "java":
                return "java"
            default:
                return "js"
        }
    }

    const getMimeType = () => {
        switch(selectedLanguage) {
            case "javascript":
                return "text/javascript"
            case "typescript":
                return "application/x-typescript"
            case "html":
                return "text/html"
            case "python":
                return "text/x-python"
            case "java":
                return "text/x-java" // TODO: Check
            default:
                return "text/javascript"
        }
    }

    const handleCodeEditorExport = () => {
        const ext = getExtension();
        const mimeType = getMimeType();
        const editorInputBlob =  new Blob([editorCode as BlobPart], {
            type: mimeType
        });
        const blobUrl = window.URL.createObjectURL(editorInputBlob);
        const tempAnchor = document.createElement('a');
        tempAnchor.href = blobUrl;
        tempAnchor.download = `Editor.${ext}`;
        tempAnchor.click();
    }

    return (
        <CodeEditorPanelWrapper>
            <EditorTopBarGrid container>
                {/*<Typography variant="h6">*/}
                {/*    Placeholder Code File Name*/}
                {/*</Typography>*/}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FormControl variant="outlined" margin="dense" color="primary" style={{ minWidth: "120px"}}>
                    <InputLabel id="select-theme-label">Theme</InputLabel>
                    <Select
                        labelId="select-theme-label"
                        id="select-theme"
                        value={selectedTheme}
                        onChange={handleThemeChange}
                        label="Theme"
                    >
                        { THEMES.map((theme: string) => (
                            <MenuItem value={theme}>{theme}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FormControl variant="outlined" margin="dense" color="primary" style={{ minWidth: "120px"}}>
                    <InputLabel id="select-language-label">Language</InputLabel>
                    <Select
                        labelId="select-language-label"
                        id="select-language"
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        label="Language"
                    >
                        { LANGUAGES.map((language: string) => (
                                <MenuItem key={language} value={language}>{capitalise(language)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Tooltip title="Export">
                    <IconButton onClick={handleCodeEditorExport} aria-label="export">
                        <SystemUpdateAltIcon />
                    </IconButton>
                </Tooltip>
            </EditorTopBarGrid>
            <MonacoEditor
                language={selectedLanguage}
                theme={selectedTheme}
                value={editorCode}
                options={options}
                onChange={onCodeChange}
                editorDidMount={editorDidMount}
            />
        </CodeEditorPanelWrapper>
    )
}

export default CodeEditorTabPanel;