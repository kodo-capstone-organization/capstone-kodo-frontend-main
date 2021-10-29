import React from 'react';
import { Button } from "../../../../values/ButtonElements";

function DownloadFile(props: any) {

	function downloadEmployeeData() {
		var url: String = props.multimediaUrl;
		var type: String;

		if (url.includes(".pdf")) {
			type = ".pdf";
		} else if (url.includes(".doc")) {
			type = ".doc"
		} else if (url.includes(".docx")) {
			type = ".docx"
		} else if (url.includes(".png")) {
			type = ".png"
		} else if (url.includes(".jpg")) {
			type = ".jpg"
		} else if (url.includes(".jpeg")) {
			type = ".jpeg"
		} else if (url.includes(".gif")) {
			type = ".gif"
		} else if (url.includes(".mp4")) {
			type = ".mp4"
		} else if (url.includes(".mov")) {
			type = ".mov"
		} else if (url.includes(".zip")) {
			type = ".zip"
		}

		fetch(props.multimediaUrl)
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = props.multimediaName + type;
					a.click();
				});
			});
	}

	return (
		<Button onClick={downloadEmployeeData}>
			Download
		</Button>
	)
}

export default DownloadFile;