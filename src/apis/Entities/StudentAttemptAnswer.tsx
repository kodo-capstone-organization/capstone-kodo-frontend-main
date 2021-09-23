export interface StudentAttemptAnswer {
    studentAttemptAnswerId: number,
    dateTimeOfAttempt: Date;
    leftContent: string;
    rightContent: string;
    correct: boolean;
    marks: number;
}