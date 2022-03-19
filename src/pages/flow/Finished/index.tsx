import React, {useRef} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {Button, message, Space, Tag} from "antd";
import {finishedList, revokeProcess} from "@/services/flow/task";
import {OrderedListOutlined, RollbackOutlined} from "@ant-design/icons";
import {history} from "@@/core/history";

export default (): React.ReactNode => {

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<MODEL.TaskDetail>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: "center",
    },
    {
      title: "任务编号",
      key: "taskId",
      dataIndex: "taskId",
      align: "center",
      copyable: true,
      // ellipsis: true,
      search: false,
      width: 300,
    },
    {
      title: "流程名称",
      key: "procDefName",
      dataIndex: "procDefName",
      align: "center",
    },
    {
      title: "任务节点",
      key: "taskName",
      dataIndex: "taskName",
      align: "center",
      search: false,
    },
    {
      title: "流程发起人",
      key: "startUserName",
      dataIndex: "startUserName",
      align: "center",
      search: false,
      render: (text, r) => [
        <Space key="u">
          <span>{r.startUserName}</span>
          <Tag color="green">{r.startDeptName}</Tag>
        </Space>
      ],
    },
    {
      title: "接收时间",
      key: "createTime",
      dataIndex: "createTime",
      valueType: "dateTime",
      width: 160,
      align: "center",
    },
    {
      title: "审批时间",
      key: "finishTime",
      dataIndex: "finishTime",
      valueType: "dateTime",
      width: 160,
      align: "center",
      search: false,
    },
    {
      title: "耗时",
      key: "duration",
      dataIndex: "duration",
      width: 160,
      align: "center",
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: "center",
      render: (text, r) => [
        <Space key="s">
          <Button type="dashed" icon={<OrderedListOutlined/>} onClick={() => {
            history.push(`/flow/taskrecord?procInsId=${r.procInsId}&deployId=${r.deployId}&taskId=${r.taskId}&handleType=info`);
          }}>
            流转记录
          </Button>
          {/*撤回流程目前还存在问题*/}
          <Button type="dashed" disabled icon={<RollbackOutlined/>} onClick={async () => {
            try {
              const res = await revokeProcess({"instanceId": r.procInsId});
              if (res) {
                message.success("撤回流程成功");
              } else {
                message.error("撤回流程失败");
              }
            } catch (e: any) {
              message.error(e.message);
            }
          }}>
            撤回
          </Button>
        </Space>,
      ],
    },
  ]

  return (
    <div>
      <div style={{marginBottom: 10}}>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          rowKey="taskId"
          toolbar={{
            title: '已办任务',
            tooltip: '😓',
          }}
          request={async (params) => {
            let list: MODEL.TaskDetail[] = [];
            try {
              await finishedList(params.pageNum ? params.pageNum : 1, params.pageSize ? params.pageSize : 10).then((d) => {
                list = d.records;
              })
              return {
                data: list,
                success: true,
                total: list.length,
              }
            } catch (e) {
              return {
                data: [],
                success: false,
                total: 0,
              }
            }
          }}
        >
        </ProTable>
      </div>
    </div>
  );
};
