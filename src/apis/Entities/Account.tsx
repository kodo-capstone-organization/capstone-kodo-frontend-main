import { Tag } from './Tag'
export interface Account {
    id: number
    username: string
    name: string
    bio: string
    email: string
    displayPictureUrl: string
    isAdmin: boolean
    isActive: boolean
}

export interface CreateNewAccountReq {
    username: string
    password: string
    name: string
    bio: string
    email: string
    isAdmin: boolean
    tagTitles: Tag[]
}