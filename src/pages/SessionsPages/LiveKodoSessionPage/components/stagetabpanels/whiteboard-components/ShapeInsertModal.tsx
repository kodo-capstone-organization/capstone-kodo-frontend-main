import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
    Grid, Input, InputLabel, TextField } from "@material-ui/core";
import { Button } from "../../../../../../values/ButtonElements";
import { ShapeOption, ShapeOptionImage } from "./WhiteboardElements";

const BASIC_SHAPES = ["rectangle", "circle", "triangle", "diamond"]

const UML_SHAPES = ["actor", "entity", "ellipse", "note"]

function ShapeInsertModal(props: any) {

    const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        // props.setInputText(event.target.value as string);
    }

    const handleCloseDialog = () => {
        props.setIsShapeInsertDialogOpen(false)
    }

    const handleInsertShape = (shapeString: string) => {
        // if (props.inputText === "") {
        //     props.callOpenSnackBar("No text input received", "warning")
        // } else {
        //     props.fireIsTextInsertCalled(true)
        // }
        handleCloseDialog()
    }

    return (
        <Dialog fullWidth open={props.isShapeInsertDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle id="export-dialog-title">Select a Shape</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Select a shape you would like to add to the whiteboard.
                </DialogContentText>
                <br/>
                <DialogContentText>
                    <strong>Basic Shapes 🔷</strong>
                </DialogContentText>
                <Grid container spacing={2} justifyContent="space-between">
                    { BASIC_SHAPES.map((shape: string) => (
                        <Grid item xs={3} key={shape}>
                            <ShapeOption onClick={() => handleInsertShape(shape)}>
                                {shape.toUpperCase()}
                                <ShapeOptionImage src={`/shapes/${shape}_shape.png`} alt={shape} />
                            </ShapeOption>
                        </Grid>
                    ))}
                </Grid>
                <br/>
                <DialogContentText>
                    <strong>UML Shapes 💠</strong>
                </DialogContentText>
                <Grid container spacing={2} justifyContent="space-between">
                    { UML_SHAPES.map((shape: string) => (
                        <Grid item xs={3} key={shape}>
                            <ShapeOption onClick={() => handleInsertShape(shape)}>
                                {shape.toUpperCase()}
                                <ShapeOptionImage src={`/shapes/${shape}_shape.png`} alt={shape} />
                            </ShapeOption>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions style={{ padding: "1rem 1.5rem"}}>
                <Button onClick={handleCloseDialog}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ShapeInsertModal;