import React, {useState} from "react";

/**
 * title, description - 1대, 도움 인원이 없는 경우
 * title2, description2 - 1대, 도움인원이 있는 경우
 * title3, description3 - 위의 케이스를 제외한 모든 경우
 */
const descriptions = {
    단순운송: {
        title: "1톤 1대 분량 단순운송",
        title2: "1톤 1대 분량 단순운송",
        title3: "1톤 {{vehicleCount}}대 분량 단순운송",
        description: "- 트럭에서 단순 상하차, 짐 고정, 운송까지 해드리는 서비스입니다.",
        description2: "- 트럭에서 단순 상하차, 짐 고정, 운송까지 해드리는 서비스입니다.",
        description3: "- 트럭에서 단순 상하차, 짐 고정, 운송까지 해드리는 서비스입니다."
    },
    일반이사: {
        title: "1톤 1대 분량 {{helperCount}}인 작업기준 고객님과 함께 하는 일반이사",
        title2: "1톤 1대 분량 {{helperCount}}인 작업 기준 일반이사",
        title3: "1톤 {{vehicleCount}}대 분량 {{helperCount}}인 작업 기준 일반이사",
        description: "- 고객님께서 짐을 모두 포장해두시면 고객님과 함께 운반, 운송, 도착지 큰짐 배치까지 도와드리는 서비스입니다.",
        description2: "- 고객님께서 짐을 모두 포장해두시고 기사님 {{helperCount}}명이 운송, 도착지 큰짐 배치까지 도와드리는 서비스입니다.",
        description3: "- 고객님께서 짐을 모두 포장해두시고 기사님 {{helperCount}}명이 운송, 도착지 큰짐 배치까지 도와드리는 서비스입니다."
    },
    반포장이사: {
        title: "1톤 1대 분량 {{helperCount}}인 작업기준 고객님과 함께 하는 반포장이사",
        title2: "1톤 1대 분량 {{helperCount}}인 작업기준 반포장이사",
        title3: "1톤 {{vehicleCount}}대 분량 {{helperCount}}인 작업기준 반포장이사",
        description: "- 이사에 필요한 자재들을 들고가서 고객님과 함께 포장, 운반, 큰짐 배치까지 도와드리는 서비스입니다.",
        description2: "- 기사님 {{helperCount}}명이 이사에 필요한 자재들을 준비하여 기사님들이 이삿짐 포장, 운반, 큰짐 배치까지 도와드리는 서비스입니다.",
        description3: "- 기사님 {{helperCount}}명이 이사에 필요한 자재들을 준비하여 기사님들이 이삿짐 포장, 운반, 큰짐 배치까지 도와드리는 서비스입니다."
    },
    포장이사: {
        title: "1톤 1대 분량 포장이사",
        title2: "1톤 1대 분량 포장이사",
        title3: "1톤 {{vehicleCount}}대 분량 포장이사",
        description:
            "- 포장인부와 정리인부가 이사에 필요한 자재들을 들고 가서 포장, 운반, 가구 배치, 도착지에서 잔짐 정리까지 해드리는 서비스입니다.",
        description2:
            "- 포장인부와 정리인부가 이사에 필요한 자재들을 들고 가서 포장, 운반, 가구 배치, 도착지에서 잔짐 정리까지 해드리는 서비스입니다.",
        description3:
            "- 포장인부와 정리인부가 이사에 필요한 자재들을 들고 가서 포장, 운반, 가구 배치, 도착지에서 잔짐 정리까지 해드리는 서비스입니다.",
    },
};

const replaceTemplateVariables = (template, variables) => {
    return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
        return variables[key] || '';
    });
};


const DispatchAmountItem = ({ moveTypeName, vehicleCount, calcEstimate, helpers, onTextChange, id }) => {
    // LOAD 및 UNLOAD 카운터 계산
    const loadCount = helpers
        ? helpers
            .filter((helper) => helper.loadUnloadType === "LOAD")
            .reduce((sum, helper) => sum + (helper.helperCount || 0), 0)
        : 0;

    const unloadCount = helpers
        ? helpers
            .filter((helper) => helper.loadUnloadType === "UNLOAD")
            .reduce((sum, helper) => sum + (helper.helperCount || 0), 0)
        : 0;

    const loadUnloadCount = helpers
    ? helpers
            .filter((helper) => helper.loadUnloadType === "LOAD_UNLOAD")
            .reduce((sum, helper) => sum + (helper.helperCount || 0), 0)
        : 0;

    // LOAD와 UNLOAD 중 최소값 계산
    const minCount = Math.min(loadCount, unloadCount);

    // helperCount 계산
    const helperCount =
        minCount + (loadCount - minCount) + (unloadCount - minCount) + loadUnloadCount + vehicleCount;

    // 동적 변수 정의
    const variables = {
        vehicleCount,
        helperCount
    };

    // 동적으로 title과 description 생성
    const dynamicTitle =
        vehicleCount === 1
            ? helpers
                ? replaceTemplateVariables(descriptions[moveTypeName]?.title2 || '', variables)
                : replaceTemplateVariables(descriptions[moveTypeName]?.title || '', variables)
            : replaceTemplateVariables(descriptions[moveTypeName]?.title3 || '', variables);

    const dynamicDescription =
        vehicleCount === 1
            ? helpers
                ? replaceTemplateVariables(descriptions[moveTypeName]?.description2 || '', variables)
                : replaceTemplateVariables(descriptions[moveTypeName]?.description || '', variables)
            : replaceTemplateVariables(descriptions[moveTypeName]?.description3 || '', variables);

    const [title, setTitle] = useState(dynamicTitle);
    const [description, setDescription] = useState(dynamicDescription);
    const [estimate, setEstimate] = useState(calcEstimate || 0);

    const handleEstimateChange = (e) => {
        const updatedEstimate = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
        setEstimate(updatedEstimate);
        onTextChange(id, 'calcEstimate', updatedEstimate);
    };

    return (
        <div className="mt-4 mb-4 text-gray-600 whitespace-pre-wrap">
            {title}
            <br />
            {description}
            <br />
            <div className="flex items-center space-x-2">
                <span>견적 금액:</span>
                <input
                    type="text"
                    value={estimate.toLocaleString()}
                    onChange={handleEstimateChange}
                    className="border rounded px-2 py-1 flex-1"
                />
                <span>원</span>
            </div>
            <br/>
        </div>
    );
};

export default DispatchAmountItem;