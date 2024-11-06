import React, { useState } from 'react';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

const options = [
    { label: '손 없는 날', value: 'NO_HANDS_SON' }
];

const SpecialDateCheckBox = ({dateCheckList}) => {
    return (
        <div>
            <CheckboxGroup
                options={options}
                value={dateCheckList}
                disabled={true}
            />
        </div>
    );
};

export default SpecialDateCheckBox;