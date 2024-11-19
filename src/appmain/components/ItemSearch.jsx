import React, {useState, useRef, useEffect} from "react";
import {Form, Input} from "antd";

const ItemSearch = ({
                        searchTerm, suggestions, collapseItems, items, setItems,
                        setSuggestions, setSearchTerm
                    }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const searchTermRef = useRef(null);
    const dropdownRef = useRef();
    const [skipChangeEvent, setSkipChangeEvent] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        const cursorPosition = e.target.selectionStart;
        setIsDropdownVisible(true);

        if (skipChangeEvent) {
            setSkipChangeEvent(false);
            return;
        }

        // 커서 앞뒤로 텍스트 분리
        const beforeCursor = value.slice(0, cursorPosition);
        const afterCursor = value.slice(cursorPosition);

        // 콤마 기준으로 텍스트 시작과 끝 위치 계산
        const start = beforeCursor.lastIndexOf(',') + 1;
        const afterCommaIndex = afterCursor.indexOf(',');
        const end = afterCommaIndex === -1 ? value.length : cursorPosition + afterCommaIndex;

        const currentItem = value.slice(start, end).trim();

        // 이름 변형 생성 함수
        const generateNameVariations = (name) => {
            const baseName = name.replace(/\(([^)]*)\)/g, '').trim().toLowerCase();
            const match = name.match(/\(([^)]*)\)/); // 괄호 안의 내용 추출
            if (match) {
                const parenthetical = match[1].trim().toLowerCase();
                return [parenthetical + baseName, baseName + `(${parenthetical})`];
            }
            return [baseName];
        };

        // 추천 항목 필터링
        if (start <= end && currentItem) {
            const filteredSuggestions = collapseItems.flatMap((category) =>
                category.subcategories.flatMap((subcategory) =>
                    subcategory.items.filter((item) => {
                        const variations = generateNameVariations(item.itemName);
                        const normalizedCurrent = currentItem.toLowerCase();

                        // 모든 입력 문자가 포함되는지 확인
                        return variations.some((variation) => {
                            const normalizedVariation = variation.toLowerCase();
                            return [...normalizedCurrent].every((char) =>
                                normalizedVariation.includes(char)
                            );
                        });
                    })
                )
            ).slice(0, 20);

            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }

        const terms = value
            .split(',')
            .map((term) => term.trim())
            .filter((term) => term);

        const updatedItems = {...items};
        const processedItemIds = new Set();

        Object.keys(updatedItems).forEach((key) => {
            if (!terms.includes(updatedItems[key].itemName)) {
                delete updatedItems[key];
            } else {
                processedItemIds.add(key);
            }
        });

        // 정규식으로 입력된 항목 파싱
        const itemPattern = /^(.+?)(?:\(([^)]*)\))?(\d*)$/;
        terms.forEach((term) => {
            const match = term.match(itemPattern);

            if (match) {
                const itemName = `${match[1].trim()}${match[2] ? `(${match[2]})` : ''}`;
                const quantity = parseInt(match[3]) || 1;

                for (let i = 0; i < collapseItems.length; i++) {
                    const category = collapseItems[i];

                    for (let j = 0; j < category.subcategories.length; j++) {
                        const subcategory = category.subcategories[j];

                        for (let k = 0; k < subcategory.items.length; k++) {
                            const item = subcategory.items[k];
                            const normalizedItemName = item.itemName.toLowerCase();

                            if (itemName === normalizedItemName && !processedItemIds.has(item.itemId.toString())) {
                                // 새로 입력된 항목만 처리
                                updatedItems[item.itemId] = {
                                    itemId: item.itemId,
                                    itemName: item.itemName,
                                    itemCount: quantity,
                                    isDisassembly: item.isDisassembly,
                                    isInstallation: item.isInstallation,
                                    requiredIsDisassembly: item.isDisassembly,
                                    requiredIsInstallation: items[item.itemId]?.requiredIsInstallation || "N",
                                };
                                processedItemIds.add(item.itemId.toString());
                                break;
                            }
                        }
                    }
                }
            }
        });

        setSelectedIndex(0);
        setItems(updatedItems);
        setSearchTerm(value);
    };

    const handleSelectItem = (item) => {
        if (!item) return;

        const textAreaElement = searchTermRef.current?.resizableTextArea?.textArea;
        if (!textAreaElement) return;

        const cursorPosition = textAreaElement.selectionStart || searchTerm.length;

        // 커서 앞뒤로 텍스트 분리
        const beforeCursor = searchTerm.slice(0, cursorPosition);
        const afterCursor = searchTerm.slice(cursorPosition);

        // 콤마 기준으로 텍스트 시작과 끝 위치 계산
        const start = beforeCursor.lastIndexOf(',') + 1;
        const afterCommaIndex = afterCursor.indexOf(',');
        const end = afterCommaIndex === -1 ? searchTerm.length : cursorPosition + afterCommaIndex;

        const beforeText = searchTerm.slice(0, start).trim();
        const afterText = searchTerm.slice(end).trim();
        const newItemName = item.itemName.trim(); // 공백 제거

        // 새로운 검색어 생성
        let updatedSearchTerm = `${beforeText} ${newItemName}, ${afterText}`.trim();

        updatedSearchTerm = updatedSearchTerm
            .replace(/,\s*,/g, ', ') // 중복된 쉼표 제거
            .replace(/\s+,/g, ',') // 쉼표 앞 공백 제거
            .replace(/,\s+/g, ', ') // 쉼표 뒤 공백 정리
            .replace(/,\s*$/, ','); // 문자열 끝에 있는 쉼표 정리

        // 기존 items 복사
        const updatedItems = {...items};

        // 선택된 아이템 이름 정규화
        const normalizeName = (name) => name.trim().toLowerCase();

        const normalizedNewItemName = normalizeName(newItemName);

        // 선택된 아이템만 처리
        const existingItem = Object.values(updatedItems).find(
            (existing) => normalizeName(existing.itemName) === normalizedNewItemName
        );

        if (!existingItem) {
            // 새로운 아이템 추가
            updatedItems[item.itemId] = {
                itemId: item.itemId,
                itemName: newItemName,
                itemCount: 1,
                isDisassembly: item.isDisassembly,
                isInstallation: item.isInstallation,
                requiredIsDisassembly: item.isDisassembly,
                requiredIsInstallation: items[item.itemId]?.requiredIsInstallation || "N",
            };
        }

        // 중복 텍스트 제거
        const terms = updatedSearchTerm
            .split(',')
            .map((term) => term.trim())
            .filter((term, index, array) => array.findIndex((t) => normalizeName(t) === normalizeName(term)) === index); // 중복 제거

        updatedSearchTerm = terms.join(', ');

        // 상태 업데이트
        setItems(updatedItems);
        setSuggestions([]);
        setSearchTerm(updatedSearchTerm);
        setSkipChangeEvent(true);
        setSelectedIndex(0);

        // 텍스트 영역 포커스 유지
        textAreaElement.focus();
    };

    const handleInputKeyDown = (e) => {
        if (isDropdownVisible && suggestions.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prevIndex) => {
                    const newIndex = Math.min(prevIndex + 1, suggestions.length - 1);
                    adjustScrollPosition(newIndex);
                    return newIndex;
                });
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prevIndex) => {
                    const newIndex = Math.max(prevIndex - 1, 0);
                    adjustScrollPosition(newIndex);
                    return newIndex;
                });
            } else if (e.key === ' ') {
                if (suggestions.length > 0) {
                    e.preventDefault();
                    const firstSuggestion = suggestions[selectedIndex];
                    const cursorPosition = e.target.selectionStart;

                    // 커서 앞뒤로 텍스트 분리
                    const beforeCursor = searchTerm.slice(0, cursorPosition);
                    const afterCursor = searchTerm.slice(cursorPosition);

                    // 콤마 기준으로 텍스트 시작과 끝 위치 계산
                    const start = beforeCursor.lastIndexOf(",") + 1;
                    const end = cursorPosition + (afterCursor.indexOf(",") === -1 ? afterCursor.length : afterCursor.indexOf(","));

                    const beforeText = searchTerm.slice(0, start).trim();
                    const afterText = searchTerm.slice(end).trim();
                    const newItemName = firstSuggestion.itemName.trim(); // 공백 제거

                    // 기존 텍스트 제거 후 새 항목 삽입
                    let updatedSearchTerm = `${beforeText} ${newItemName}, ${afterText}`.trim();

                    updatedSearchTerm = updatedSearchTerm
                        .replace(/,\s*,/g, ", ") // 중복된 쉼표 제거
                        .replace(/\s+,/g, ",") // 쉼표 앞 공백 제거
                        .replace(/,\s+/g, ", ") // 쉼표 뒤 공백 정리
                        .replace(/,\s*$/, ","); // 문자열 끝에 있는 쉼표 정리

                    // 기존 items 복사
                    const updatedItems = {...items};

                    // 이름 정규화
                    const normalizeName = (name) => name.trim().toLowerCase();

                    const normalizedNewItemName = normalizeName(newItemName);

                    // 기존 아이템 확인
                    const existingItem = Object.values(updatedItems).find(
                        (existing) => normalizeName(existing.itemName) === normalizedNewItemName
                    );

                    if (!existingItem) {
                        // 새로운 아이템 추가
                        updatedItems[firstSuggestion.itemId] = {
                            itemId: firstSuggestion.itemId,
                            itemName: newItemName,
                            itemCount: 1,
                            isDisassembly: firstSuggestion.isDisassembly,
                            isInstallation: firstSuggestion.isInstallation,
                            requiredIsDisassembly: firstSuggestion.isDisassembly,
                            requiredIsInstallation: items[firstSuggestion.itemId]?.requiredIsInstallation || "N",
                        };
                    }

                    // 중복 텍스트 제거
                    const terms = updatedSearchTerm
                        .split(",")
                        .map((term) => term.trim())
                        .filter((term, index, array) => array.findIndex((t) => normalizeName(t) === normalizeName(term)) === index);

                    updatedSearchTerm = terms.join(", ");

                    // 상태 업데이트
                    setItems(updatedItems);
                    setSuggestions([]);
                    setSearchTerm(updatedSearchTerm);
                    setSelectedIndex(0);
                    setSkipChangeEvent(true);
                }
            } else {
                setSkipChangeEvent(false);
            }
        }
    };

    const adjustScrollPosition = (index) => {
        if (dropdownRef.current) {
            const dropdownElement = dropdownRef.current;
            const optionHeight = 38;
            const maxVisibleOptions = 3;

            const scrollTop = dropdownElement.scrollTop;
            const viewportHeight = maxVisibleOptions * optionHeight;

            const optionTop = index * optionHeight;
            const optionBottom = optionTop + optionHeight;

            if (optionBottom > scrollTop + viewportHeight) {
                dropdownElement.scrollTop = optionBottom - viewportHeight;
            } else if (optionTop < scrollTop) {
                dropdownElement.scrollTop = optionTop;
            }
        }
    };

    const handleBlur = () => {
        setTimeout(() => setIsDropdownVisible(false), 100);
    };

    return (
        <Form.Item className="relative !mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">물품명:</label>
            <Input.TextArea
                ref={searchTermRef}
                placeholder="물품 이름을 입력하고 콤마(,)로 구분하세요"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onFocus={() => setIsDropdownVisible(true)}
                onBlur={handleBlur}
                autoSize={{minRows: 3, maxRows: 3}}
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {isDropdownVisible && suggestions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-[112px] overflow-y-auto z-50"
                    onMouseDown={(e) => e.preventDefault()} // Input의 onBlur 방지
                >
                    {suggestions.map((item, index) => (
                        <div
                            key={index}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectItem(item);
                                setIsDropdownVisible(false);
                            }}
                            className={`px-4 py-2 cursor-pointer ${
                                index === selectedIndex ? "bg-blue-100" : ""
                            } hover:bg-blue-50`}
                        >
                            {item.itemName}
                        </div>
                    ))}
                </div>
            )}
        </Form.Item>
    );
};

export default ItemSearch;