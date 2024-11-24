import React from "react";
import { Card, List, Button, Modal } from "antd";
import {useDispatch, useSelector} from "react-redux";
import {deleteReservation} from "@/features/reservation/reservationSlice";

const Reservation = ({ onLoad, onNew }) => {
    const dispatch = useDispatch();
    const reservations = useSelector((state) => state.reservation.reservations);

    const confirmAction = (title, content, onConfirm) => {
        Modal.confirm({
            title,
            content,
            okText: "확인",
            cancelText: "취소",
            onOk: onConfirm,
        });
    };

    return (
        <Card title="상담 예약" className="shadow-md rounded-md h-full">
            <Button type="primary" block className="mb-4" onClick={onNew}>
                새로 만들기
            </Button>
            <List
                dataSource={reservations}
                renderItem={(reservation, index) => (
                    <List.Item
                        className="w-full bg-white shadow-sm rounded-lg mb-4 hover:shadow-md transition-shadow flex flex-col gap-4"
                    >
                        <div className="p-2">
                            <p className="text-base font-semibold text-gray-800 mb-2">
                                {reservation.requestDate}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>화주이름:</strong> {reservation.customerName}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>화주번호:</strong> {reservation.customerPhoneNumber}
                            </p>
                        </div>

                        <div className="flex justify-end border-t pt-2">
                            <Button
                                size="small"
                                className="bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={() =>
                                    confirmAction(
                                        "불러오기 확인",
                                        "정말로 이 데이터를 불러오시겠습니까?",
                                        () => onLoad(reservation)
                                    )
                                }
                            >
                                불러오기
                            </Button>
                            <Button
                                size="small"
                                className="bg-red-500 text-white rounded-md hover:bg-red-600 ml-2"
                                onClick={() =>
                                    confirmAction(
                                        "삭제 확인",
                                        "정말로 이 데이터를 삭제하시겠습니까?",
                                        () => dispatch(deleteReservation(index))
                                    )
                                }
                            >
                                삭제하기
                            </Button>
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default Reservation;