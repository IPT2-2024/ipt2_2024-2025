import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const DropdownSex = ({ value, onChange, disabled }) => {
    return (
        <Select
            value={value}
            onChange={onChange}
            placeholder="Select Sex"
            disabled={disabled}
            style={{ width: '100%' }}
        >
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
        </Select>
    );
};

export default DropdownSex;
