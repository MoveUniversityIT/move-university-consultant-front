import React, {useState, useEffect, useRef} from "react";
import { Button, Card, Input, List, Modal, Pagination } from "antd";
import { useDeleteReservation } from "@hook/useUser";
import { useQueryClient } from "@tanstack/react-query";

const Reservation = ({ onLoad, onNew, reservations }) => {
    const queryClient = useQueryClient();
    const { mutate: reservationMutate } = useDeleteReservation();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(1); // 초기값 설정
    const containerRef = useRef(null); // 컴포넌트의 크기를 감지하기 위한 ref
    const pageRef = useRef(null); // 페이징 크기를 감지하기 위한 ref
    const [maxPages, setMaxPages] = useState(1); // 최대 페이지 표시 수


    // 세로 크기를 기준으로 itemsPerPage 계산
    useEffect(() => {
        const updateItemsPerPage = () => {
            const containerHeight = containerRef.current.offsetHeight;
            const itemHeight = 120;
            const calculatedItems = Math.floor(containerHeight / itemHeight);
            setItemsPerPage(Math.max(1, calculatedItems));
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);

        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);

    useEffect(() => {
        const updateMaxPages = () => {
            if (pageRef.current) {
                const containerWidth = pageRef.current.offsetWidth;
                if (containerWidth < 400) {
                    setMaxPages(2);
                } else if (containerWidth < 600) {
                    setMaxPages(3);
                } else {
                    setMaxPages(4);
                }
            }
        };

        const resizeObserver = new ResizeObserver(updateMaxPages);
        if (pageRef.current) {
            resizeObserver.observe(pageRef.current);
        }

        // Clean up
        return () => {
            if (pageRef.current) {
                resizeObserver.unobserve(pageRef.current);
            }
        };
    }, []);

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

    const paginatedReservations = filteredReservations?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Card
            title="상담 예약"
            className="shadow-md rounded-md h-full flex flex-col justify-between w-full overflow-hidden"
            bodyStyle={{display: "flex", flexDirection: "column", height: "100%"}}
        >
            <div>
                <Button type="primary" block className="mb-4" onClick={onNew}>
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
            <div ref={containerRef} className="flex-1 overflow-y-hidden mb-4">
                <List
                    dataSource={paginatedReservations}
                    renderItem={(reservation) => (
                        <List.Item
                            key={reservation.reservationId}
                            className="w-full bg-white shadow-sm rounded-lg mb-2 p-4 hover:shadow-md transition-shadow flex flex-col !items-center opacity-100 transform duration-300"
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
            </div>

            {/* Pagination */}
            <div ref={pageRef} className="w-full flex justify-center mb-4">
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={filteredReservations?.length ?? 0}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    responsive={true}
                    showLessItems
                    className="text-center"
                    itemRender={(page, type, originalElement) => {
                        if (type === "prev" || type === "next") {
                            return originalElement;
                        }
                        if (type === "page" && Math.abs(page - currentPage) >= maxPages) {
                            return null;
                        }
                        if (type === "jump-prev" || type === "jump-next") {
                            return null;
                        }
                        return originalElement;
                    }}
                />
            </div>
        </Card>
    );
};

export default Reservation;
