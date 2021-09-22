import { Content } from "./Content";

export interface Multimedia extends Content {
    url: string,
    multimediaType: MultimediaType,
    urlFilename: string,
    type: string,

    // Used to store temporary file object on frontend before passing to backend
    file?: File

    // Used to store temporary file name on frontend before passing to backend
    newFilename?: string
}

export enum MultimediaType {
    PDF = "PDF",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    ZIP = "ZIP",
    DOCUMENT = "DOCUMENT",
    EMPTY = "",
}

export interface MultimediaReq {
    multimedia: Multimedia,
    multipartFile: File
}