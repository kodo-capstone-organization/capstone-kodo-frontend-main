import { Content } from "./Content";

export interface Multimedia extends Content {
    url: string,
    mutlimediaType: MultimediaType,
    urlFilename: string,
    file: File,
    type: string,
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