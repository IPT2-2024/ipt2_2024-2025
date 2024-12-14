// DepartmentSelect.js
import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

const DepartmentSelect = ({ departments }) => {
  return (
    <Form.Item
      label="Department"
      name="department"
      rules={[{ required: true, message: 'Please select a department' }]}
    >
      <Select
        showSearch
        placeholder="Select Department"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {departments.map((department) => (
          <Option key={department.id} value={department.name}>
            {department.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default DepartmentSelect;
