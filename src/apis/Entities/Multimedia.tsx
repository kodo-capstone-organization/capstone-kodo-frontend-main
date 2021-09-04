import { Content } from "./Content";

export interface Multimedia extends Content {
    url: string,
    type: MultimediaType
}

export enum MultimediaType {
    PDF = "PDF",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    ZIP = "ZIP"
}