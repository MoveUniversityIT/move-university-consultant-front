import React, { useState } from "react";
import { Button, Card, Input, List, Modal } from "antd";
import { useDeleteReservation } from "@hook/useUser";
import { useQueryClient } from "@tanstack/react-query";

const Reservation = ({ onLoad, onNew, reservations }) => {
    const queryClient = useQueryClient();
    const { mutate: reservationMutate } = useDeleteReservation();
    const [searchTerm, setSearchTerm] = useState("");

    const confirmAction = (title, content, onConfirm) => {
        Modal.confirm({
            title,
            content,
            okText: "확인",
            cancelText: "취소",
            onOk: onConfirm,
        });
    };

    const handleDelete = (reservationId) => {
        reservationMutate(reservationId, {
            onSuccess: () => {
                queryClient.invalidateQueries("reservation");
            },
        });
    };

    const filteredReservations = reservations?.filter((reservation) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            reservation?.requestDate.toLowerCase().includes(searchLower) ||
            reservation?.customerName.toLowerCase().includes(searchLower) ||
            reservation?.customerPhoneNumber.toLowerCase().includes(searchLower)
        );
    });

    return (
        <Card
            title="상담 예약"
            className="shadow-md rounded-md h-full"
            bodyStyle={{
                padding: "10px",
            }}
        >
            {/* 새로 만들기 버튼 */}
            <Button type="primary" block className="mb-4" onClick={onNew}>
                새로 만들기
            </Button>

            {/* 검색 입력 필드 */}
            <Input
                placeholder="검색 (이름, 번호, 날짜)"
                className="mb-4"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
            />

            {/* 목록 */}
            <List
                dataSource={filteredReservations}
                renderItem={(reservation) => (
                    <List.Item
                        key={reservation.reservationId}
                        className="w-full bg-white shadow-sm rounded-lg mb-2 p-4 hover:shadow-md transition-shadow flex flex-col opacity-100 transform duration-300"
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold text-gray-800">
                                {reservation.requestDate}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>화주이름:</strong> {reservation.customerName}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>화주번호:</strong> {reservation.customerPhoneNumber}
                            </p>
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end gap-2 border-t pt-2 mt-1">
                            <Button
                                size="small"
                                className="bg-blue-500 text-white rounded-md hover:bg-blue-600 px-4 py-1 text-xs"
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
                                className="bg-red-500 text-white rounded-md hover:bg-red-600 px-4 py-1 text-xs"
                                onClick={() =>
                                    confirmAction(
                                        "삭제 확인",
                                        "정말로 이 데이터를 삭제하시겠습니까?",
                                        () => handleDelete(reservation?.reservationId)
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
