import React from 'react';

const DispatchAmountListText = ({consultantDataForm, dispatchAmountList}) => {
    const handleCopy = (e) => {
        console.log(e.target.textContent);
    }

    return (
        <div onClick={handleCopy}>
            {Object.keys(dispatchAmountList).length > 0 && (
                <>
                    <div className="mt-4 mb-4 text-gray-600 whitespace-pre-wrap">
                        📦이사 견적 총 정리 끝냈습니다! 🚚<br/>
                        =============================================<br/>
                        도로 거리: {consultantDataForm.distance ?? 0}km, 출발지: [{consultantDataForm?.loadMethodName}] [도움
                        :없음], 도착지: [{consultantDataForm?.unloadMethodName}] [도움 :없음] 기준으로 안내해드리겠습니다.<br/>
                        =============================================<br/>
                    </div>

                    {Object.entries(dispatchAmountList).map(([index, dispatchAmount]) => (
                        <div key={index} className="text-gray-600">
                            {Array.isArray(dispatchAmount) &&
                                dispatchAmount.map((amount, idx) => (
                                    <div key={idx}>
                                        {amount.vehicleCount === 1 && (
                                            <>
                                                {amount.moveTypeName === '단순운송' && (
                                                    <>
                                                        <span>{'<1톤 ' + amount.vehicleCount + '대 분량 고객님과 함께 하는 단순운송>'}</span>
                                                        <br/>
                                                        <span>{'- 트럭에서 상하차, 짐 고정만 해드리는 서비스입니다'}</span>
                                                        <div className="font-semibold">
                                                            견적 금액:{" "}
                                                            <span className="text-blue-600">
                                                                {amount.calcEstimate?.toLocaleString()}원
                                                            </span>
                                                        </div>
                                                        <br />
                                                    </>
                                                )}
                                                {amount.moveTypeName === '일반이사' && !('helpers' in amount) && (
                                                    <>
                                                        <span>{'<1톤 ' + amount.vehicleCount + '대 분량 고객님과 함께 하는 일반이사>'}</span>
                                                        <br/>
                                                        <span>{'- 고객님께서 짐을 모두 포장해두시고 고객님과 함께 운반 운송, 도착지 큰짐 배치까지 도와드리는 서비스입니다'}</span>
                                                        <div className="font-semibold">
                                                            견적 금액:{" "}
                                                            <span className="text-blue-600">
                                                                {amount.calcEstimate?.toLocaleString()}원
                                                            </span>
                                                        </div>
                                                        <br/>
                                                    </>
                                                )}
                                                {amount.moveTypeName === '일반이사' && ('helpers' in amount) && (
                                                    <>
                                                        <span>{'<1톤 ' + amount.vehicleCount + '대 분량 2인 일반이사>'}</span>
                                                        <br/>
                                                        <span>{'- 고객님께서 짐을 모두 포장해두시고 기사님들 두분이 가셔서 운송, 도착지 큰짐 배치까지 도와드리는 서비스입니다'}</span>
                                                        <div className="font-semibold">
                                                            견적 금액:{" "}
                                                            <span className="text-blue-600">
                                                                {amount.calcEstimate?.toLocaleString()}원
                                                            </span>
                                                        </div>
                                                        <br/>
                                                    </>
                                                )}
                                                {amount.moveTypeName === '반포장이사' && !('helpers' in amount) && (
                                                    <>
                                                        <span>{'<1톤 ' + amount.vehicleCount + '대 분량 고객님과 함께 하는 반포장이사>'}</span>
                                                        <br/>
                                                        <span>{'- 이사에 필요한 자재들을 들고가서 고객님과 함께 포장, 운반, 큰짐 배치까지 도와드리는 함께하는 이사 서비스'}</span>
                                                        <div className="font-semibold">
                                                            견적 금액:{" "}
                                                            <span className="text-blue-600">
                                                                {amount.calcEstimate?.toLocaleString()}원
                                                            </span>
                                                        </div>
                                                        <br/>
                                                    </>
                                                )}
                                                {amount.moveTypeName === '반포장이사' && ('helpers' in amount) && (
                                                    <>
                                                        <span>{'<1톤 ' + amount.vehicleCount + '대 분량 고객님과 함께 하는 반포장이사>'}</span>
                                                        <br/>
                                                        <span>{'- 이사에 필요한 자재들을 들고가서 기사님들 두분이 가셔서 포장, 운반, 큰짐 배치까지 도와드리는 함께하는 이사 서비스'}</span>
                                                        <div className="font-semibold">
                                                            견적 금액:{" "}
                                                            <span className="text-blue-600">
                                                                {amount.calcEstimate?.toLocaleString()}원
                                                            </span>
                                                        </div>
                                                        <br/>
                                                    </>
                                                )}
                                                {amount.moveTypeName === '포장이사' && !('helpers' in amount) && (
                                                    <>
                                                        <span>{'<1톤 ' + amount.vehicleCount + '대 분량 고객님과 함께 하는 포장이사>'}</span>
                                                        <br/>
                                                        <span>{'- 포장인부와 정리인부가 이사에 필요한 자재들을 들고 가서 포장, 운반, 가구 배치, 도착지에서 잔짐 정리, 간단한 청소까지 해드리는 서비스'}</span>
                                                        <div className="font-semibold">
                                                            견적 금액:{" "}
                                                            <span className="text-blue-600">
                                                                {amount.calcEstimate?.toLocaleString()}원
                                                            </span>
                                                        </div>
                                                        <br/>
                                                    </>
                                                )}
                                                {amount.moveTypeName === '포장이사' && ('helpers' in amount) && (
                                                    <>
                                                        <span>{'<1톤 ' + amount.vehicleCount + '대 분량 2인 포장이사>'}</span>
                                                        <br/>
                                                        <span>{'- 포장인부와 정리인부가 이사에 필요한 자재들을 들고 가서 포장, 운반, 가구 배치, 도착지에서 잔짐 정리, 간단한 청소까지 해드리는 서비스'}</span>
                                                        <div className="font-semibold">
                                                            견적 금액:{" "}
                                                            <span className="text-blue-600">
                                                                {amount.calcEstimate?.toLocaleString()}원
                                                            </span>
                                                        </div>
                                                        <br/>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {amount.vehicleCount !== 1 && (
                                            <>
                                                {amount.moveTypeName === '단순운송' && (
                                                    <>
                                                        <span>{'<1톤 ' + amount.vehicleCount + '대 분량 고객님과 함께 하는 단순운송>'}</span>
                                                        <br/>
                                                        <span>{'- 트럭에서 상하차, 짐 고정만 해드리는 서비스입니다'}</span>
                                                        <div className="font-semibold">
                                                            견적 금액:{" "}
                                                            <span className="text-blue-600">
                                                                {amount.calcEstimate?.toLocaleString()}원
                                                            </span>
                                                        </div>
                                                        <br />
                                                    </>
                                                )}
                                                {amount.moveTypeName === '일반이사' && (
                                                    <>
                                                        <span>{'<1톤 ' + amount.vehicleCount + '대 분량 ' + amount.vehicleCount + '인 일반이사>'}</span>
                                                        <br/>
                                                        <span>{'- 고객님께서 짐을 모두 포장해두시고 기사님들이 가셔서 운송, 도착지 큰짐 배치까지 도와드리는 서비스입니다'}</span>
                                                        <div className="font-semibold">
                                                            견적 금액:{" "}
                                                            <span className="text-blue-600">
                                                                {amount.calcEstimate?.toLocaleString()}원
                                                            </span>
                                                        </div>
                                                        <br/>
                                                    </>
                                                )}
                                                {amount.moveTypeName === '반포장이사' && (
                                                    <>
                                                        <span>{'<1톤 ' + amount.vehicleCount + '대 분량 고객님과 함께 하는 반포장이사>'}</span>
                                                        <br/>
                                                        <span>{'- 이사에 필요한 자재들을 들고가서 기사님들 두분이 가셔서 포장, 운반, 큰짐 배치까지 도와드리는 함께하는 이사 서비스'}</span>
                                                        <div className="font-semibold">
                                                            견적 금액:{" "}
                                                            <span className="text-blue-600">
                                                                {amount.calcEstimate?.toLocaleString()}원
                                                            </span>
                                                        </div>
                                                        <br/>
                                                    </>
                                                )}
                                                {amount.moveTypeName === '포장이사' && (
                                                    <>
                                                        <span>{'<1톤 ' + amount.vehicleCount + '대 분량 ' + amount.vehicleCount + '인 포장이사>'}</span>
                                                        <br/>
                                                        <span>{'- 포장인부와 정리인부가 이사에 필요한 자재들을 들고 가서 포장, 운반, 가구 배치, 도착지에서 잔짐 정리, 간단한 청소까지 해드리는 서비스'}</span>
                                                        <div className="font-semibold">
                                                            견적 금액:{" "}
                                                            <span className="text-blue-600">
                                                                {amount.calcEstimate?.toLocaleString()}원
                                                            </span>
                                                        </div>
                                                        <br/>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                        </div>
                    ))}
                    <div className="text-gray-600 whitespace-pre-wrap">
                        =============================================<br/>

                        🙏고객님께서 작성해주신 정보 기반으로 이사대학 자체 Ai 프로그램을 사용하여 고객님께서 필요 하신 서비스와 운송동선을 최적화하여 거품뺀 가격으로 견적드렸습니다. 세부적인
                        이사 내용은 친절히 상담도와드리고 고객님 니즈에 맞는 정확한 서비스로 보답하겠습니다.🙏<br/><br/>

                        🛻만약에 가격조정, 날짜조정이나 추가 서비스를 원하시는 부분이 있다면 언제든 연락주시면 가능한선에서 최선을 다해 맞춰 드리겠습니다!<br/><br/>

                        🎓️이사대학 올인원 서비스를 통한 이사 외 모든 통합 서비스 (입주청소, 인터넷, 티비설치, 가전렌탈, 에어컨 설치 등)도 전국 최저가보다 저렴한 이벤트 가격으로 상담
                        가능하십니다!<br/><br/>

                        ☔️우천시 방수포를 덮고 진행하며 차량 변경시 추가요금이 발생할 수 있습니다. 특수차량(윙바디,호루,탑차)를 원하시면 꼭 배차전에 미리 말씀해주셔야 금액안내 후에
                        배차가능합니다.<br/><br/>

                        ★만약에 타업체와 계약을 하고 싶다고 하시더라도 저희쪽으로 마지막 문의를 주시면 더 좋은 가격 혹은 서비스 드릴 수 있는지 다시 한번 확인해보겠습니다
                        감사합니다★<br/><br/>

                        1톤 한대 일반이사, 반포장이사의 경우는, 1인, 2인 금액 두가지로 안내 / 포장이사의 경우는 이모1을 추가한 상태로 안내.<br/><br/>
                    </div>
                </>
            )}
        </div>
    )
}

export default DispatchAmountListText;