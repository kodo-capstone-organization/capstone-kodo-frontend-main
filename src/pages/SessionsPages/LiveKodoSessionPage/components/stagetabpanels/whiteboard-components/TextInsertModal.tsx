import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputLabel, TextField } from "@material-ui/core";
import { Button } from "../../../../../../values/ButtonElements";

function TextInsertModal(props: any) {

    const handleInsertTextChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        props.setInputText(event.target.value as string);
    }

    const handleCloseDialog = () => {
        props.setIsTextInsertDialogOpen(false)
    }

    const handleInsertConfirmation = () => {
        if (props.inputText === "") {
            props.callOpenSnackBar("No text input received", "warning")
        } else {
            props.fireIsTextInsertCalled(true)
        }
        handleCloseDialog()
    }

    return (
        <Dialog fullWidth open={props.isTextInsertDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle id="export-dialog-title">Input Whiteboard Text</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Input some text you would like to include in your whiteboard. They can even be multi-lined 😋!
                </DialogContentText>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Input Text"
                        id="input-whiteboard-text"
                        value={props.inputText || ""}
                        onChange={handleInsertTextChange}
                        variant="outlined"
                        multiline
                    />
                </FormControl>
            </DialogContent>
            <DialogActions style={{ padding: "1rem 1.5rem"}}>
                <Button onClick={handleCloseDialog}>
                    Cancel
                </Button>
                <Button onClick={handleInsertConfirmation} primary>
                    Insert
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default TextInsertModal;