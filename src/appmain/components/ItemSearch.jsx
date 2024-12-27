import React, {useRef, useState} from "react";
import {Button, Form, Input} from "antd";
import _ from "lodash";
import {ArrowDownOutlined, ArrowUpOutlined, SortAscendingOutlined, SortDescendingOutlined} from "@ant-design/icons";

const ItemSearch = ({
                        searchTerm, suggestions, collapseItems, items, setItems,
                        setSuggestions, setSearchTerm, tabIndex, moveType, unregisterWord,
                        setUnregisterWord
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

        const beforeCursor = value.slice(0, cursorPosition);
        const afterCursor = value.slice(cursorPosition);

        const start = beforeCursor.lastIndexOf(',') + 1;
        const afterCommaIndex = afterCursor.indexOf(',');
        const end = afterCommaIndex === -1 ? value.length : cursorPosition + afterCommaIndex;

        const currentItem = value.slice(start, end).trim();

        const generateNameVariations = (name) => {
            const baseName = name.trim().toLowerCase();
            const match = name.match(/\(([^)]*)\)/);
            if (match) {
                const parenthetical = match[1].trim().toLowerCase();

                return [
                    baseName,
                    baseName.replace(/\(([^)]*)\)/g, '').trim(),
                    parenthetical,
                    baseName.replace(/\(([^)]*)\)/g, '').trim() + `(${parenthetical})`,
                ];
            }
            return [baseName];
        };

        const similarityScore = (input, candidate) => {
            const cleanInput = input.replace(/\s/g, '').toLowerCase();
            const cleanCandidate = candidate.replace(/\s/g, '').toLowerCase();

            let score = 0;

            if (cleanInput === cleanCandidate) return 100;

            if (cleanCandidate.includes(cleanInput) || cleanInput.includes(cleanCandidate)) {
                score += 50;
            }

            for (const char of cleanInput) {
                if (cleanCandidate.includes(char)) {
                    score++;
                }
            }

            const inputWords = input.toLowerCase().split(/[\s()]+/);
            const candidateWords = candidate.toLowerCase().split(/[\s()]+/);
            for (let i = 0; i < inputWords.length; i++) {
                if (candidateWords.includes(inputWords[i])) {
                    score += 10;
                }
            }

            return score;
        };

        if (start <= end && currentItem) {
            const tempNormalizedCurrent = currentItem.trim().toLowerCase();

            const hyphenIndex = tempNormalizedCurrent.indexOf('-');
            const normalizedCurrent = hyphenIndex !== -1
                ? tempNormalizedCurrent.slice(0, hyphenIndex).trim()
                : tempNormalizedCurrent;

            let filteredSuggestions = collapseItems.flatMap((category) =>
                category.subcategories.flatMap((subcategory) =>
                    subcategory.items.filter((item) => {
                        if (
                            (moveType?.value === '단순운송' || moveType?.value === '일반이사') &&
                            ['박스(필요)', '바구니(필요)'].some((exclude) => item.itemName.includes(exclude))
                        ) {
                            return false;
                        }

                        const variations = generateNameVariations(item.itemName);

                        return variations.some((variation) => {
                            const normalizedVariation = variation.toLowerCase();

                            const getCharFrequency = (str) => {
                                const frequency = {};
                                for (const char of str) {
                                    frequency[char] = (frequency[char] || 0) + 1;
                                }
                                return frequency;
                            };

                            const currentFreq = getCharFrequency(normalizedCurrent);
                            const variationFreq = getCharFrequency(normalizedVariation);

                            return (
                                Object.keys(currentFreq).every(
                                    (char) => variationFreq[char] >= currentFreq[char]
                                ) || normalizedVariation === normalizedCurrent
                            );
                        });
                    })
                )
            );

            // 완전 일치 항목이 무조건 포함되도록 수정
            const exactMatches = filteredSuggestions.filter((item) =>
                generateNameVariations(item.itemName).some(
                    (variation) => variation.replace(/\(([^)]*)\)/g, '').trim() === normalizedCurrent
                )
            );

            const partialMatches = filteredSuggestions.filter(
                (item) =>
                    !exactMatches.includes(item) &&
                    generateNameVariations(item.itemName).some((variation) => {
                        const normalizedVariation = variation.replace(/\(([^)]*)\)/g, '').trim();
                        return normalizedVariation.includes(normalizedCurrent) || normalizedCurrent.includes(normalizedVariation);
                    })
            );

            const otherMatches = filteredSuggestions.filter(
                (item) =>
                    !exactMatches.includes(item) &&
                    !partialMatches.includes(item)
            );

            const sortedSuggestions = [
                ...exactMatches,
                ...partialMatches.sort((a, b) => {
                    const aScore = Math.max(
                        ...generateNameVariations(a.itemName).map((variation) =>
                            similarityScore(normalizedCurrent, variation)
                        )
                    );
                    const bScore = Math.max(
                        ...generateNameVariations(b.itemName).map((variation) =>
                            similarityScore(normalizedCurrent, variation)
                        )
                    );
                    return bScore - aScore;
                }),
                ...otherMatches.sort((a, b) => (b.sortingIndex || 0) - (a.sortingIndex || 0)),
            ];

            setSuggestions(sortedSuggestions.slice(0, 20));
        } else {
            setSuggestions([]);
        }

        const terms = value
            .split(',')
            .map((term) => term.trim())
            .filter((term) => term);

        const updatedItems = {...items};
        const processedItemIds = new Set();

        const unregisteredItems = [];

        Object.keys(updatedItems).forEach((key) => {
            if (!terms.some((term) => term.startsWith(updatedItems[key].itemName))) {
                delete updatedItems[key];
            } else {
                processedItemIds.add(key);
            }
        });

        const itemPattern = /^(.+?)(?:\(([^)]*)\))?(?:\[(분|조|분조)\])?(\d*)$/;
        terms.forEach((term) => {
            const match = term.match(itemPattern);

            if (match) {
                const rawItemName = match[1].trim();
                const parenthetical = match[2] ? `(${match[2]})` : '';
                const itemName = `${rawItemName}${parenthetical}`;
                let tag = match[3] || '';
                const quantity = parseInt(match[4], 10) || 1;

                const isValidTag = ['분', '조', '분조'].includes(tag) || _.isEmpty(tag);

                if (!isValidTag) {
                    tag = '';
                }

                const formattedName = `${itemName}${tag ? `[${tag}]` : ''}${quantity === 1 ? "" : quantity}`;

                let isRegistered = false;

                for (let i = 0; i < collapseItems.length; i++) {
                    const category = collapseItems[i];

                    for (let j = 0; j < category.subcategories.length; j++) {
                        const subcategory = category.subcategories[j];

                        for (let k = 0; k < subcategory.items.length; k++) {
                            const item = subcategory.items[k];
                            const normalizedItemName = item.itemName.toLowerCase();
                            if (itemName === normalizedItemName && isValidTag) {
                                const requiredIsDisassembly = item.isDisassembly === 'Y' && (tag === '분' || tag === '분조') ? 'Y' : 'N';
                                const requiredIsInstallation = item.isInstallation === 'Y' && (tag === '조' || tag === '분조') ? 'Y' : 'N';

                                const additionalPrice =
                                    item.baseAdditionalFee +
                                    (requiredIsDisassembly === 'Y' ? item.disassemblyAdditionalFee : 0) +
                                    (requiredIsInstallation === 'Y' ? item.installationAdditionalFee : 0);

                                if (!updatedItems[item.itemName]) {
                                    updatedItems[item.itemName] = {
                                        itemId: item.itemId,
                                        itemName: item.itemName,
                                        itemCbm: item.itemCbm,
                                        itemCount: quantity,
                                        weight: item.weight,
                                        isDisassembly: item.isDisassembly,
                                        isInstallation: item.isInstallation,
                                        requiredIsDisassembly,
                                        requiredIsInstallation,
                                        baseAdditionalFee: item.baseAdditionalFee,
                                        disassemblyAdditionalFee: item.disassemblyAdditionalFee,
                                        installationAdditionalFee: item.installationAdditionalFee,
                                        additionalPrice
                                    };
                                } else {
                                    updatedItems[item.itemName] = {
                                        ...updatedItems[item.itemName],
                                        itemCount: quantity,
                                        requiredIsDisassembly,
                                        requiredIsInstallation,
                                        additionalPrice
                                    };
                                }
                                processedItemIds.add(item.itemName.toString());
                                isRegistered = true;
                                break;
                            }
                        }
                        if (isRegistered) break;
                    }

                    if (isRegistered) break;
                }

                if (_.isEmpty(tag)) {
                    if (updatedItems[itemName]) {
                        updatedItems[itemName].requiredIsDisassembly = 'N';
                        updatedItems[itemName].requiredIsInstallation = 'N';
                    }
                }

                if (!isRegistered || !isValidTag) {
                    if (!unregisteredItems.includes(term)) {
                        unregisteredItems.push(term);
                    }

                    const cleanItemName = (name) => {
                        if (/\(.+\)$/.test(name)) {
                            return name.replace(/\).*/, ')');
                        }
                        return name.replace(/[^a-zA-Z가-힣()]+$/, '').trim();
                    };

                    const replaceItemName = cleanItemName(itemName);

                    if (updatedItems[replaceItemName]) {

                        delete updatedItems[replaceItemName];
                    }
                }

                const updatedSearchTerm = terms.map((t) =>
                    t === term ? formattedName : t
                ).join(', ');
                setSearchTerm(updatedSearchTerm);
            }
        });

        setSelectedIndex(0);
        setItems(updatedItems);
        setSearchTerm(value);

        setUnregisterWord([...unregisteredItems]);
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

        let tag = "";
        if (item.isDisassembly === 'Y') {
            tag = '[분]';
        }

        const newItemName = `${item.itemName.trim()}${tag}`;

        // 새로운 검색어 생성
        let updatedSearchTerm = `${beforeText} ${newItemName}, ${afterText}`.trim();

        updatedSearchTerm = updatedSearchTerm
            .replace(/,\s*,/g, ', ')
            .replace(/\s+,/g, ',')
            .replace(/,\s+/g, ', ')
            .replace(/,\s*$/, ',');

        // 기존 items 복사
        const updatedItems = {...items};

        // 선택된 아이템 이름 정규화
        const normalizeName = (name) => name.trim().toLowerCase();

        const normalizedBaseItemName = normalizeName(item.itemName);

        // 선택된 아이템만 처리
        const existingItem = Object.values(updatedItems).find(
            (existing) => normalizeName(existing.itemName) === normalizedBaseItemName
        );

        const requiredIsDisassembly = item.isDisassembly;
        const requiredIsInstallation = items[item.itemId]?.requiredIsInstallation || "N";

        const additionalPrice =
            item.baseAdditionalFee +
            (requiredIsDisassembly === 'Y' ? item.disassemblyAdditionalFee : 0) +
            (requiredIsInstallation === 'Y' ? item.installationAdditionalFee : 0);

        if (existingItem) {
            existingItem.itemCount = 1;
            existingItem.requiredIsDisassembly = item.isDisassembly === "Y" ? "Y" : "N";
        } else {
            // 새로운 항목 추가
            updatedItems[item.itemName] = {
                itemId: item.itemId,
                itemName: item.itemName.trim(),
                itemCbm: item.itemCbm,
                itemCount: 1,
                weight: item.weight,
                isDisassembly: item.isDisassembly,
                isInstallation: item.isInstallation,
                requiredIsDisassembly,
                requiredIsInstallation,
                baseAdditionalFee: item.baseAdditionalFee,
                disassemblyAdditionalFee: item.disassemblyAdditionalFee,
                installationAdditionalFee: item.installationAdditionalFee,
                additionalPrice
            };
        }

        const terms = updatedSearchTerm
            .split(',')
            .map((term) => term.trim())
            .filter((term, index, array) => array.findIndex((t) => normalizeName(t) === normalizeName(term)) === index);

        updatedSearchTerm = terms.join(', ');

        setItems(updatedItems);
        setSuggestions([]);
        setSearchTerm(updatedSearchTerm);
        setSkipChangeEvent(true);
        setSelectedIndex(0);
        setUnregisterWord((prev) => {
            if (prev.length === 0) return prev;
            return prev.slice(0, -1);
        });

        textAreaElement.focus();
    };

    const handleInputKeyDown = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            // TODO - 위치를 벗어났을때 추천필터 제거 로직
            // const value = e.target.value;
            // const cursorPosition = e.target.selectionStart;
            //
            // // 현재 위치 범위 계산
            // const beforeCursor = value.slice(0, cursorPosition);
            // const afterCursor = value.slice(cursorPosition);
            //
            // const start = beforeCursor.lastIndexOf(',') + 1;
            // const afterCommaIndex = afterCursor.indexOf(',');
            // const end = afterCommaIndex === -1 ? searchTerm.length : cursorPosition + afterCommaIndex;
            //
            // // 커서가 현재 위치를 벗어난 경우 추천 초기화
            // if (cursorPosition < start || cursorPosition > end) {
            //     setSuggestions([]); // 범위를 벗어나면 초기화
            // }
            //
            // console.log("cursorPosition", cursorPosition)
            // console.log("start", start)
            // console.log("end", end)
        } else if (isDropdownVisible && suggestions.length > 0) {
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
            } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();

                if (suggestions.length > 0) {
                    const firstSuggestion = suggestions[selectedIndex];
                    const cursorPosition = e.target.selectionStart;

                    const beforeCursor = searchTerm.slice(0, cursorPosition);
                    const afterCursor = searchTerm.slice(cursorPosition);

                    const start = beforeCursor.lastIndexOf(",") + 1;
                    const end = cursorPosition + (afterCursor.indexOf(",") === -1 ? afterCursor.length : afterCursor.indexOf(","));

                    const beforeText = searchTerm.slice(0, start).trim();
                    const afterText = searchTerm.slice(end).trim();
                    let baseItemName = firstSuggestion.itemName.trim();

                    let tag = "";
                    if (firstSuggestion.isDisassembly === 'Y') {
                        tag = '[분]';
                    }

                    let quantity = 1; // 기본 수량
                    const quantityMatch = beforeCursor.match(/-+(\d+)$/);
                    if (quantityMatch) {
                        quantity = parseInt(quantityMatch[1], 10);
                        baseItemName = baseItemName.replace(/-+\d+$/, "").trim();
                    }

                    const newItemName = `${baseItemName}${tag}${quantity !== 1 ? quantity : ''}`;

                    let updatedSearchTerm = `${beforeText} ${newItemName}, ${afterText}`.trim();

                    updatedSearchTerm = updatedSearchTerm
                        .replace(/,\s*,/g, ", ")
                        .replace(/\s+,/g, ",")
                        .replace(/,\s+/g, ", ")
                        .replace(/,\s*$/, ",");

                    const updatedItems = {...items};

                    const normalizeName = (name) => name.trim().toLowerCase();

                    const normalizedBaseItemName = normalizeName(baseItemName);

                    const existingItem = Object.values(updatedItems).find(
                        (existing) => normalizeName(existing.itemName) === normalizedBaseItemName
                    );

                    const requiredIsDisassembly = firstSuggestion.isDisassembly;
                    const requiredIsInstallation = items[firstSuggestion.itemId]?.requiredIsInstallation || "N";

                    const additionalPrice =
                        firstSuggestion.baseAdditionalFee +
                        (requiredIsDisassembly === 'Y' ? firstSuggestion.disassemblyAdditionalFee : 0) +
                        (requiredIsInstallation === 'Y' ? firstSuggestion.installationAdditionalFee : 0);

                    if (existingItem) {
                        existingItem.requiredIsDisassembly = firstSuggestion.isDisassembly === "Y" ? "Y" : "N";
                    } else {
                        updatedItems[firstSuggestion.itemName] = {
                            itemId: firstSuggestion.itemId,
                            itemName: baseItemName,
                            itemCount: quantity,
                            itemCbm: firstSuggestion.itemCbm,
                            weight: firstSuggestion.weight,
                            isDisassembly: firstSuggestion.isDisassembly,
                            isInstallation: firstSuggestion.isInstallation,
                            requiredIsDisassembly,
                            requiredIsInstallation,
                            baseAdditionalFee: firstSuggestion.baseAdditionalFee,
                            disassemblyAdditionalFee: firstSuggestion.disassemblyAdditionalFee,
                            installationAdditionalFee: firstSuggestion.installationAdditionalFee,
                            additionalPrice
                        };
                    }

                    // 중복 텍스트 제거
                    const terms = updatedSearchTerm
                        .split(",")
                        .map((term) => term.trim())
                        .filter((term, index, array) => array.findIndex((t) => normalizeName(t) === normalizeName(term)) === index);

                    updatedSearchTerm = terms.join(", ");

                    setItems(updatedItems);
                    setSuggestions([]);
                    setSearchTerm(updatedSearchTerm);
                    setSelectedIndex(0);
                    setUnregisterWord((prev) => {
                        if (prev.length === 0) return prev;
                        return prev.slice(0, -1);
                    });
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

    const handleSort = (key, orderKey) => {
        const itemsArray = Object.values(items);

        const targetItems = ["박스(포장됨)", "박스(필요)", "바구니(포장됨)", "바구니(필요)"];

        // 정렬 수행
        const sortedItems = _.orderBy(
            itemsArray,
            [
                (item) => {
                    const index = targetItems.indexOf(item.itemName);
                    return index !== -1 ? index : -Infinity;
                },
                'additionalPrice', // 추가 요금
                'itemCbm',        // CBM
                'weight'          // 무게
            ],
            [
                'asc',
                orderKey,   // additionalPrice 기준
                orderKey,   // itemCbm 기준
                orderKey    // weight 기준
            ]
        );

        // 정렬된 배열을 객체로 변환
        const sortedItemsObject = sortedItems.reduce((acc, item) => {
            acc[item.itemName] = item;
            return acc;
        }, {});

        setItems(sortedItemsObject);

        // 검색어 업데이트
        const updatedSearchTerm = sortedItems
            .map((item) => {
                let tags = "";

                if (item.requiredIsDisassembly === "Y" && item.requiredIsInstallation === "Y") {
                    tags = "[분조]";
                } else if (item.requiredIsDisassembly === "Y") {
                    tags = "[분]";
                } else if (item.requiredIsInstallation === "Y") {
                    tags = "[조]";
                }

                const itemCount = item.itemCount && item.itemCount !== 1 ? item.itemCount : "";

                return `${item.itemName}${tags}${itemCount}`;
            })
            .join(", ");

        setSearchTerm(updatedSearchTerm);
    };


    return (
        <Form.Item className="relative !mb-2">
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">물품명:</label>
                <div>
                    <Button
                        type="default"
                        size="small"
                        onClick={() => handleSort("itemName", "desc")}
                        icon={<SortAscendingOutlined/>}
                        style={{
                            backgroundColor: "#e6f7ff",
                            color: "#1890ff",
                            borderColor: "#91d5ff",
                        }}
                        className="ml-1"
                    />
                </div>
            </div>
            <Input.TextArea
                ref={searchTermRef}
                placeholder="물품 이름을 입력하고 콤마(,)로 구분하세요"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onFocus={() => setIsDropdownVisible(true)}
                onBlur={handleBlur}
                autoSize={{minRows: 2}}
                spellCheck={false}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                tabIndex={tabIndex}
            />

            <div className="mt-1 min-h-[20px] top-full left-0 w-full text-sm pl-3">
                {unregisterWord.length !== 0 && (
                    <span className="text-red-500 font-bold">{unregisterWord.join(', ')}</span>
                )}
            </div>

            {isDropdownVisible && suggestions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 -mt-6 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-[112px] overflow-y-auto z-50"
                    onMouseDown={(e) => e.preventDefault()}
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