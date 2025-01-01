import React, {useEffect, useState} from "react";
import {Button, Card, Input, message, Modal} from "antd";
import {useImageQuery} from "@hook/useConsultant";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import PictureModal from "@component/modal/picture/PictureModal";
import {
    BankOutlined,
    FileOutlined,
    InsuranceOutlined,
    MessageOutlined,
    PictureOutlined,
    TableOutlined
} from "@ant-design/icons";

const AdditionalFunctions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isInputModalVisible, setIsInputModalVisible] = useState(false);
    const [isPictureVisible, setIsPictureVisible] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [modalTitle, setModalTitle] = useState("");
    const [downloadFileName, setDownloadFileName] = useState("");
    const [imageName, setImageName] = useState(null);
    const [totalAmount, setTotalAmount] = useState("");
    const [contractDeposit, setContractDeposit] = useState("");

    const {data: imageUrl} = useImageQuery(imageName, !!imageName);

    const handlePaymentText = () => {
        setIsInputModalVisible(true);
    };

    const handleInputModalOk = async () => {
        if (!totalAmount || isNaN(totalAmount)) {
            message.error("유효한 총액을 입력하세요.");
            return;
        }
        if (!contractDeposit || isNaN(contractDeposit)) {
            message.error("유효한 계약금을 입력하세요.");
            return;
        }

        const formatAmount = (amount) => {
            const [man, cheon] = amount.split(".");
            const manText = man ? `${parseInt(man, 10)}만` : "";
            const cheonText = cheon ? `${parseInt(cheon, 10)}천` : "";
            return `${manText}${cheonText}원`;
        };

        const totalAmountFormatted = formatAmount(totalAmount);
        const contractDepositFormatted = formatAmount(contractDeposit);

        const text = `송부드린 견적, 계약서 확인해주시고 동의하시면

1005-504-674760 우리은행 (주)이사대학

총액 ${totalAmountFormatted} 중 이사 중개 계약금 ${contractDepositFormatted} 입금해주시고

잔금은 하차당일 모든 화물이 안전하게 잘 왔는지 확인하신 후
현장에서 치뤄주시면 되십니다!

입금 후 입금자명 말씀해주시면 확인후에 계약 확정나십니다!`;

        try {
            await navigator.clipboard.writeText(text);
            message.success("텍스트가 복사되었습니다!");
        } catch (error) {
            console.error("복사 실패:", error);
            message.error("복사하는 중 문제가 발생했습니다.");
        }

        setIsInputModalVisible(false);
    };

    const handleInputModalCancel = () => {
        setIsInputModalVisible(false);
        setTotalAmount("");
        setContractDeposit("");
    };

    const handleShowImage = async (imageName, title) => {
        setImageName(imageName);
        setModalTitle(title);
        setIsModalVisible(true);
        setDownloadFileName(title + ".jpeg");
    };

    const handleCloseModal = () => {
        setTotalAmount("")
        setContractDeposit("")
        setImageName(null);
        setIsModalVisible(false);
        setImageSrc(null);
        setModalTitle("");
        setDownloadFileName("");
    };

    const handleDownloadImage = () => {
        if (!imageSrc) return;

        const link = document.createElement("a");
        link.href = imageSrc;
        link.download = downloadFileName;
        link.click();
    };

    const handleShowPicture = () => {
        setIsPictureVisible(true);
    }

    const handlePictureModalCancel = () => {
        setIsPictureVisible(false);
    }

    useEffect(() => {
        setImageSrc(imageUrl);
    }, [imageUrl]);

    return (
        <Card title={
            <div className="flex justify-between items-center">
                <span>추가 기능</span>
            </div>
        }
              className="shadow-md rounded-md h-full"
        >
            <div className="grid grid-cols-1 gap-4">
                <Button
                    className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-transform transform hover:scale-105 duration-300"
                    icon={<MessageOutlined/>}
                    onClick={handlePaymentText}>
                    계약금 문자
                </Button>
                <Button
                    className="px-5 py-3 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-green-500 hover:to-teal-600 transition-transform transform hover:scale-105 duration-300"
                    icon={<FileOutlined/>}
                    onClick={() => handleShowImage("business_license", "사업자 등록증")}>
                    사업자 등록증
                </Button>
                <Button
                    className="px-5 py-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-purple-500 hover:to-purple-700 transition-transform transform hover:scale-105 duration-300"
                    icon={<BankOutlined/>}
                    onClick={() => handleShowImage("moveuniversity_account", "통장")}>
                    통장
                </Button>
                <Button
                    className="px-5 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-yellow-500 hover:to-orange-600 transition-transform transform hover:scale-105 duration-300"
                    icon={<InsuranceOutlined/>}
                    onClick={() => handleShowImage("insurance_certification", "화물보험")}>
                    화물보험
                </Button>
                <Button
                    className="px-5 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-red-500 hover:to-pink-600 transition-transform transform hover:scale-105 duration-300"
                    icon={<TableOutlined/>}
                    onClick={() => handleShowImage("ladder_price", "사다리 요금표")}>
                    사다리 요금표
                </Button>
                {/*<Button*/}
                {/*    className="px-5 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-gray-500 hover:to-gray-700 transition-transform transform hover:scale-105 duration-300"*/}
                {/*    icon={<PictureOutlined/>}*/}
                {/*    onClick={handleShowPicture}>*/}
                {/*    이미지/녹음*/}
                {/*</Button>*/}
            </div>

            <Modal
                title="총액 및 계약금 입력"
                open={isInputModalVisible}
                onOk={handleInputModalOk}
                onCancel={handleInputModalCancel}
                okText="확인"
                cancelText="취소"
                centered
                styles={{
                    body: {padding: '20px'},
                }}
            >
                <div
                    className="flex flex-col gap-4"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleInputModalOk();
                        }
                    }}
                >
                    <div>
                        <p className="mb-2 text-lg font-semibold text-gray-700">총액을 입력하세요:</p>
                        <Input
                            placeholder="예: 100 또는 99.5"
                            value={totalAmount}
                            onChange={(e) => setTotalAmount(e.target.value)}
                            type="number"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <p className="mb-2 text-lg font-semibold text-gray-700">계약금을 입력하세요:</p>
                        <Input
                            placeholder="예: 50 또는 49.5"
                            value={contractDeposit}
                            onChange={(e) => setContractDeposit(e.target.value)}
                            type="number"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </Modal>


            <Modal
                title={modalTitle}
                open={isModalVisible}
                footer={[
                    <Button key="download" type="primary" onClick={handleDownloadImage}>
                        다운로드
                    </Button>,
                    <Button key="cancel" onClick={handleCloseModal}>
                        닫기
                    </Button>,
                ]}
                onCancel={handleCloseModal}
            >
                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt={modalTitle}
                        style={{maxWidth: "100%", maxHeight: "70vh", objectFit: "contain"}}
                    />
                )}
            </Modal>

            {isPictureVisible && (
                <PictureModal isPictureVisible={isPictureVisible} handlePictureModalCancel={handlePictureModalCancel}/>
            )}
        </Card>
    );
};

export default AdditionalFunctions;
