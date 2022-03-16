import React, {useRef} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {Tag} from "antd";
import {todoList} from "@/services/flow/task";

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
      title: "流程版本",
      key: "version",
      dataIndex: "version",
      valueType: "digit",
      width: 100,
      align: "center",
      search: false,
      render: (text, r) => [<Tag key="v" color="yellow">v{r.procDefVersion}</Tag>],
    },
    {
      title: "流程发起人",
      key: "startUserName",
      dataIndex: "startUserName",
      align: "center",
      search: false,
    },
    {
      title: "接收时间",
      key: "createTime",
      dataIndex: "createTime",
      valueType: "dateTime",
      width: 160,
      align: "center",
      sorter: true,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: "center",
      render: (text, r) => []
    },
  ]

  return (
    <div>
      <div style={{marginBottom: 10}}>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          toolbar={{
            title: '待办任务',
            tooltip: '😓',
          }}
          request={async (params) => {
            let list: MODEL.TaskDetail[] = [];
            try {
              await todoList(params.pageNum ? params.pageNum : 1, params.pageSize ? params.pageSize : 10).then((d) => {
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
