import MonacoEditor, { monaco } from 'react-monaco-editor';
import { FormControl, InputLabel, Menu, MenuItem, Select, Typography } from "@material-ui/core";
import { useState } from "react";
import { CodeEditorPanelWrapper, EditorTopBarGrid } from "./StageTabPanelsElements";

// Monaco settings
const options = {
    selectOnLineNumbers: true,
    fontSize: 20
}

function CodeEditorTabPanel (props: any) {

    const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
    const [isEditorLoading, setIsEditorLoading] = useState<boolean>(true);
    const [editorCode, setEditorCode] = useState<string>("");

    const handleLanguageChange = (event: any) => {
        setSelectedLanguage(event?.target?.value as string);
        // TODO send dc message to everyone that language is changed
    };

    const editorDidMount = () => {
        // TODO any pre-setup
        setIsEditorLoading(false);
    }

    const onCodeChange = (newCodeValue: string, event: monaco.editor.IModelContentChangedEvent) => {
        // TODO fire datachannel message
        setEditorCode(newCodeValue)
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
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                        <MenuItem value="javascript">Javascript</MenuItem>
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