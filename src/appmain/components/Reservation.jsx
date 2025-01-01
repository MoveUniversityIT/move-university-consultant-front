import React, { useState, useEffect } from "react";
import { Button, Card, Input, List, Modal, Pagination } from "antd";
import { useDeleteReservation } from "@hook/useUser";
import { useQueryClient } from "@tanstack/react-query";

const Reservation = ({ onLoad, onNew, reservations }) => {
    const queryClient = useQueryClient();
    const { mutate: reservationMutate } = useDeleteReservation();

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    const filteredReservations = (reservations ?? []).filter((reservation) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            reservation?.requestDate.toLowerCase().includes(searchLower) ||
            reservation?.customerName.toLowerCase().includes(searchLower) ||
            reservation?.customerPhoneNumber.toLowerCase().includes(searchLower)
        );
    });

    // 페이지네이션은 필터링된 데이터(filteredReservations)에만 적용
    const paginatedReservations = filteredReservations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // 검색어가 변경될 때 페이지를 첫 페이지로 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <Card
            title="상담 예약"
            className="shadow-md rounded-md h-full flex flex-col w-full overflow-hidden"
        >
            <div>
                <Button
                    className="px-5 py-3 mb-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                    block
                    onClick={onNew}>
                    새로 만들기
                </Button>

                <Input
                    placeholder="검색 (이름, 번호, 날짜)"
                    className="mb-4"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
            </div>

            {/* 리스트 */}
            <div className="flex-1 overflow-y-auto mb-4" style={{ minHeight: "700px" }}>
                <List
                    dataSource={paginatedReservations}
                    renderItem={(reservation) => (
                        <List.Item
                            key={reservation.reservationId}
                            className="w-full bg-white rounded-lg mb-2 p-4 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-xl transition-all duration-300 flex flex-col items-center transform"
                        >
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-gray-600 flex">
                                    <span className="font-semibold text-center">요청일:</span>
                                    <span className="ml-2">{reservation.requestDate}</span>
                                </p>
                                <p className="text-sm text-gray-600 flex">
                                    <span className="font-semibold text-center">화주이름:</span>
                                    <span className="ml-2">{reservation.customerName}</span>
                                </p>
                                <p className="text-sm text-gray-600 flex">
                                    <span className="font-semibold text-center">화주번호:</span>
                                    <span className="ml-2">{reservation.customerPhoneNumber}</span>
                                </p>
                            </div>

                            {/* 버튼 */}
                            <div className="flex justify-end gap-2 border-t pt-2 mt-1">
                                <Button
                                    size="small"
                                    className="px-4 py-3 mb-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
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
                                    className="px-4 py-3 mb-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-200"
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
            </div>

            {/* Pagination */}
            <div className="w-full flex justify-center mb-4">
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={filteredReservations?.length ?? 0}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    responsive={true}
                    showLessItems
                />
            </div>
        </Card>
    );
};

export default Reservation;
