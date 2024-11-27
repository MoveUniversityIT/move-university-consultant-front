import React, {useRef, useState} from 'react';
import {Form, Input} from "antd";

const SpecialItemSearch = ({
                               searchSpecialItemTerm, setSearchSpecialItemTerm,
                               specialItemSuggestions, setSpecialItemSuggestions,
                               collapseSpecialItems, specialItems, setSpecialItems, tabIndex
                           }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [skipChangeEvent, setSkipChangeEvent] = useState(false);
    const searchTermRef = useRef(null);
    const dropdownRef = useRef();

    const normalizeString = (str) => str.replace(/[\d()]/g, "").trim().toLowerCase();

    const handleSpecialInputChange = (e) => {
        const value = e.target.value;
        const cursorPosition = e.target.selectionStart;
        setIsDropdownVisible(true);

        if (skipChangeEvent) {
            setSkipChangeEvent(false);
            return;
        }

        const beforeCursor = value.slice(0, cursorPosition);
        const afterCursor = value.slice(cursorPosition);

        const start = beforeCursor.lastIndexOf(",") + 1;
        const afterCommaIndex = afterCursor.indexOf(",");
        const end = afterCommaIndex === -1 ? value.length : cursorPosition + afterCommaIndex;

        const currentItem = value.slice(start, end).trim();

        if (start <= end && currentItem) {
            const normalizeString = (str) => str.replace(/[\d()]/g, "").trim().toLowerCase();

            const normalizedCurrent = normalizeString(currentItem);

            const keywords = normalizedCurrent.split(/\s+/).filter((keyword) => keyword);

            let filteredSpecialSuggestions = collapseSpecialItems.filter((specialItem) => {
                const normalizedSpecialName = normalizeString(specialItem.specialItemName);

                return keywords.every((keyword) => normalizedSpecialName.includes(keyword));
            });

            filteredSpecialSuggestions = filteredSpecialSuggestions.map((specialItem) => {
                const normalizedSpecialName = normalizeString(specialItem.specialItemName);

                const matchScore = keywords.reduce((score, keyword) => {
                    if (normalizedSpecialName.includes(keyword)) {
                        score += keyword.length;
                    }
                    return score;
                }, 0);

                return { ...specialItem, matchScore };
            });

            filteredSpecialSuggestions = filteredSpecialSuggestions.sort((a, b) => b.matchScore - a.matchScore);

            if (filteredSpecialSuggestions.length > 0) {
                const singleSuggestion = filteredSpecialSuggestions[0];
                const singleSuggestionName = singleSuggestion.specialItemName.toLowerCase();

                const normalizedWithoutTrailingNumbers = currentItem.replace(/\d+$/, "").trim().toLowerCase();

                if (singleSuggestionName === normalizedWithoutTrailingNumbers) {
                    filteredSpecialSuggestions = [];
                }
            }

            setSpecialItemSuggestions(filteredSpecialSuggestions.slice(0, 20));
        } else {
            setSpecialItemSuggestions([]);
        }

        const terms = value
            .split(",")
            .map((term) => term.trim())
            .filter((term) => term);

        const updatedSpecialItems = { ...specialItems };
        const processedSpecialItemIds = new Set();

        terms.forEach((term) => {
            const match = term.match(/^(.+?)(\d*)$/);

            if (match) {
                const specialItemName = match[1].trim();
                const quantity = parseInt(match[2]) || 1;

                let isRegistered = false;

                for (let i = 0; i < collapseSpecialItems.length; i++) {
                    const specialItem = collapseSpecialItems[i];
                    const normalizedSpecialName = normalizeString(specialItem.specialItemName);

                    if (normalizeString(specialItemName) === normalizedSpecialName) {
                        if (!updatedSpecialItems[specialItem.specialItemName]) {
                            updatedSpecialItems[specialItem.specialItemName] = {
                                specialItemId: specialItem.specialItemId,
                                specialItemName: specialItem.specialItemName,
                                specialItemCount: quantity,
                            };
                        } else {
                            updatedSpecialItems[specialItem.specialItemName] = {
                                ...updatedSpecialItems[specialItem.specialItemName],
                                specialItemCount: quantity,
                            };
                        }
                        processedSpecialItemIds.add(specialItem.specialItemName.toString());
                        isRegistered = true;
                        break;
                    }
                }

                if (!isRegistered) {
                    // unregisteredItems.push(term);
                }
            }
        });

        setSelectedIndex(0);
        setSpecialItems(updatedSpecialItems);
        setSearchSpecialItemTerm(value);
    };

    const handleSelectSpecialItem = (specialItem) => {
        if (!specialItem) return;

        const textAreaElement = searchTermRef.current?.resizableTextArea?.textArea;
        if (!textAreaElement) return;

        const cursorPosition = textAreaElement.selectionStart || searchSpecialItemTerm.length;

        // 커서 앞뒤로 텍스트 분리
        const beforeCursor = searchSpecialItemTerm.slice(0, cursorPosition);
        const afterCursor = searchSpecialItemTerm.slice(cursorPosition);

        // 콤마 기준으로 텍스트 시작과 끝 위치 계산
        const start = beforeCursor.lastIndexOf(',') + 1;
        const afterCommaIndex = afterCursor.indexOf(',');
        const end = afterCommaIndex === -1 ? searchSpecialItemTerm.length : cursorPosition + afterCommaIndex;

        const beforeText = searchSpecialItemTerm.slice(0, start).trim();
        const afterText = searchSpecialItemTerm.slice(end).trim();
        const newItemName = specialItem.specialItemName.trim();

        // 새로운 검색어 생성
        let updatedSearchTerm = `${beforeText} ${newItemName}, ${afterText}`.trim();

        updatedSearchTerm = updatedSearchTerm
            .replace(/,\s*,/g, ', ')
            .replace(/\s+,/g, ',')
            .replace(/,\s+/g, ', ')
            .replace(/,\s*$/, ',');

        // 기존 items 복사
        const updatedSpecialItems = {...specialItems};

        // 선택된 아이템 이름 정규화
        const normalizeName = (name) => name.trim().toLowerCase();

        const normalizedNewItemName = normalizeName(newItemName);

        // 선택된 아이템만 처리
        const existingSpecialItem = Object.values(updatedSpecialItems).find(
            (existing) => normalizeName(existing.specialItemName) === normalizedNewItemName
        );

        if (!existingSpecialItem) {
            // 새로운 아이템 추가
            updatedSpecialItems[specialItem.specialItemName] = {
                specialItemId: specialItem.specialItemId,
                specialItemName: newItemName,
                specialItemCount: 1,
            };
        }

        const terms = updatedSearchTerm
            .split(',')
            .map((term) => term.trim())
            .filter((term, index, array) => array.findIndex((t) => normalizeName(t) === normalizeName(term)) === index);

        updatedSearchTerm = terms.join(', ');

        setSpecialItems(updatedSpecialItems);
        setSpecialItemSuggestions([]);
        setSearchSpecialItemTerm(updatedSearchTerm);
        setSkipChangeEvent(true);
        setSelectedIndex(0);

        textAreaElement.focus();
    };

    const handleInputKeyDown = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {

        }else if (isDropdownVisible && specialItemSuggestions.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prevIndex) => {
                    const newIndex = Math.min(prevIndex + 1, specialItemSuggestions.length - 1);
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
            } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();

                if (specialItemSuggestions.length > 0) {
                    const firstSuggestion = specialItemSuggestions[selectedIndex];
                    const cursorPosition = e.target.selectionStart;

                    const beforeCursor = searchSpecialItemTerm.slice(0, cursorPosition);
                    const afterCursor = searchSpecialItemTerm.slice(cursorPosition);

                    const start = beforeCursor.lastIndexOf(",") + 1;
                    const end = cursorPosition + (afterCursor.indexOf(",") === -1 ? afterCursor.length : afterCursor.indexOf(","));

                    const beforeText = searchSpecialItemTerm.slice(0, start).trim();
                    const afterText = searchSpecialItemTerm.slice(end).trim();
                    const newItemName = firstSuggestion.specialItemName.trim();

                    let updatedSearchTerm = `${beforeText} ${newItemName}, ${afterText}`.trim();

                    updatedSearchTerm = updatedSearchTerm
                        .replace(/,\s*,/g, ", ")
                        .replace(/\s+,/g, ",")
                        .replace(/,\s+/g, ", ")
                        .replace(/,\s*$/, ",");

                    // 기존 items 복사
                    const updatedSpecialItems = {...specialItems};

                    // 이름 정규화
                    const normalizeName = (name) => (name ? name.trim().toLowerCase() : "");

                    const normalizedNewItemName = normalizeName(newItemName);

                    // 기존 아이템 확인
                    const existingItem = Object.values(updatedSpecialItems).find(
                        (existing) => normalizeName(existing.itemName) === normalizedNewItemName
                    );

                    if (!existingItem) {
                        // 새로운 아이템 추가
                        updatedSpecialItems[firstSuggestion.specialItemName] = {
                            specialItemId: firstSuggestion.specialItemId,
                            specialItemName: newItemName,
                            specialItemCount: 1,
                        };
                    }

                    // 중복 텍스트 제거
                    const terms = updatedSearchTerm
                        .split(",")
                        .map((term) => term.trim())
                        .filter((term, index, array) => array.findIndex((t) => normalizeName(t) === normalizeName(term)) === index);

                    updatedSearchTerm = terms.join(", ");

                    setSpecialItems(updatedSpecialItems);
                    setSpecialItemSuggestions([]);
                    setSearchSpecialItemTerm(updatedSearchTerm);
                    setSelectedIndex(0);
                    setSkipChangeEvent(true);

                    setTimeout(() => {
                        setSkipChangeEvent(false);
                    }, 0);
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
            <label className="block text-sm font-medium text-gray-700 mb-1">특이사항:</label>
            <Input.TextArea
                ref={searchTermRef}
                placeholder="특이 사항을 입력하고 콤마(,)로 구분하세요."
                value={searchSpecialItemTerm}
                onChange={handleSpecialInputChange}
                onKeyDown={handleInputKeyDown}
                onFocus={() => setIsDropdownVisible(true)}
                onBlur={handleBlur}
                autoSize={{minRows: 2}}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                tabIndex={tabIndex}
            />

            <div className="mt-1 min-h-[20px] top-full left-0 w-full text-sm pl-3">
                {isDropdownVisible && specialItemSuggestions.length === 0 && (
                    <span className="text-red-500 font-bold">{}</span>
                )}
            </div>

            {isDropdownVisible && specialItemSuggestions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 -mt-6 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-[112px] overflow-y-auto z-50"
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {specialItemSuggestions.map((specialItem, index) => (
                        <div
                            key={index}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSpecialItem(specialItem);
                                setIsDropdownVisible(false);
                            }}
                            className={`px-4 py-2 cursor-pointer ${
                                index === selectedIndex ? "bg-blue-100" : ""
                            } hover:bg-blue-50`}
                        >
                            {specialItem.specialItemName}
                        </div>
                    ))}
                </div>
            )}
        </Form.Item>
    )
}

export default SpecialItemSearch;