import React, {useEffect, useState} from "react";
import {Layout, Spin} from "antd";
import Reservation from "@component/Reservation";
import MoveInfo from "@component/MoveInfo";
import DispatchCost from "@component/DispatchCost";
import AdditionalFunctions from "@component/AdditionalFunctions";
import {useConsultantMetadata} from "@hook/useConsultant";
import {useDispatch} from "react-redux";
import {resetState} from "@/features/user/loginSlice";

const STORAGE_KEY = "reservations";

const Consultant = () => {
    const { isLoading, data: consultant, error: consultantMetaError } = useConsultantMetadata();
    const [isMoveInfoLoading, setIsMoveInfoLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [dispatchAmount, setDispatchAmount] = useState(null);

    const dispatch = useDispatch();

    // 물품
    const [items, setItems] = useState({});

    const saveToStorage = (data) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    const loadFromStorage = () => {
        const storedData = localStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : [];
    };

    useEffect(() => {
        const storedReservations = loadFromStorage();
        setReservations(storedReservations);
    }, []);

    const addReservation = (reservation) => {
        const updatedReservations = [...reservations, reservation];
        setReservations(updatedReservations);
        saveToStorage(updatedReservations);
    };

    const deleteReservation = (index) => {
        const updatedReservations = reservations.filter((_, idx) => idx !== index);
        setReservations(updatedReservations);
        saveToStorage(updatedReservations)
    };

    const loadReservation = (reservation) => {
        setSelectedReservation(reservation);
    };

    const resetReservation = () => {
        setSelectedReservation(null);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
                <Spin size="large" />
                <p className="text-lg text-gray-700">데이터를 불러오는 중입니다...</p>
            </div>
        );
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
                    reservations={reservations}
                    onDelete={deleteReservation}
                    onLoad={loadReservation}
                    onNew={resetReservation}
                />
                <MoveInfo
                    consultantData={consultant}
                    items={items}
                    setItems={setItems}
                    addReservation={addReservation}
                    initialData={selectedReservation}
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