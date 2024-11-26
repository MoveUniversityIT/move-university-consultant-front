import React, {useState} from 'react';
import {Form, Input} from "antd";

const SpecialItemSearch = ({
                               searchSpecialItemTerm, setSearchSpecialItemTerm,
                               specialItemSuggestions, setSpecialItemSuggestions,
                               collapseSpecialItems, specialItems, setSpecialItems, tabIndex
                           }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [skipChangeEvent, setSkipChangeEvent] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        const cursorPosition = e.target.selectionStart;
        setIsDropdownVisible(true);

        if (skipChangeEvent) {
            setSkipChangeEvent(false);
            return;
        }

        // const beforeCursor = value.slice(0, cursorPosition);
        // const afterCursor = value.slice(cursorPosition);
        //
        // const start = beforeCursor.lastIndexOf(',') + 1;
        // const afterCommaIndex = afterCursor.indexOf(',');
        // const end = afterCommaIndex === -1 ? value.length : cursorPosition + afterCommaIndex;
        //
        // const currentSpecialItem = value.slice(start, end).trim();
        //
        // const generateNameVariations = (name) => {
        //     const baseName = name.trim().toLowerCase();
        //     const match = name.match(/\(([^)]*)\)/);
        //     if (match) {
        //         const parenthetical = match[1].trim().toLowerCase();
        //
        //         return [
        //             baseName,
        //             baseName.replace(/\(([^)]*)\)/g, '').trim(),
        //             parenthetical,
        //             baseName.replace(/\(([^)]*)\)/g, '').trim() + `(${parenthetical})`,
        //         ];
        //     }
        //     return [baseName];
        // };
        //
        // const similarityScore = (input, candidate) => {
        //     const cleanInput = input.replace(/\s/g, '').toLowerCase();
        //     const cleanCandidate = candidate.replace(/\s/g, '').toLowerCase();
        //
        //     let score = 0;
        //     for (const char of cleanInput) {
        //         if (cleanCandidate.includes(char)) {
        //             score++;
        //         }
        //     }
        //     return score;
        // };
        //
        // if (start <= end && currentSpecialItem) {
        //     const normalizedCurrent = currentSpecialItem.replace(/\(([^)]*)\)/g, '').trim().toLowerCase();
        //
        //     const filteredSuggestions = collapseSpecialItems.flatMap((items) => items.filter((item) => {
        //             const variations = generateNameVariations(item.itemName);
        //
        //             return variations.some((variation) => {
        //                 const normalizedVariation = variation.toLowerCase();
        //
        //                 const getCharFrequency = (str) => {
        //                     const frequency = {};
        //                     for (const char of str) {
        //                         frequency[char] = (frequency[char] || 0) + 1;
        //                     }
        //                     return frequency;
        //                 };
        //
        //                 const currentFreq = getCharFrequency(normalizedCurrent);
        //                 const variationFreq = getCharFrequency(normalizedVariation);
        //
        //                 return Object.keys(currentFreq).every(
        //                     (char) => variationFreq[char] >= currentFreq[char]
        //                 );
        //             });
        //         })
        //     );
        //
        //     const exactMatches = filteredSuggestions.filter((item) =>
        //         generateNameVariations(item.itemName).some(
        //             (variation) => variation.replace(/\(([^)]*)\)/g, '').trim() === normalizedCurrent
        //         )
        //     );
        //
        //     const partialMatches = filteredSuggestions.filter(
        //         (item) =>
        //             !exactMatches.includes(item) &&
        //             generateNameVariations(item.itemName).some((variation) => {
        //                 const normalizedVariation = variation.replace(/\(([^)]*)\)/g, '').trim();
        //                 return normalizedVariation.includes(normalizedCurrent) || normalizedCurrent.includes(normalizedVariation);
        //             })
        //     );
        //
        //     const otherMatches = filteredSuggestions.filter(
        //         (item) =>
        //             !exactMatches.includes(item) &&
        //             !partialMatches.includes(item)
        //     );
        //
        //     const sortedSuggestions = [
        //         ...exactMatches,
        //         ...partialMatches.sort((a, b) => {
        //             const aScore = Math.max(
        //                 ...generateNameVariations(a.itemName).map((variation) =>
        //                     similarityScore(normalizedCurrent, variation)
        //                 )
        //             );
        //             const bScore = Math.max(
        //                 ...generateNameVariations(b.itemName).map((variation) =>
        //                     similarityScore(normalizedCurrent, variation)
        //                 )
        //             );
        //             return bScore - aScore;
        //         }),
        //         ...otherMatches.sort((a, b) => (b.sortingIndex || 0) - (a.sortingIndex || 0)),
        //     ];
        //
        //     setSpecialItemSuggestions(sortedSuggestions.slice(0, 20));
        // } else {
        //     setSpecialItemSuggestions([]);
        // }
        //
        // const terms = value
        //     .split(',')
        //     .map((term) => term.trim())
        //     .filter((term) => term);
        //
        // const updatedSpecialItems = {...specialItems};
        // const processedItemIds = new Set();
        //
        // const unregisteredItems = [];
        //
        // Object.keys(updatedSpecialItems).forEach((key) => {
        //     if (!terms.some((term) => term.startsWith(updatedSpecialItems[key].itemName))) {
        //         delete updatedSpecialItems[key];
        //     } else {
        //         processedItemIds.add(key);
        //     }
        // });
        //
        // debugger;
        //
        // const itemPattern = /^(.+?)(?:\(([^)]*)\))?(\d*)$/;
        // terms.forEach((term) => {
        //     const match = term.match(itemPattern);
        //
        //     if (match) {
        //         const itemName = `${match[1].trim()}${match[2] ? `(${match[2]})` : ''}`;
        //         const quantity = parseInt(match[3]) || 1;
        //
        //         const existingItem = specialItems.find((item) => item.itemName === itemName);
        //
        //         if (existingItem) {
        //             updatedSpecialItems[itemName] = {
        //                 itemId: existingItem.itemId,
        //                 itemName: existingItem.itemName,
        //                 itemCount: quantity,
        //                 isDisassembly: existingItem.isDisassembly,
        //                 isInstallation: existingItem.isInstallation,
        //             };
        //             processedItemIds.add(existingItem.itemId.toString());
        //         } else {
        //             unregisteredItems.push(term);
        //         }
        //     }
        // });
        //
        // setSelectedIndex(0);
        // setItems(updatedSpecialItems);
        setSearchSpecialItemTerm(value);
    };


    return (
        <Form.Item className="relative !mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">특이사항:</label>
            <Input.TextArea
                placeholder="특이 사항을 입력하고 콤마(,)로 구분하세요."
                value={searchSpecialItemTerm}
                onChange={handleInputChange}
                autoSize={{minRows: 2}}
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                tabIndex={tabIndex}
            />
        </Form.Item>
    )
}

export default SpecialItemSearch;