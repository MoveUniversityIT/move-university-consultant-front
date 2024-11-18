import React, {useState} from 'react';
import {Button, DatePicker, Divider, Form, InputNumber, Select} from "antd";
import _ from "lodash";
import {useRegSpecialDate, useUpdateDateRate} from "@hook/useConsultant";
import koKR from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";

const DateFeeUpdate = ({consultant}) => {
    const [moveType, setMoveType] = useState(null);
    const [vehicleCount, setVehicleCount] = useState(null);
    const [rate, setRate] = useState(0);

    const [specialDate, setSpecialDate] = useState(dayjs(new Date()));

    const {mutate: updateDateRateMutate} = useUpdateDateRate();
    const {mutate: regSpecialDateMutate} = useRegSpecialDate();

    const handleMoveTypeChange = (value, option) => {
        setMoveType({key: option.key, value});
    }

    const handleVehicleCountChange = (value) => {
        setVehicleCount(value);
    };

    const handleDateChange = (date) => {
        setSpecialDate(date);
    };


    const fetchUpdateDateFee = (e) => {
        const emptyFields = [];

        if (_.isEmpty(moveType)) emptyFields.push("이사 종류");
        if (vehicleCount == null || vehicleCount === 0) emptyFields.push("차량 대수");
        if (rate == null) emptyFields.push("변경할 수치");

        if (emptyFields.length > 0) {
            alert(`다음 필드를 입력해주세요: ${emptyFields.join(", ")}`);
            e.preventDefault();
            return;
        }

        updateDateRateMutate({
            moveTypeId: moveType?.key,
            moveTypeName: moveType?.value,
            vehicleCount,
            dateFeeRate: rate
        }, {
            onSuccess: (date) => {
                const successMessage = date?.message || "날짜 추가 요금이 추가되었습니다.";
                alert(successMessage);
            }
        })
    };

    const fetchRegSpecialDate = (e) => {
        const emptyFields = [];

        if (_.isEmpty(specialDate)) emptyFields.push("이사 종류");

        if (emptyFields.length > 0) {
            alert(`다음 필드를 입력해주세요: ${emptyFields.join(", ")}`);
            e.preventDefault();
            return;
        }

        regSpecialDateMutate(specialDate.format('YYYY-MM-DD'), {
            onSuccess: (date) => {
                const successMessage = date?.message || "특수일이 정상적으로 등록되었습니다.";
                alert(successMessage);
            }
        })
    }

    return (
        <div>
            {consultant?.moveTypes && (
                <Form.Item label="이사 종류">
                    <Select
                        placeholder="예: 일반이사"
                        value={moveType?.value}
                        onChange={handleMoveTypeChange}
                    >
                        {consultant.moveTypes
                            .filter((moveType) => moveType.moveTypeName !== '단순운송' && moveType.moveTypeName !== '보관이사')
                            .map((moveType) => (
                                <Select.Option key={moveType.moveTypeId} value={moveType.moveTypeName}>
                                    {moveType.moveTypeName}
                                </Select.Option>
                            ))}
                    </Select>
                </Form.Item>
            )}

            <Form.Item label="차량 대수">
                <Select
                    placeholder="예: 1"
                    value={vehicleCount}
                    onChange={handleVehicleCountChange}
                >
                    {[1, 2, 3].map(count => (
                        <Select.Option key={count} value={count}>
                            {count}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label="날짜 추가 요금">
                <InputNumber
                    step={0.01}
                    placeholder="적용할 비율 입력해주세요."
                    value={rate}
                    onChange={(value) => setRate(value)}
                    formatter={(value) => `${value} %`}
                    parser={(value) => value.replace(' %', '')}
                />
            </Form.Item>

            <Button type='primary' onClick={fetchUpdateDateFee} className="query-btn">
                날짜 추가 요금 적용
            </Button>

            <Divider style={{marginBottom: '20px'}}>특수일 지정</Divider>

            <DatePicker
                style={{width: "100%", marginBottom: '20px'}}
                value={specialDate}
                onChange={handleDateChange}
                locale={koKR}
            />
            <Button type='primary' onClick={fetchRegSpecialDate} className="query-btn">
                특수일 추가
            </Button>
        </div>
    )
}

export default DateFeeUpdate;