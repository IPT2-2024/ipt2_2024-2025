import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const ContentLayout = ({ children }) => {
  return (
    <Content>
      {children}
    </Content>
  );
};

export default ContentLayout;
