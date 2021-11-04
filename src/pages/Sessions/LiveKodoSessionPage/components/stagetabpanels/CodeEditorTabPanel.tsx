import MonacoEditor, { monaco } from 'react-monaco-editor';
import { FormControl, IconButton, InputLabel, Dialog, MenuItem, Select, Tooltip, DialogTitle, DialogContent, DialogContentText, Input, DialogActions } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import { CodeEditorPanelWrapper, EditorTopBarGrid } from "./StageTabPanelsElements";
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import PublishIcon from '@material-ui/icons/Publish';
import GitHubIcon from '@material-ui/icons/GitHub';
import { 
    Theme, 
    createStyles, 
    makeStyles, 
  } from '@material-ui/core/styles';
import { EditorCursorLocation } from '../../../../../entities/Session';
import { ACCEPTABLE_PROGRAMMING_FILE_TYPE, isSupportedProgrammingFile } from '../../../../../utils/GetFileTypeHelper';
import { Button } from "../../../../../values/ButtonElements";
import Alert from '@material-ui/lab/Alert';
import { fetchGithubFile } from '../../../../../apis/SessionApis';

// Monaco settings
const options = {
    selectOnLineNumbers: true,
    fontSize: 20,
}

const THEMES = ["vs-light", "vs-dark"]

const LANGUAGES = ["javascript", "typescript", "html", "python", "java"]

interface IErrors<TValue> {
    [id: string]: TValue;
  }

function CodeEditorTabPanel (props: any) {

    const monacoObjects = useRef<any>(null);

    const [selectedTheme, setSelectedTheme] = useState<string>("vs-light")
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [isEditorLoading, setIsEditorLoading] = useState<boolean>(true);
    const [editorCode, setEditorCode] = useState<string>("");
    const [showGithubImportDialog, setShowGithubImportDialog] = useState<boolean>(false);
    const [githubUrl, setGithubUrl] = useState<string>(""); 
    const [validationErrorMessage, setValidationErrorMessage] = useState<string>("");
    var [errors, setErrors] = useState<IErrors<boolean>>({
        githuburl: false,
    });

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            maroon: {
                background: '#980000',
                width: '2px !important',
            },
            red: {
                background: '#ff0000',
                width: '2px !important',
            },
            orange: {
                background: '#ff9900',
                width: '2px !important',
            },
            yellow: {
                background: '#ffff00',
                width: '2px !important',
            },
            limegreen: {
                background: '#00ff00',
                width: '2px !important',
            },
            teal: {
                background: '#00ffff',
                width: '2px !important',
            },
            blue: {
                background: '#4a86e8',
                width: '2px !important',
            },
            darkblue: {
                background: '#0000ff',
                width: '2px !important',
            },
            purple: {
                background: '#9900ff',
                width: '2px !important',
            },
            pink: {
                background: '#ff00ff',
                width: '2px !important',
            },
            black: {
                background: '#000000',
                width: '2px !important'
            }
        }),
    );
    const classes = useStyles();

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

    const editorDidMount = (editor: any, monaco: any) => {
        try {
            monacoObjects.current = {
                editor,
                monaco
            };
            setIsEditorLoading(false);
        } catch {
            console.error("boohooo, editorDidMount cannot set ref")
        }  
    };

    function getColourStyleHelper(colour: string) {
        switch (colour) {
            case "#980000":
                return classes.maroon;
            case "#ff0000":
                return classes.red;
            case "#ff9900":
                return classes.orange;
            case "#ffff00":
                return classes.yellow;
            case "#00ff00":
                return classes.limegreen;
            case "#00ffff":
                return classes.teal;
            case "#4a86e8":
                return classes.blue;
            case "#0000ff":
                return classes.darkblue;
            case "#9900ff":
                return classes.purple;
            case "#ff00ff":
                return classes.pink;
            default:
                console.log("Invalid colour selection")
                return classes.black;
        }
    }

    useEffect(() => {
        if (!monacoObjects.current) return;

        const { monaco, editor } = monacoObjects.current;

        let newDeltaDecorations = new Array();
        props.incomingEditorCursorLocations.forEach((value: EditorCursorLocation, key: number) => {
            newDeltaDecorations.push({
                range: new monaco.Range(value.lineNumber, value.column, value.lineNumber, value.column),
                options: {
                    className: getColourStyleHelper(props.peerConns.get(key).colour)
                }
            })
        })

        editor.deltaDecorations([], newDeltaDecorations);
      }, [props.incomingEditorCursorLocations]);

    const onCodeChange = (newCodeValue: string, event: monaco.editor.IModelContentChangedEvent) => {
        // TODO fire datachannel message
        setEditorCode(newCodeValue)

        const { monaco, editor } = monacoObjects.current;

        const newEditorCursorLocation: EditorCursorLocation = {
            lineNumber: editor.getPosition().lineNumber,
            column: editor.getPosition().column
        }

        props.sendEditorEventViaDCCallback(newCodeValue, undefined, newEditorCursorLocation)
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

    const getSelectedLanguageByFileName = (fileName: string) => {
        const extension = fileName.split('.').pop();
        switch(extension) {
            case "js":
                return "javascript"
            case "ts":
                return "typescript"
            case "html":
                return "html"
            case "py":
                return "python"
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
    
    async function handleCodeEditorImport(event: any) {
        const file = event.target.files.item(0);
        if (file) {
            const fileText = await file.text();
            setEditorCode(fileText);
            props.sendEditorEventViaDCCallback(fileText, undefined)
            window.sessionStorage.setItem("editorData", fileText);

            const newSelectedLanguage = getSelectedLanguageByFileName(file.name)
            setSelectedLanguage(newSelectedLanguage)
            props.sendEditorEventViaDCCallback(undefined, newSelectedLanguage)
            window.sessionStorage.setItem("selectedLanguage", newSelectedLanguage);
        } 
    }

    const handleCloseGithubImportDialog = () => {
        setErrors({})
        setValidationErrorMessage("")
        setShowGithubImportDialog(false)
    }

    const handleGithubImport = () => {
        setShowGithubImportDialog(true)
    }

    const handleGithubUrlChange = (event: any) => {
        setGithubUrl(event.target.value)
    }

    const handleClickImportFromGithub = () => {
        if (!handleValidation()) return;

        fetchGithubFile(githubUrl).then((fileContent) => {

            if (fileContent) {
                setEditorCode(fileContent)
                props.sendEditorEventViaDCCallback(fileContent, undefined)
                window.sessionStorage.setItem("editorData", fileContent);

                const newSelectedLanguage = getSelectedLanguageByFileName(githubUrl)
                setSelectedLanguage(newSelectedLanguage)
                props.sendEditorEventViaDCCallback(undefined, newSelectedLanguage)
                window.sessionStorage.setItem("selectedLanguage", newSelectedLanguage);
            }

            props.callOpenSnackBar(`Successfully imported file from Github`, "success")
            setGithubUrl("")
            handleCloseGithubImportDialog()
        }).catch(error => { props.callOpenSnackBar(`Error in importing file via Github URL: ${error}`, "error") })
    } 

    const handleValidation = () => {
        let formIsValid = true;
        let newValidationErrorMessage = "";
        errors = {};

        if (!githubUrl.includes("https://github.com")) {
            formIsValid = false;
            errors['githuburl'] = true;
            newValidationErrorMessage = newValidationErrorMessage.concat("URL is not a valid Github URL. \n")
        }

        if (!isSupportedProgrammingFile(githubUrl)) {
            formIsValid = false;
            errors['githuburl'] = true;
            newValidationErrorMessage = newValidationErrorMessage.concat("Kodo currently does not support the following file type. \n")
        }

        setErrors(errors);
        setValidationErrorMessage(newValidationErrorMessage)

        return formIsValid
    }

    return (
        <CodeEditorPanelWrapper>
            <Dialog 
                fullWidth
                open={showGithubImportDialog}
                onClose={handleCloseGithubImportDialog}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                >
                    <DialogTitle>Upload from Github URL</DialogTitle>
                    <DialogContent style={{ height: '30vh' }}>
                        <DialogContentText>
                            Enter the Github URL of the file to be uploaded.
                            Note: This feature only supports files from public repositories.
                        </DialogContentText>
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="multimedia-name">Github URL</InputLabel>
                            <Input
                            error={errors['githuburl']}
                            id="github-url-name"
                            name="name"
                            type="text"
                            autoFocus
                            fullWidth
                            value={githubUrl}
                            onChange={handleGithubUrlChange}
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseGithubImportDialog}>
                            Cancel
                        </Button>
                        <Button primay onClick={handleClickImportFromGithub}>
                            Import
                        </Button>
                    </DialogActions>
                    <DialogContent>
                        {validationErrorMessage && <Alert severity="error">{validationErrorMessage}</Alert>}
                    </DialogContent>
            </Dialog>
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
                <Tooltip title="Github Import">
                    <IconButton onClick={handleGithubImport} aria-label="github-import">
                        <GitHubIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Import">
                    <>
                    <input 
                            accept={ACCEPTABLE_PROGRAMMING_FILE_TYPE}
                            style={{ display: 'none' }}
                            id="import-button-file" 
                            type="file" 
                            name="file"
                            onChange={handleCodeEditorImport} />
                    <label htmlFor="import-button-file">
                        <IconButton component="span" aria-label="import">
                            <PublishIcon />
                        </IconButton>
                    </label>
                    </>    
                </Tooltip>
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