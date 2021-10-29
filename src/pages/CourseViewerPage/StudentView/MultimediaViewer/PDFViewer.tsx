import { useState } from "react";
import { Document, Page } from "react-pdf";
import { Button } from "../../../../values/ButtonElements";

import {
    MultimediaActionButtonWrapper,
  } from "./MultimediaViewerElements";

function PDFViewer(props: any) {

    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: any) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <>
            <div style={{ border: "2px solid darkblue"}}>
                <Document
                    file={props.doc}
                    options={{ workerSrc: "/pdf.worker.js" }}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
            </div>

            <p>
                Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
            </p>
            <div style={{ display: 'flex', flexDirection: 'row'}}>
                <MultimediaActionButtonWrapper>
                    <Button disabled={pageNumber <= 1} onClick={previousPage}>
                        Previous
                    </Button>
                </MultimediaActionButtonWrapper>
                <MultimediaActionButtonWrapper>
                    <Button disabled={pageNumber >= numPages!} onClick={nextPage}>
                        Next
                    </Button>
                </MultimediaActionButtonWrapper>
            </div>
        </>
    );
}

export default PDFViewer;
