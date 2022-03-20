import React from 'react';
import { Card, Space } from 'antd';

const Welcome: React.FC = () => {
  return (
    <div>
      <Card title="Welcome" bordered={false}>
        <Space>
          <span style={{ fontWeight: 'bolder' }}>GitHub</span>
          <a
            href="https://github.com/BugMakerJarvis/dev-ops"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 'bolder' }}
          >
            https://github.com/BugMakerJarvis/dev-ops
          </a>
        </Space>
      </Card>
    </div>
  );
};

export default Welcome;
