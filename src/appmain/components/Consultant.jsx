import React, {useEffect, useState} from "react";
import {Layout, Spin} from "antd";
import Reservation from "@component/Reservation";
import MoveInfo from "@component/MoveInfo";
import DispatchCost from "@component/DispatchCost";
import AdditionalFunctions from "@component/AdditionalFunctions";
import {useConsultantMetadata} from "@hook/useConsultant";
import {useDispatch} from "react-redux";
import {resetState} from "@/features/user/loginSlice";

const Consultant = () => {
    const { isLoading, data: consultant, error: consultantMetaError } = useConsultantMetadata();
    const [isMoveInfoLoading, setIsMoveInfoLoading] = useState(true);
    const [reservationData, setReservationData] = useState(null);
    const [isNewMoveInfo, setIsNewMoveInfo] = useState(false);
    const [dispatchAmount, setDispatchAmount] = useState(null);

    const dispatch = useDispatch();

    // 물품
    const [items, setItems] = useState({});


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
                <Spin size="large" />
                <p className="text-lg text-gray-700">데이터를 불러오는 중입니다...</p>
            </div>
        );
    }

    const loadReservation = (reservation) => {
        setReservationData(null);
        setTimeout(() => {
            setReservationData(reservation);
        }, 0);
    };

    const resetMoveInfo = () => {
        setIsNewMoveInfo(true);
    }

    if (consultantMetaError) {
        //TODO - 모든인원 한번 초기화 로직 넣어서 초기화 시켜야함
        dispatch(resetState())

        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-red-500">오류가 발생했습니다. 다시 시도해주세요.</p>
            </div>
        );
    }

    return (
        <Layout className="bg-gray-100 overflow-x-auto h-screen">
            {(isMoveInfoLoading || isLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
                    <Spin size="large" />
                    <p className="text-lg text-gray-700 mt-4">데이터를 불러오는 중입니다...</p>
                </div>
            )}

            <div
                className="h-full grid gap-2 p-2 mx-auto"
                style={{
                    maxWidth: "100%",
                    gridTemplateColumns: "minmax(180px, 1fr) minmax(550px, 3fr) minmax(400px, 2fr) minmax(250px, 1.5fr)",
                }}
            >
                <Reservation
                    onLoad={loadReservation}
                    onNew={resetMoveInfo}
                />
                <MoveInfo
                    consultantData={consultant}
                    items={items}
                    setItems={setItems}
                    reservationData={reservationData}
                    isNewMoveInfo={isNewMoveInfo}
                    setIsNewMoveInfo={setIsNewMoveInfo}
                    setDispatchAmount={setDispatchAmount}
                    onReady={() => setIsMoveInfoLoading(false)}
                />
                <DispatchCost items={items} setItems={setItems} dispatchAmount={dispatchAmount} />
                <AdditionalFunctions consultantData={consultant} />
            </div>
        </Layout>
    );
};

export default Consultant;