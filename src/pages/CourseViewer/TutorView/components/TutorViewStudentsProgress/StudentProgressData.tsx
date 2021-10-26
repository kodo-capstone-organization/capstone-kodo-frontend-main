import { EnrolledCourseWithStudentResp } from "../../../../../Entities/EnrolledCourse";

function createData(
        name: string,
        email: string,
        progress: number
    ): Row {
    return { 
        name: name, 
        email: email, 
        progress: progress 
    } as Row;
}

export interface Row {
    name: string;
    email: string;
    progress: number;
}

export function getRows(arr: EnrolledCourseWithStudentResp[]): Row[] {
    let returnArr: Row[] = [];

    arr.forEach((enrolledCourseWithStudentResp: EnrolledCourseWithStudentResp) => {
        returnArr.push(
            createData(
                enrolledCourseWithStudentResp.name, 
                enrolledCourseWithStudentResp.email, 
                enrolledCourseWithStudentResp.completionPercentage
            )
        );
    });

    return returnArr
}

export interface Column {
    id: 'name' | 'email' | 'progress';
    label: string;
    minWidth: number;
    align: 'right' | 'left' | 'center';
}
  
export function getColumns(): Column[] {
    return [
        { 
            id: 'name', 
            label: 'Name', 
            minWidth: 150, 
            align: 'left' 
        },
        { 
            id: 'email', 
            label: 'Email', 
            minWidth: 150, 
            align: 'left' 
        },
        { 
            id: 'progress', 
            label: 'Progress', 
            minWidth: 300, 
            align: 'center' 
        },
    ]
};