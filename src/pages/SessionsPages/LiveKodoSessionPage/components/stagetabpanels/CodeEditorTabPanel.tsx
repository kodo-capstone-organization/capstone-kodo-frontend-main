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
import { StrippedDownAccount } from '../../../../../entities/Account';
import { getSomeAccountsStrippedDown } from '../../../../../apis/AccountApis';

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

    const [participants, setParticipants] = useState<StrippedDownAccount[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<string>("")
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
            cursorPipeRed: { background: '#ff0000', width: '2.5px !important' },
            cursorPipeOrange: {
                width: '2.5px !important',
                background: '#ff9900',
                '&:hover': {
                    background: "#0000ff",
                }
            },
            cursorPipeLimegreen: { background: '#00ff00', width: '2.5px !important'},
            cursorPipeDarkblue: { background: '#0000ff', width: '2.5px !important' },
            cursorPipePurple: { background: '#9900ff', width: '2.5px !important'},
            cursorPipePink: { background: '#ff00ff', width: '2.5px !important' },
            cursorPipeBlack: { background: '#000000', width: '2.5px !important' },
            cursorSelectionHighlightRed: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: '2.5px !important' },
            cursorSelectionHighlightOrange: { backgroundColor: 'rgba(255, 153, 0, 0.2)', width: '2.5px !important' },
            cursorSelectionHighlightLimegreen: { backgroundColor: 'rgba(0, 255, 0, 0.2)', width: '2.5px !important' },
            cursorSelectionHighlightDarkblue: { backgroundColor: 'rgba(0, 0, 255, 0.2)', width: '2.5px !important' },
            cursorSelectionHighlightPurple: { backgroundColor: 'rgba(153, 0, 255, 0.2)', width: '2.5px !important' },
            cursorSelectionHighlightPink: { backgroundColor: 'rgba(255, 0, 255, 0.2)', width: '2.5px !important' },
            cursorSelectionBlank: { backgroundColor: 'rgba(0, 0, 0, 0)' }
        }),
    );

    const classes = useStyles();

    useEffect(() => {
        // On mount for the first time as the first peer in the whiteboard
        // OR on mount for the first time but has peers already in the whiteboard
        // OR tabbing back to whiteboard

        // Local + Remote states
        const initEditorData = window.sessionStorage.getItem("editorData") || props.incomingEditorData || "";
        const initEditorLanguage = window.sessionStorage.getItem("selectedLanguage") || props.incomingSelectedLanguage || "javascript";

        // Local
        const initSelectedTheme = window.sessionStorage.getItem("selectedTheme") || "vs-light";

        // Setting
        setEditorCode(initEditorData)
        setSelectedLanguage(initEditorLanguage)
        setSelectedTheme(initSelectedTheme)
    }, [])

    useEffect(() => {
        let peerIds: number[] = Array.from(props.peerConns.keys());
        getSomeAccountsStrippedDown(peerIds).then((accs: StrippedDownAccount[]) => {
            setParticipants(accs)
        })
    }, [props.peerConns.size])

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

    // Cursor selection changes implies cursor location changes!
    useEffect(() => {
        // When a cursor selection changes
        if (monacoObjects && monacoObjects.current && props.incomingEditorCursorSelections.size > 0) {
            const { monaco, editor } = monacoObjects.current;

            let newDeltaDecorations = new Array();
            props.incomingEditorCursorSelections.forEach((value: monaco.Selection, key: number) => {

                // Add Selection
                newDeltaDecorations.push({
                    range: new monaco.Range(value.startLineNumber, value.startColumn, value.endLineNumber, value.endColumn),
                    options: {
                        inlineClassName: getSelectionColourStyle(props.peerConns.get(key).colour)
                    }
                })

                // Add Cursor Pipe
                newDeltaDecorations.push({
                    range: new monaco.Range(value.positionLineNumber, value.positionColumn, value.positionLineNumber, value.positionColumn),
                    options: {
                        className: getColourStyleHelper(props.peerConns.get(key).colour)
                    }
                })

                // Add Cursor Tag
                const peerCursorNametagWidget = {
                    domNode: null,
                    getId: function() { return `${key}-cursor`; },
                    getDomNode: function() {
                        // Destroy any existing widgets with the same widgetId
                        const existingNodes = document.querySelectorAll(`[widgetid='${this.getId()}']`) || null;
                        if (existingNodes) {
                            Array.prototype.forEach.call( existingNodes, function( node ) {
                                node.parentNode.removeChild( node );
                            });
                        }

                        // Create wrapper dom node
                        const newDomNode = document.createElement('div');
                        newDomNode.id = `${value.positionLineNumber}-${value.positionColumn}-cursor-wrapper`;

                        // Create a new nametag div object
                        const nametagNode = document.createElement('div');
                        nametagNode.id = `${value.positionLineNumber}-${value.positionColumn}-cursor-nametag-${key}`;
                        nametagNode.innerHTML = getPeerNameForCursor(key) || '';
                        nametagNode.style.fontSize = '14px';
                        nametagNode.style.background = props.peerConns.get(key).colour;
                        nametagNode.style.color = getContrastingTextColourToBackground(hexToRgb(props.peerConns.get(key).colour));

                        // Uncomment to test with dark background colour
                        // nametagNode.style.background = '#0000ff';
                        // nametagNode.style.color = getContrastingTextColourToBackground(hexToRgb('#0000ff'));

                        // nametagNode.style.opacity = '0.2';
                        // Prevent div from wrapping
                        nametagNode.style.overflow = 'hidden';
                        nametagNode.style.whiteSpace = 'nowrap';

                        // Add nametagNode to domNode
                        newDomNode.appendChild(nametagNode);

                        //@ts-ignore
                        this.domNode = newDomNode;
                        return this.domNode;
                    },
                    getPosition: function() {
                        return {
                            position: { lineNumber: value.positionLineNumber, column: value.positionColumn },
                            preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE, monaco.editor.ContentWidgetPositionPreference.EXACT]
                        };
                    },
                    afterRender: function () {
                        const nametagNode = document.getElementById(`${value.positionLineNumber}-${value.positionColumn}-cursor-nametag-${key}`);
                        if (nametagNode) {
                            // Nametag should disappear 2s after user stops typing. Cursor should still stay.
                            setTimeout(() => {
                                nametagNode.style.display = "none";
                            }, 2000)
                        }
                    }
                };
                editor.addContentWidget(peerCursorNametagWidget);
            })

            editor.deltaDecorations([], newDeltaDecorations);
        }
    }, [props.incomingEditorCursorSelections]);

    const editorDidMount = (editor: any, monaco: any) => {
        try {

            // Attach event listener for cursor position changing
            editor.onDidChangeCursorPosition((e: monaco.editor.ICursorPositionChangedEvent) => {
                // This event fires if typing in the code editor (source: 'keyboard') OR
                // clicking on a new location (source: 'mouse')
                console.log("My cursor position changed event")
                handleMyCursorLocationChange(e);
            })

            // Attach event listener for cursor selection changing
            editor.onDidChangeCursorSelection((e: monaco.editor.ICursorSelectionChangedEvent) => {
                console.log("My cursor selection changed event")
                handleMyCursorSelectionChange(e);
            })

            // Mouse move event
            editor.onMouseMove((e: monaco.editor.IEditorMouseEvent) => {
                const targetLineNumber = e?.target?.position?.lineNumber;
                const targetColumn = e?.target?.position?.column;

                // Try to select cursors by matching front part of their id
                const cursorNameTagNodes = document.querySelectorAll(`[id^='${targetLineNumber}-${targetColumn}-cursor-nametag-']`) || [];
                if (cursorNameTagNodes && cursorNameTagNodes.length > 0) {
                    console.log("CURSOR NAME TAGS FOUND ON MOUSE MOVE")
                    Array.prototype.forEach.call( cursorNameTagNodes, function( node ) {
                        // Show nametag
                        node.style.display = 'block';
                        // Which likewise disappears after 2 seconds if no longer hovered
                        setTimeout(() => {
                            node.style.display = "none";
                        }, 2000)
                    });
                }
            })

            // Set ref
            monacoObjects.current = { editor, monaco };
            setIsEditorLoading(false);
        } catch {
            console.error("boohooo, editorDidMount cannot set ref")
        }
    };

    const handleThemeChange = (event: any) => {
        const newTheme = event?.target?.value as string
        setSelectedTheme(newTheme);
        window.sessionStorage.setItem("selectedTheme", newTheme);
        // only change for myself, no need to broadcast
    };

    const handleLanguageChange = (event: any) => {
        setSelectedLanguage(event?.target?.value as string);
        // Send dc message to everyone that language is changed
        props.sendEditorEventViaDCCallback(undefined, event?.target?.value as string)
        window.sessionStorage.setItem("selectedLanguage", event?.target?.value as string);
    };

    const handleMyCursorLocationChange = (e: monaco.editor.ICursorPositionChangedEvent) => {
        const newEditorCursorLocation: EditorCursorLocation = {
            lineNumber: e.position.lineNumber,
            column: e.position.column
        }
        // Send my updated cursor location to peers
        props.sendEditorEventViaDCCallback(undefined, undefined, newEditorCursorLocation, undefined)
    }

    const handleMyCursorSelectionChange = (e: monaco.editor.ICursorSelectionChangedEvent) => {
        const newSelection = e.selection;
        const newEditorCursorLocation: EditorCursorLocation = {
            lineNumber: newSelection.positionLineNumber,
            column: newSelection.positionColumn
        }
        // Send my updated selection AND cursor location (to select, cursor will inevitably change)
        props.sendEditorEventViaDCCallback(undefined, undefined, newEditorCursorLocation, newSelection)
    }

    // Convert hex colour string e.g. '#ff00ff' to rgb { r: number, g: number, b: number }
    const hexToRgb = (hex: string) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Given an rgb input of a background colour, determine whether to use black or white as contrasting text colour
    const getContrastingTextColourToBackground = (bgColourRGB: any) => {
        if (bgColourRGB !== null) {
            const brightness = Math.round(((parseInt(bgColourRGB.r) * 299) +
                (parseInt(bgColourRGB.g) * 587) +
                (parseInt(bgColourRGB.b) * 114)) / 1000);
            return brightness > 125 ? 'black' : 'white';
        } else {
            return 'black'
        }
    }

    const getColourStyleHelper = (colour: string) => {
        switch (colour) {
            case "#ff0000":
                return classes.cursorPipeRed;
            case "#ff9900":
                // classes.cursorPipeOrange --> 'makestyles-cursorPipeOrange-xxxx'
                return classes.cursorPipeOrange;
            case "#00ff00":
                return classes.cursorPipeLimegreen;
            case "#0000ff":
                return classes.cursorPipeDarkblue;
            case "#9900ff":
                return classes.cursorPipePurple;
            case "#ff00ff":
                return classes.cursorPipePink;
            default:
                console.log("Invalid cursor colour specified")
                return classes.cursorPipeBlack;
        }
    }

    const getSelectionColourStyle = (colour: string) => {
        switch (colour) {
            case "#ff0000":
                return classes.cursorSelectionHighlightRed;
            case "#ff9900":
                return classes.cursorSelectionHighlightOrange;
            case "#00ff00":
                return classes.cursorSelectionHighlightLimegreen;
            case "#0000ff":
                return classes.cursorSelectionHighlightDarkblue;
            case "#9900ff":
                return classes.cursorSelectionHighlightPurple;
            case "#ff00ff":
                return classes.cursorSelectionHighlightPink;
            default:
                console.log("Invalid colour selection specified")
                return classes.cursorSelectionBlank;
        }
    }

    const getPeerNameForCursor = (peerId: number) => {
        const peerObj = participants.find(({ accountId }) => accountId === peerId );
        return peerObj?.name;
    }

    const onCodeChange = (newCodeValue: string, event: monaco.editor.IModelContentChangedEvent) => {
        // Send updated code to peers
        props.sendEditorEventViaDCCallback(newCodeValue, undefined, undefined, undefined)

        // Set updated code to session storage
        window.sessionStorage.setItem("editorData", newCodeValue);

        // Update local code
        setEditorCode(newCodeValue)
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
        setErrors({})
        setValidationErrorMessage("")
        setGithubUrl(event.target.value)
    }

    const handleClickImportFromGithub = () => {
        if (!handleGithubImportValidation()) return;

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
        }).catch(error => { setValidationErrorMessage(`Error in importing file via Github URL. Please check that the URL is valid and/or the file is in a public Github repository` )})
    } 

    const handleGithubImportValidation = () => {
        let formIsValid = true;
        let newValidationErrorMessage = "";
        errors = {};

        if (!githubUrl.includes("https://github.com")) {
            formIsValid = false;
            errors['githuburl'] = true;
            newValidationErrorMessage = newValidationErrorMessage.concat("Input is not a valid Github URL. \n")
        }

        if (!isSupportedProgrammingFile(githubUrl)) {
            formIsValid = false;
            errors['githuburl'] = true;

            const unsupportedExtension = githubUrl.split('.').pop();
            newValidationErrorMessage = newValidationErrorMessage.concat(`Kodo currently does not support the following file type: ${unsupportedExtension}. \n`)
        }

        setErrors(errors);
        setValidationErrorMessage(newValidationErrorMessage)

        return formIsValid
    }

    return (
        <CodeEditorPanelWrapper>
            <Dialog fullWidth open={showGithubImportDialog} onClose={handleCloseGithubImportDialog} >
                <DialogTitle>Upload from Github URL</DialogTitle>
                <DialogContent>
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
                    <br/>
                    <br/>
                    {validationErrorMessage && <Alert severity="error">{validationErrorMessage}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseGithubImportDialog}>
                        Cancel
                    </Button>
                    <Button primary onClick={handleClickImportFromGithub}>
                        Import
                    </Button>
                </DialogActions>
            </Dialog>
            <EditorTopBarGrid container>
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
                            <MenuItem key={theme} value={theme}>{theme}</MenuItem>
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
                <Tooltip title="Github File Import">
                    <IconButton onClick={handleGithubImport} aria-label="github-import">
                        <GitHubIcon />
                    </IconButton>
                </Tooltip>

                <>
                    <input
                            accept={ACCEPTABLE_PROGRAMMING_FILE_TYPE}
                            style={{ display: 'none' }}
                            id="import-button-file"
                            type="file"
                            name="file"
                            onChange={handleCodeEditorImport} />
                    <label htmlFor="import-button-file">
                        <Tooltip title="File Import">
                            <IconButton component="span" aria-label="import">
                                <PublishIcon />
                            </IconButton>
                        </Tooltip>
                    </label>
                </>

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