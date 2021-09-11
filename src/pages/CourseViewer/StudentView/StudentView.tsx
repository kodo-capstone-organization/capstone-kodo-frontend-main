import React, { useState, useEffect } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Stepper, Step, StepButton, Button, Typography } from "@material-ui/core";
import { Course } from '../../../apis/Entities/Course';
import { Account } from '../../../apis/Entities/Account';
import { Lesson } from '../../../apis/Entities/Lesson';
import { EnrolledLesson } from '../../../apis/Entities/EnrolledLesson';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        button: {
            marginRight: theme.spacing(1),
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        completed: {
            display: 'inline-block',
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    }),
);

const getSteps = () => {
    return ['Select campaign settings', 'Create an ad group', 'Create an ad'];
}

const getStepContent = (step: number) => {
    switch (step) {
        case 0:
            return 'Step 1: Select campaign settings...';
        case 1:
            return 'Step 2: What is an ad group anyways?';
        case 2:
            return 'Step 3: This is the bit I really care about!';
        default:
            return 'Unknown step';
    }
}

function StudentView(props: any) {

    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState(new Set<number>());
    const [skipped, setSkipped] = React.useState(new Set<number>());
    const [account, setAccount] = React.useState<Account>();
    const [course, setCourse] = React.useState<Course>();
    const [lessons, setLessons] = React.useState<(Lesson|EnrolledLesson)[]>([]);
    const steps = getSteps();

    useEffect(() => {
        if (props.account !== null && props.course !== null) {
            setAccount(props.account)
            setCourse(props.course)
        }
    }, [props.account, props.course])

    const totalSteps = () => {
        return getSteps().length;
    };

    const isStepOptional = (step: number) => {
        return step === 1;
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const skippedSteps = () => {
        return skipped.size;
    };

    const completedSteps = () => {
        return completed.size;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps() - skippedSteps();
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed
                // find the first step that has been completed
                steps.findIndex((step, i) => !completed.has(i))
                : activeStep + 1;

        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = new Set(completed);
        newCompleted.add(activeStep);
        setCompleted(newCompleted);

        /**
         * Sigh... it would be much nicer to replace the following if conditional with
         * `if (!this.allStepsComplete())` however state is not set when we do this,
         * thus we have to resort to not being very DRY.
         */
        if (completed.size !== totalSteps() - skippedSteps()) {
            handleNext();
        }
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted(new Set<number>());
        setSkipped(new Set<number>());
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    function isStepComplete(step: number) {
        return completed.has(step);
    }
    return (
        <div>

            <div id="stepper" className={classes.root}>
                <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        const buttonProps: { optional?: React.ReactNode } = {};
                        if (isStepOptional(index)) {
                            buttonProps.optional = <Typography variant="caption">Optional</Typography>;
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepButton
                                    onClick={handleStep(index)}
                                    completed={isStepComplete(index)}
                                    {...buttonProps}
                                >
                                    {label}
                                </StepButton>
                            </Step>
                        );
                    })}
                </Stepper>

            </div>

            <div className="rating">


            </div>
        </div>
    )
}

export default StudentView;
