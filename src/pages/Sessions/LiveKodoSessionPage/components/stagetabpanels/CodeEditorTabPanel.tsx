import MonacoEditor, { monaco } from 'react-monaco-editor';
import { FormControl, InputLabel, Menu, MenuItem, Select, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";
import { CodeEditorPanelWrapper, EditorTopBarGrid } from "./StageTabPanelsElements";

// Monaco settings
const options = {
    selectOnLineNumbers: true,
    fontSize: 20,
}

function CodeEditorTabPanel (props: any) {

    const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");
    const [isEditorLoading, setIsEditorLoading] = useState<boolean>(true);
    const [editorCode, setEditorCode] = useState<string>("");

    useEffect(() => {
        setEditorCode(props.incomingEditorData)
    }, [props.incomingEditorData])

    useEffect(() => {
        if (props.incomingSelectedLanguage) {
            setSelectedLanguage(props.incomingSelectedLanguage)
        }
    }, [props.incomingSelectedLanguage])

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

    return (
        <CodeEditorPanelWrapper>
            <EditorTopBarGrid container>
                <Typography variant="h6">
                    Placeholder Code File Name
                </Typography>
                <FormControl variant="outlined" margin="dense" color="primary" style={{ minWidth: "120px"}}>
                    <InputLabel id="select-language-label">Language</InputLabel>
                    <Select
                        labelId="select-language-label"
                        id="select-language"
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        label="Language"
                    >
                        <MenuItem value="javascript">Javascript</MenuItem>
                        <MenuItem value="typescript">Typescript</MenuItem>
                        <MenuItem value="html">HTML</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                    </Select>
                </FormControl>
            </EditorTopBarGrid>
            <MonacoEditor
                language={selectedLanguage}
                theme="vs-light"
                value={editorCode}
                options={options}
                onChange={onCodeChange}
                editorDidMount={editorDidMount}
            />
        </CodeEditorPanelWrapper>
    )
}

export default CodeEditorTabPanel;