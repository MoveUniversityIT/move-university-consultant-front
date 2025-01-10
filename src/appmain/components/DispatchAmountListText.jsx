import React, {useEffect} from 'react';
import DispatchAmountItem from "@component/DispatchAmountItem";

const sumHelperCount = (helperPeople) => {
    const totalCount = {
        male: 0,
        female: 0
    }

    if(!helperPeople || helperPeople.length < 1) {
        return totalCount;
    }

    helperPeople.forEach(person => {
        if (person.gender === 'male') {
            totalCount.male += person.peopleCount;
        } else if (person.gender === 'female') {
            totalCount.female += person.peopleCount;
        }
    });

    return totalCount;
}

const formatHelperCountText = (helperCount) => {
    const { male, female } = helperCount;

    if (male === 0 && female === 0) {
        return "없음";
    }

    const maleText = male > 0 ? `남${male}` : "";
    const femaleText = female > 0 ? `여${female}` : "";

    return [maleText, femaleText].filter(Boolean).join(" ");
};

const DispatchAmountListText = React.forwardRef(({ consultantDataForm, dispatchAmountList, onUpdate }, ref) => {
    const loadHelperCount = sumHelperCount(consultantDataForm?.loadHelperPeople);
    const unloadHelperCount = sumHelperCount(consultantDataForm?.unloadHelperPeople);

    const loadHelperText = formatHelperCountText(loadHelperCount);
    const unloadHelperText = formatHelperCountText(unloadHelperCount);

    return (
        <div ref={ref}>
            {Object.keys(dispatchAmountList).length > 0 && (
                <>
                    <div className="mt-4 mb-4 text-gray-600 whitespace-pre-wrap">
                        📦이사 견적 총 정리 끝냈습니다! 🚚<br />
                        <br />
                        =============================================<br />
                        <br />
                        도로 거리: {consultantDataForm?.distance ?? 0}km, 출발지: [{consultantDataForm?.loadMethodName}] [도움:
                        {loadHelperText}], 도착지: [{consultantDataForm?.unloadMethodName}] [도움: {unloadHelperText}] 기준으로 안내해드리겠습니다.
                        <br />
                        <br />
                        =============================================<br />
                        <br />
                    </div>

                    {Object.entries(dispatchAmountList).map(([index, dispatchAmount]) =>
                        Array.isArray(dispatchAmount)
                            ? dispatchAmount.map((amount, idx) => (
                                <DispatchAmountItem
                                    key={`${index}-${idx}`}
                                    id={`${index}-${idx}`}
                                    moveTypeName={amount.moveTypeName}
                                    vehicleCount={amount.vehicleCount}
                                    calcEstimate={amount.calcEstimate}
                                    helpers={amount.helpers}
                                    onTextChange={onUpdate}
                                />
                            ))
                            : null
                    )}

                    <div className="text-gray-600 whitespace-pre-wrap">
                        =============================================<br />
                        🙏고객님께서 작성해주신 정보 기반으로 이사대학 자체 Ai 프로그램을 사용하여 고객님께서 필요 하신
                        서비스와 운송동선을 최적화하여 거품뺀 가격으로 견적드렸습니다. 세부적인 이사 내용은 친절히 상담도와드리고
                        고객님 니즈에 맞는 정확한 서비스로 보답하겠습니다.🙏<br />
                        <br />
                        🛻만약에 가격조정, 날짜조정이나 추가 서비스를 원하시는 부분이 있다면 언제든 연락주시면 가능한선에서
                        최선을 다해 맞춰 드리겠습니다!<br />
                        <br />
                        🎓️이사대학 올인원 서비스를 통한 이사 외 모든 통합 서비스 (입주청소, 인터넷, 티비설치, 가전렌탈, 에어컨
                        설치 등)도 전국 최저가보다 저렴한 이벤트 가격으로 상담 가능하십니다!<br />
                        <br />
                        ☔️우천시 방수포를 덮고 진행하며 차량 변경시 추가요금이 발생할 수 있습니다. 특수차량(윙바디,호루,탑차)를
                        원하시면 꼭 배차전에 미리 말씀해주셔야 금액안내 후에 배차가능합니다.<br />
                        <br />
                        ★만약에 타업체와 계약을 하고 싶다고 하시더라도 저희쪽으로 마지막 문의를 주시면 더 좋은 가격 혹은
                        서비스 드릴 수 있는지 다시 한번 확인해보겠습니다 감사합니다★<br />
                        <br />
                    </div>
                </>
            )}
        </div>
    );
});

export default DispatchAmountListText;
