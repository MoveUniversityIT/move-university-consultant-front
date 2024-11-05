import React, {useEffect, useState} from 'react';
import {Progress} from "antd";

const CustomProgress = ({isLoading}) => {
    const [progress, setProgress] = useState(40);

    useEffect(() => {
        let currentProgress = 0;

        const interval = setInterval(() => {
            if (isLoading && currentProgress < 80) {
                currentProgress += 2;
            } else if (isLoading && currentProgress < 90) {
                currentProgress += 1;
            } else if (!isLoading && currentProgress < 100) {
                currentProgress += 5;
            } else {
                clearInterval(interval);
            }
            setProgress(currentProgress);
        }, 50);

        return () => clearInterval(interval);
    }, [isLoading, progress]);

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