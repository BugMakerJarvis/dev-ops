import React, { useRef } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Space, Tooltip } from 'antd';
import { finishedList } from '@/services/flow/task';
import { OrderedListOutlined } from '@ant-design/icons';
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
      title: messages['pages.flow.finished.field.taskId'],
      key: 'taskId',
      dataIndex: 'taskId',
      align: 'center',
      copyable: true,
      // ellipsis: true,
      search: false,
      width: 300,
    },
    {
      title: messages['pages.flow.finished.field.procDefName'],
      key: 'procDefName',
      dataIndex: 'procDefName',
      align: 'center',
    },
    {
      title: messages['pages.flow.finished.field.taskName'],
      key: 'taskName',
      dataIndex: 'taskName',
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.finished.field.startUserName'],
      key: 'startUserName',
      dataIndex: 'startUserName',
      align: 'center',
      ellipsis: true,
      search: false,
      render: (text, r) => [
        <Tooltip placement="top" title={<span>{r.startDeptName}</span>}>
          <span style={{ fontWeight: 'bolder' }}>{r.startUserName}</span>
        </Tooltip>,
      ],
    },
    {
      title: messages['pages.flow.finished.field.createTime'],
      key: 'createTime',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 160,
      align: 'center',
    },
    {
      title: messages['pages.flow.finished.field.finishTime'],
      key: 'finishTime',
      dataIndex: 'finishTime',
      valueType: 'dateTime',
      width: 160,
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.finished.field.duration'],
      key: 'duration',
      dataIndex: 'duration',
      width: 160,
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.finished.field.option'],
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (text, r) => [
        <Space key="s">
          <Button
            type="dashed"
            style={{ backgroundColor: 'lightgreen' }}
            icon={<OrderedListOutlined />}
            onClick={() => {
              history.push(
                `/flow/taskrecord?procInsId=${r.procInsId}&deployId=${r.deployId}&taskId=${r.taskId}&handleType=info`,
              );
            }}
          >
            {messages['pages.flow.finished.field.option.flowDoc']}
          </Button>
          {/*撤回流程目前还存在问题*/}
          {/*<Button type="dashed" disabled icon={<RollbackOutlined/>} onClick={async () => {*/}
          {/*  try {*/}
          {/*    const res = await revokeProcess({"instanceId": r.procInsId});*/}
          {/*    if (res) {*/}
          {/*      message.success("撤回流程成功");*/}
          {/*    } else {*/}
          {/*      message.error("撤回流程失败");*/}
          {/*    }*/}
          {/*  } catch (e: any) {*/}
          {/*    message.error(e.message);*/}
          {/*  }*/}
          {/*}}>*/}
          {/*  {messages['pages.flow.finished.field.option.withdraw']}*/}
          {/*</Button>*/}
        </Space>,
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
            title: messages['pages.flow.finished'],
            tooltip: '😓',
          }}
          request={async (params) => {
            let list: MODEL.TaskDetail[] = [];
            try {
              await finishedList(
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
