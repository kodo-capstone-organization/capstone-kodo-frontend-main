import { useEffect, useState } from "react";


function QuizAttemptTimer(props: any) {

    const { initialMinutes = 0, initialSeconds = 0, initialHours = 0 } = props;
    const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(initialSeconds);
    const [hours, setHours] = useState(initialHours);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                    props.onTimeOut(true);
                    // if(hours === 0){
                    // }else{
                    //     setHours(hours-1);
                    //     setMinutes(59);
                    //     setSeconds(59);
                    // }
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    });

    return (
        <div id="timer">
            <h1 style={{ textAlign: "center" }}> Time Left: {hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
        </div>
    )
}

export default QuizAttemptTimer;

