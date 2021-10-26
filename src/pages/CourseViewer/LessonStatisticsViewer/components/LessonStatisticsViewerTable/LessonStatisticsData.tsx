import { EnrolledContent } from "../../../../../Entities/EnrolledContent";
import { EnrolledLessonWithStudentName } from "../../../../../Entities/EnrolledLesson";
import { StudentAttempt } from "../../../../../Entities/StudentAttempt";

function isMultimedia(enrolledContent: EnrolledContent): boolean {
    // @ts-ignore
    return enrolledContent.parentContent.type === "multimedia";
}
 
function isQuiz(enrolledContent: EnrolledContent): boolean {
    // @ts-ignore
    return enrolledContent.parentContent.type === "quiz";
}

function createData(
        data: string[][]
    ): Row {
    return { 
        data: data
    } as Row;
}

function createDataHeader(label: string): Column {
    return {
        id: label.toLowerCase().replace(/\s/g, ""), 
        label: label, 
        minWidth: 150, 
        align: 'center' 
    }
}

function getHighestScore(enrolledContent: EnrolledContent): string {
    var highestScore = 0;
    var totalScore = 0;

    enrolledContent.studentAttempts[0].studentAttemptQuestions.map((studentAttemptQuestion) => {
        totalScore += studentAttemptQuestion.quizQuestion.marks;
    });

    enrolledContent.studentAttempts.forEach((studentAttempt: StudentAttempt) => {
        var score = getScore(studentAttempt);
        highestScore = highestScore > score ? highestScore : score;
    });

    return `${highestScore}/${totalScore}`;
}

function getScore(studentAttempt: StudentAttempt): number {
    var score = 0;
    studentAttempt.studentAttemptQuestions.map((studentAttemptQuestion) => {
        const studentAttemptAnswerList = studentAttemptQuestion.studentAttemptAnswers;
        var correct = true;
        studentAttemptAnswerList.map((studentAttemptAnswer) => {
            return (studentAttemptAnswer.correct ? score = score + studentAttemptAnswer.marks : correct = false);
        })
    })
    return score;
} 

function formatDate(date: Date) {
    var d = new Date(date);
    return d.toDateString() + ', ' + d.toLocaleTimeString();
}

export interface Row {
    data: string[][];
}

export function getRows(enrolledLessonWithStudentNames: EnrolledLessonWithStudentName[]): Row[] {
    let returnArr: Row[] = [];

    enrolledLessonWithStudentNames?.forEach((enrolledLessonWithStudentName: EnrolledLessonWithStudentName) => {
        let tmpArr: string[][] = [];
        tmpArr.push([enrolledLessonWithStudentName.studentName, '']);
        enrolledLessonWithStudentName.enrolledLesson.enrolledContents.forEach((enrolledContent: EnrolledContent) => {
            if (isMultimedia(enrolledContent)) {
                tmpArr.push(
                    enrolledContent.dateTimeOfCompletion 
                    ? ['Y', formatDate(enrolledContent.dateTimeOfCompletion)] 
                    : ['-', '-']
                );
            }
        });
        enrolledLessonWithStudentName.enrolledLesson.enrolledContents.forEach((enrolledContent: EnrolledContent) => {
            if (isQuiz(enrolledContent)) {
                tmpArr.push(
                    enrolledContent.dateTimeOfCompletion 
                    ? [`${getHighestScore(enrolledContent)}`, formatDate(enrolledContent.dateTimeOfCompletion)]
                    : ['-', '-']
                );
            }
        });
        returnArr.push(createData(tmpArr));
    });

    return returnArr
}

export interface Column {
    id: string;
    label: string;
    minWidth: number;
    align: 'right' | 'left' | 'center';
}

export function getColumns(enrolledLessonWithStudentNames: EnrolledLessonWithStudentName[]): Column[] {
    let returnArr: Column[] = [];

    returnArr.push(createDataHeader('Name'));

    if (enrolledLessonWithStudentNames && enrolledLessonWithStudentNames.length > 0)
    {        
        enrolledLessonWithStudentNames[0].enrolledLesson.enrolledContents.forEach((enrolledContent: EnrolledContent) => {
            if (isMultimedia(enrolledContent)) {
                returnArr.push(
                    createDataHeader(
                        enrolledContent.parentContent.name
                    )
                );
            }
        });
        enrolledLessonWithStudentNames[0].enrolledLesson.enrolledContents.forEach((enrolledContent: EnrolledContent) => {
            if (isQuiz(enrolledContent)) {
                returnArr.push(
                    createDataHeader(
                        enrolledContent.parentContent.name
                    )
                );
            }
        });
    }

    return returnArr
};