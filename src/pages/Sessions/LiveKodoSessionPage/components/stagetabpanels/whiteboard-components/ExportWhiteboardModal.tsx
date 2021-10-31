import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { Button } from "../../../../../../values/ButtonElements";

const EXPORT_TYPES = ["PNG", "JPEG", "PDF"]

function ExportWhiteboardModal(props: any) {

    const [type, setType] = useState<string>("PNG");

    const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    }

    const handleExport = () => {
        const canvas: any = document.getElementById('board') || null;
        if (window.sessionStorage.getItem("canvasData") && canvas) {
            if (type === "PDF") {
                // TODO: Might have to explore some libraries e.g. @react-pdf/renderer
                // https://github.com/diegomura/react-pdf
                props.callOpenSnackBar("PDF export currently not supported", "warning")
            } else {
                // PNG or JPEG - Standard image types
                const imgUrl = canvas.toDataURL(`image/${type.toLowerCase()}`)
                const downloadLink = document.createElement('a');
                downloadLink.setAttribute('download', `Whiteboard.${type}`);
                downloadLink.setAttribute('href', imgUrl);
                downloadLink.click();
            }
        } else {
            props.callOpenSnackBar("Nothing to export as whiteboard is empty!", "error")
        }
    }

    const handleCloseDialog = () => {
        props.setIsExportDialogOpen(false)
    }

    return (
        <Dialog fullWidth open={props.isExportDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle id="export-dialog-title">Export Whiteboard</DialogTitle>
            <DialogContent>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="export-type-select-label">Export Whiteboard As</InputLabel>
                    <Select
                        labelId="export-type-select-label"
                        id="export-type-select"
                        value={type}
                        onChange={handleTypeChange}
                        label="Export Whiteboard As"
                    >
                        { EXPORT_TYPES.map((type: string) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions style={{ padding: "1rem 1.5rem"}}>
                <Button onClick={handleCloseDialog}>
                    Cancel
                </Button>
                <Button onClick={handleExport} primary>
                    Export
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ExportWhiteboardModal;