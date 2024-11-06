import React, {useEffect, useState} from 'react';
import {DatePicker} from "antd";
import {useSpecialDay} from "@hook/useConsultant";
import dayjs from "dayjs";

const CustomDatePicker = ({requestDate, handleDateChange}) => {
    const {mutate: dateMutate} = useSpecialDay();
    const [noHandsDaysByYear, setNoHandsDaysByYear] = useState({}); // 연도별 손 없는 날 데이터 캐싱

    const fetchNoHandsDaysForYear = (year) => {
        if (noHandsDaysByYear[year]) return;

        dateMutate(year, {
            onSuccess: (data) => {
                setNoHandsDaysByYear(prev => ({
                    ...prev,
                    [year]: data.NO_HANDS_DAY.map(date => dayjs(date, "YYYY-MM-DD"))
                }));
            }
        });
    };

    useEffect(() => {
        const currentYear = dayjs().format("YYYY");
        fetchNoHandsDaysForYear(currentYear);
    }, []);

    const handlePanelChange = (value) => {
        const selectedYear = value.format("YYYY");
        fetchNoHandsDaysForYear(selectedYear);
    };

    const isNoHandsDay = (date) => {
        const year = dayjs(date, 'YYYY').year();
        const formattedDate = date.format('YYYY-MM-DD');

        return noHandsDaysByYear[year]?.some((d) => d.format('YYYY-MM-DD') === formattedDate);
    };

    const dateCellRender = (current) => {
        const year = current.format("YYYY");
        const isNoHandsDay = noHandsDaysByYear[year]?.some(noHandsDay => noHandsDay.isSame(current, "day"));

        return (
            <div className="ant-picker-cell-inner" style={{ position: 'relative' }}>
                {current.date()}
                {isNoHandsDay && (
                    <div
                        style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#4cd320',
                            borderRadius: '50%',
                            position: 'absolute',
                            bottom: '-4px', // 날짜 아래에 위치하도록 설정
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                    />
                )}
            </div>
        );
    };

    const Legend = () => (
        <div style={{marginTop: '10px', display: 'flex', alignItems: 'center'}}>
            <div style={{
                width: '8px', height: '8px', backgroundColor: '#4CD320FF', marginRight: '8px', borderRadius: '50%'
            }}/>
            <span>손 없는 날</span>
        </div>
    );

    return (
        <>
            <DatePicker
                value={requestDate}
                onChange={(date) => {
                    if(date === null) {
                        handleDateChange(false)(null);
                    }else {
                        handleDateChange(isNoHandsDay(date))(date);
                    }
                }}
                onPanelChange={handlePanelChange}
                cellRender={dateCellRender}
            />
            <Legend />
        </>
    );
}


export default CustomDatePicker;