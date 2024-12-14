// ProgramSelect.js
import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

const ProgramSelect = ({ programs }) => {
  return (
    <Form.Item
      label="Program(s)"
      name="program"
      rules={[{ required: true, message: 'Please select at least one academic program' }]}
    >
      <Select
        mode="multiple"
        showSearch
        placeholder="Select Academic Program"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {programs.map((program) => (
          <Option key={program.id} value={program.name}>
            {program.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default ProgramSelect;
