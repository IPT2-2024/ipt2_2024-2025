
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const DropdownMaritalStatus = ({ value, onChange, disabled }) => {
    return (
        <Select
            value={value}
            onChange={onChange}
            placeholder="Select Marital Status"
            disabled={disabled}
            style={{ width: '100%' }}
        >
            <Option value="single">Single</Option>
            <Option value="married">Married</Option>
        </Select>
    );
};

export default DropdownMaritalStatus;
