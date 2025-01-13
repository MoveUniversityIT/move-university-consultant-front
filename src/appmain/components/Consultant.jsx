import React, {useEffect, useState} from "react";
import {Button, message, Spin} from "antd";
import Reservation from "@component/Reservation";
import MoveInfo from "@component/MoveInfo";
import DispatchCost from "@component/DispatchCost";
import AdditionalFunctions from "@component/AdditionalFunctions";
import {useConsultantMetadata} from "@hook/useConsultant";
import {useDispatch, useSelector} from "react-redux";
import {useReservation} from "@hook/useUser";
import AdminDispatchPrice from "@component/admin/AdminDispatchPrice";
import {hasAccess} from "@/appcore/utils/utils";

const Consultant = () => {
    const userId = useSelector((state) => state.login.userId);
    const {isLoading, data: consultant, error: consultantMetaError} = useConsultantMetadata(userId);
    const [isMoveInfoLoading, setIsMoveInfoLoading] = useState(true);
    const [reservationData, setReservationData] = useState(null);
    const [isNewMoveInfo, setIsNewMoveInfo] = useState(false);
    const [dispatchAmount, setDispatchAmount] = useState(null);
    const [isDispatchAmount, setIsDispatchAmount] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState({key: 1, value: '현금'});
    const [searchItemTerm, setSearchItemTerm] = useState('');
    const [unregisterWord, setUnregisterWord] = useState([]);

    const [isCollapsed, setIsCollapsed] = useState(true);
    const roles = useSelector((state) => state.login.roles);

    const hasAdminAccess = hasAccess(roles, ["ROLE_ADMIN"]);

    const dispatch = useDispatch();
    const {data: reservations} = useReservation(userId);

    // 물품
    const [items, setItems] = useState({});
    const [selectUserId, setSelectUserId] = useState(null);
    const [selectReservationList, setSelectReservationList] = useState([]);

    const [estimate, setEstimate] = useState({
        baseCost: dispatchAmount?.estimatePrice?.baseCost || 0,
        deposit: dispatchAmount?.estimatePrice?.deposit || 0,
        minDeposit: dispatchAmount?.estimatePrice?.minDeposit || 0,
        maxDeposit: dispatchAmount?.estimatePrice?.maxDeposit || 0,
        estimatePrice: dispatchAmount?.estimatePrice?.estimatePrice || 0,
        minEstimatePrice: dispatchAmount?.estimatePrice?.minEstimatePrice || 0,
        maxEstimatePrice: dispatchAmount?.estimatePrice?.maxEstimatePrice || 0,
        totalCalcPrice: dispatchAmount?.totalCalcPrice || 0,
    });

    const [sliderValue, setSliderValue] = useState(5);
    const [depositPrice, setDepositPrice] = useState(estimate.minDeposit);
    const [estimatePrice, setEstimatePrice] = useState(estimate.minEstimatePrice);
    const [surtax, setSurtax] = useState(0);
    const [consultantDataForm, setConsultantDataForm] = useState(null);
    const [dispatchCosts, setDispatchCosts] = useState({})
    const [moveTypeCheckBoxes, setMoveTypeCheckBoxes] = useState({});
    const [dokchaPrice, setDokchaPrice] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setSelectUserId(userId);
    }, [userId]);

    useEffect(() => {
        setSelectReservationList(reservations);
    }, [reservations]);

    useEffect(() => {

    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
                <Spin size="large"/>
                <p className="text-lg text-gray-700">데이터를 불러오는 중입니다...</p>
            </div>
        );
    }

    const loadReservation = (reservation) => {
        setReservationData({...reservation});
    };

    const resetMoveInfo = () => {
        setIsNewMoveInfo(true);
    }

    if (consultantMetaError) {
        // message.open({
        //     type: "error",
        //     content: (
        //         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        //             <span>로그인 정보가 정상적이지 않습니다. 로그아웃 후 다시 시도해주세요.</span>
        //             <Button
        //                 type="text"
        //                 className="px-2 py-1 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-200"
        //                 onClick={() => message.destroy("logoutError")}
        //             >
        //                 닫기
        //             </Button>
        //         </div>
        //     ),
        //     key: "logoutError",
        //     duration: 0, // 자동 닫기 비활성화
        //     style: {
        //         marginTop: "20px",
        //         zIndex: 1000,
        //     },
        // });
    }

    return (
        <div className="pt-14 relative">
            <div
                className={`h-full grid gap-2 p-2 mx-auto overflow-x-auto ${isModalOpen ? '!mr-[650px]' : ''}`}
                style={{
                    marginRight: isCollapsed ? "0" : "650px",
                    gridTemplateColumns: "minmax(240px, 1.2fr) minmax(550px, 2.5fr) minmax(400px, 2.5fr) minmax(190px, 1.3fr)",
                }}
            >
                <Reservation
                    onLoad={loadReservation}
                    onNew={resetMoveInfo}
                    reservations={selectReservationList}
                />
                <MoveInfo
                    consultantData={consultant}
                    items={items}
                    setItems={setItems}
                    reservationData={reservationData}
                    isNewMoveInfo={isNewMoveInfo}
                    setIsNewMoveInfo={setIsNewMoveInfo}
                    setDispatchAmount={setDispatchAmount}
                    setIsDispatchAmount={setIsDispatchAmount}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    onReady={() => setIsMoveInfoLoading(false)}
                    estimatePrice={estimatePrice}
                    depositPrice={depositPrice}
                    sliderValue={sliderValue}
                    setSliderValue={setSliderValue}
                    setReservationData={setReservationData}
                    searchItemTerm={searchItemTerm}
                    setSearchItemTerm={setSearchItemTerm}
                    unregisterWord={unregisterWord}
                    setUnregisterWord={setUnregisterWord}
                    consultantDataForm={consultantDataForm}
                    setConsultantDataForm={setConsultantDataForm}
                    setDispatchCosts={setDispatchCosts}
                    moveTypeCheckBoxes={moveTypeCheckBoxes}
                    isFormValid={isFormValid}
                    setIsFormValid={setIsFormValid}
                    setDokchaPrice={setDokchaPrice}
                />
                <DispatchCost items={items}
                              setItems={setItems}
                              dispatchAmount={dispatchAmount}
                              isDispatchAmount={isDispatchAmount}
                              paymentMethod={paymentMethod}
                              estimate={estimate}
                              setEstimate={setEstimate}
                              sliderValue={sliderValue}
                              setSliderValue={setSliderValue}
                              depositPrice={depositPrice}
                              setDepositPrice={setDepositPrice}
                              estimatePrice={estimatePrice}
                              setEstimatePrice={setEstimatePrice}
                              surtax={surtax}
                              setSurtax={setSurtax}
                              estimateLever={reservationData?.estimateLever}
                              searchItemTerm={searchItemTerm}
                              setSearchItemTerm={setSearchItemTerm}
                              dispatchCosts={dispatchCosts}
                              moveTypeCheckBoxes={moveTypeCheckBoxes}
                              setMoveTypeCheckBoxes={setMoveTypeCheckBoxes}
                              consultantDataForm={consultantDataForm}
                              setConsultantDataForm={setConsultantDataForm}
                              isFormValid={isFormValid}
                              setIsFormValid={setIsFormValid}
                              dokchaPrice={dokchaPrice}
                              isModalOpen={isModalOpen}
                              showModal={showModal}
                              closeModal={closeModal}
                />
                <AdditionalFunctions consultantData={consultant} items={items} paymentMethod={paymentMethod}/>

                {hasAdminAccess && (
                    <>
                        <div
                            className={`fixed top-0 right-0 h-full z-50 bg-white shadow-lg transform transition-transform duration-300 ${
                                isCollapsed ? "translate-x-full" : "translate-x-0"
                            }`}
                            style={{width: "650px"}}
                        >
                            <div className="flex justify-between items-center bg-gray-200 p-4">
                                <h4 className="text-gray-700">배차 금액 상세 정보</h4>
                            </div>

                            <div className="flex flex-col h-full">
                                <div className="flex-grow overflow-y-auto p-4">
                                    <AdminDispatchPrice
                                        data={dispatchAmount}
                                        isLoadingConsultantMutate={isDispatchAmount}
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            className={`fixed top-1/2 transform -translate-y-1/2 z-50 bg-gray-500 text-white px-2 py-4 cursor-pointer rounded-l-lg transition-all duration-300`}
                            style={{
                                right: isCollapsed ? "0" : "650px",
                            }}
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? "<<" : ">>"}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Consultant;