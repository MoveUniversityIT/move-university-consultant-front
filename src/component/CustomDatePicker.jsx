import React, {useEffect, useState} from 'react';
import {DatePicker} from "antd";
import {useSpecialDay} from "@hook/useConsultant";
import dayjs from "dayjs";
import koKR from 'antd/es/date-picker/locale/ko_KR';

const CustomDatePicker = ({dateCheckList, requestDate, handleDateChange}) => {
    const {mutate: dateMutate} = useSpecialDay();
    const [noHandsDaysByYear, setNoHandsDaysByYear] = useState({});
    const [prevYear, setPrevYear] = useState(dayjs(new Date(), 'YYYY').year());

    const isNoHandsDay = (date) => {
        const year = dayjs(date, 'YYYY').year();
        const formattedDate = date?.format('YYYY-MM-DD');

        return noHandsDaysByYear[year]?.some((d) => d.format('YYYY-MM-DD') === formattedDate);
    };

    const fetchNoHandsDaysForYear = (year) => {
        dateMutate(year, {
            onSuccess: (data) => {
                const noHandsDays = data.NO_HANDS_DAY.reduce((acc, date) => {
                    const day = dayjs(date, "YYYY-MM-DD");
                    const yearKey = day.year();
                    const numericYear = Number(year);

                    if (!acc[yearKey]) {
                        acc[yearKey] = [];
                    }

                    acc[yearKey].push(day);

                    return acc;
                }, {});

                setNoHandsDaysByYear(prev => ({
                    ...prev,
                    ...noHandsDays,
                }));

                const today = dayjs();
                if (noHandsDays[year].some(d => d.isSame(today, 'day'))) {
                    handleDateChange(true)(today);
                }
            }
        });
    };

    useEffect(() => {
        handleDateChange(isNoHandsDay(requestDate))(requestDate);
    }, [requestDate]);

    useEffect(() => {
        const currentYear = dayjs().format("YYYY");
        fetchNoHandsDaysForYear(currentYear);
    }, []);

    const handlePanelChange = (value) => {
        const selectedYear = value.format("YYYY");

        if(selectedYear !== prevYear) {
            setPrevYear(selectedYear);
            fetchNoHandsDaysForYear(selectedYear);
        }
    };


    const dateCellRender = (current) => {
        const year = current.format("YYYY");

        const yearsToCheck = [
            `${parseInt(year, 10) - 1}`,
            year,
            `${parseInt(year, 10) + 1}`
        ];

        const isNoHandsDay = yearsToCheck.some((checkYear) =>
            noHandsDaysByYear[checkYear]?.some((noHandsDay) => noHandsDay.isSame(current, "day"))
        );

        return (
            <div className="ant-picker-cell-inner relative">
                {current.date()}
                {isNoHandsDay && (
                    <div
                        className="w-1.5 h-1.5 bg-no-hands-day rounded-full absolute bottom-[-4px] left-1/2 transform -translate-x-1/2"
                    />
                )}
            </div>
        );
    };

    const Legend = ({isVisible}) => (
        <div
            className={`flex items-center ${!isVisible ? "invisible" : ""}`}
        >
            <div className="w-2 h-2 bg-no-hands-day mr-2 rounded-full"/>
            <p className="text-gray-700">손 없는 날</p>
        </div>
    );

    return (
        <>
            <div className="flex items-center justify-between mb-0.5">
                <label className="text-sm font-medium text-gray-700 block mr-2">
                    요청일:
                </label>
                <Legend isVisible={dateCheckList.includes("NO_HANDS_SON")}/>
            </div>
            <DatePicker
                style={{width: "100%"}}
                value={requestDate}
                onChange={(date) => {
                    if (date === null) {
                        handleDateChange(false)(null);
                    } else {
                        handleDateChange(isNoHandsDay(date))(date);
                    }
                }}
                locale={koKR}
                onPanelChange={handlePanelChange}
                cellRender={dateCellRender}
            />
        </>
    );
}


export default CustomDatePicker;