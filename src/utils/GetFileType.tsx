import { MultimediaType } from "../apis/Entities/Multimedia"

export function getFileType(filename: string): MultimediaType {
    const fileType = filename.split('.').pop()

    switch (fileType) {
        case "png" || "jpg":
            return MultimediaType.IMAGE
        case "doc" || "docx" || "pdf":
            return MultimediaType.DOCUMENT
        case "mp4" || "mov":
            return MultimediaType.VIDEO
        case "zip":
            return MultimediaType.ZIP
        default:
            return MultimediaType.EMPTY
    }
}

export const ACCEPTABLE_FILE_TYPE = ".pdf, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, video/*, image/*, .zip" 