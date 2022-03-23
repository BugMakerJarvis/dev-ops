import React, { useRef } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Space, Tag } from 'antd';
import { todoList } from '@/services/flow/task';
import { EditOutlined } from '@ant-design/icons';
import { history } from '@@/core/history';
import { getIntl, getLocale } from '@@/plugin-locale/localeExports';

const { messages } = getIntl(getLocale());

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<MODEL.TaskDetail>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: messages['pages.flow.todo.field.taskId'],
      key: 'taskId',
      dataIndex: 'taskId',
      align: 'center',
      copyable: true,
      // ellipsis: true,
      search: false,
      width: 300,
    },
    {
      title: messages['pages.flow.todo.field.procDefName'],
      key: 'procDefName',
      dataIndex: 'procDefName',
      align: 'center',
    },
    {
      title: messages['pages.flow.todo.field.version'],
      key: 'version',
      dataIndex: 'version',
      valueType: 'digit',
      width: 100,
      align: 'center',
      search: false,
      render: (text, r) => [
        <Tag key="v" color="yellow">
          v{r.procDefVersion}
        </Tag>,
      ],
    },
    {
      title: messages['pages.flow.todo.field.taskName'],
      key: 'taskName',
      dataIndex: 'taskName',
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.todo.field.startUserName'],
      key: 'startUserName',
      dataIndex: 'startUserName',
      align: 'center',
      search: false,
      render: (text, r) => [
        <Space key="u">
          <span>{r.startUserName}</span>
          <Tag color="green">{r.startDeptName}</Tag>
        </Space>,
      ],
    },
    {
      title: messages['pages.flow.todo.field.createTime'],
      key: 'createTime',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 160,
      align: 'center',
      // sorter: true,
    },
    {
      title: messages['pages.flow.todo.field.option'],
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (text, r) => [
        <Button
          key="h"
          type="dashed"
          icon={<EditOutlined />}
          onClick={() => {
            history.push(
              `/flow/taskrecord?procInsId=${r.procInsId}&deployId=${r.deployId}&taskId=${r.taskId}&handleType=handle`,
            );
          }}
        >
          {messages['pages.flow.todo.field.option.handle']}
        </Button>,
      ],
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          rowKey="taskId"
          search={{ labelWidth: 'auto' }}
          toolbar={{
            title: messages['pages.flow.todo'],
            tooltip: '😓',
          }}
          request={async (params) => {
            let list: MODEL.TaskDetail[] = [];
            try {
              await todoList(
                params.pageNum ? params.pageNum : 1,
                params.pageSize ? params.pageSize : 10,
              ).then((d) => {
                list = d.records;
              });
              return {
                data: list,
                success: true,
                total: list.length,
              };
            } catch (e) {
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          }}
        ></ProTable>
      </div>
    </div>
  );
};
