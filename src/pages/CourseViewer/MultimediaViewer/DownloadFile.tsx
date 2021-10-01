import React from 'react';
import { BtnWrapper } from './MultimediaViewerElements';

function DownloadFile(props: any) {

	function downloadEmployeeData() {
		
		var type;
		// if (props.multimediaType === "PDF") {
		// 	type = ".pdf"
		// } else if (props.multimediaType === "DOCUMENT") {
		// 	type = ".docx"
		// } 	
		
		if (props.multimediaUrl.contains(".pdf")) {
			type=".pdf";
		}

		// switch (splitUrl[splitUrl.length - 1])
        // {
        //     case "png":
        //     case "jpg":
        //     case "jpeg":
        //     case "gif":
        //         return MultimediaType.IMAGE;
        //     case "doc":
        //     case "docx":
        //         return MultimediaType.DOCUMENT;
        //     case "pdf":
        //         return MultimediaType.PDF;
        //     case "mp4":
        //     case "mov":
        //         return MultimediaType.VIDEO;
        //     case "zip":
        //         return MultimediaType.ZIP;
        //     default:
        //         return MultimediaType.EMPTY;
        // }

		fetch(props.multimediaUrl)
		// fetch('https://storage.googleapis.com/download/storage/v1/b/capstone-kodo-bucket/o/c07f7087-9136-4823-999d-b8ecb1f96ece.pdf?generation=1632963502872154&alt=media')
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = props.multimediaName + ".docx"; // + type
					a.click();
				});
				//window.location.href = response.url;
			});
	}


	return (
			<BtnWrapper>
				<h1>Download File using React App</h1>
				<h3>Download Employee Data using Button</h3>
				<button onClick={downloadEmployeeData}>Download</button>
				<p />
				<h3>Download Employee Data using Link</h3>
				<a href="#" onClick={downloadEmployeeData}>Download</a>
			</BtnWrapper>
	)
}


export default DownloadFile;