import React, {useEffect, useRef, useState} from 'react';
import {Progress} from "antd";

const CustomProgress = ({isLoading}) => {
    const [progress, setProgress] = useState(90);
    const progressRef = useRef(90); // progress 값을 저장하는 ref

    useEffect(() => {
        const interval = setInterval(() => {
            if (isLoading && progressRef.current < 80) {
                progressRef.current += 2;
            } else if (isLoading && progressRef.current < 90) {
                progressRef.current += 1;
            } else if (!isLoading && progressRef.current < 100) {
                progressRef.current += 5;
            } else {
                clearInterval(interval);
            }
            setProgress(progressRef.current);
        }, 50);

        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <div style={{
            position: 'fixed',  // 화면 전체를 덮도록 설정
            top: 0,
            left: '25%',
            width: '50vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999 // 최상위 고정
        }}>
            <Progress percent={progress}/>
        </div>
    )
}

export default CustomProgress;