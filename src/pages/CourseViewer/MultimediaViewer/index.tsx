import { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { getMultimediaByMultimediaId } from "../../../apis/Multimedia/MultimediaApis";
import { Multimedia } from "../../../apis/Entities/Multimedia";


function MultimediaViewer(props: any) {
  const contentId = props.match.params.contentId;
  const [currentMultimedia, setMultimedia] = useState<Multimedia>();

  useEffect(() => {
    getMultimediaByMultimediaId(contentId).then(receivedMultimedia => {
      setMultimedia(receivedMultimedia);
    }); 
  }, []);

  return (<div>hello! {currentMultimedia?.multimediaType} goes here</div>)
}

const MultimediaViewerWithRouter = withRouter(MultimediaViewer);
export default MultimediaViewerWithRouter;
