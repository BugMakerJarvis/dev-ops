import React, {useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {Tag, Modal, Button} from "antd";
import {myProcess} from "@/services/flow/task";
import {definitionList} from "@/services/flow/definition";
import {PlusOutlined} from "@ant-design/icons";
import {history} from "@@/core/history";

type DefDetail = {
  deploymentId: string,
  name: string,
  version: number;
  category: string;
};

type DefListProps = {
  onVisibleChange: (visible: boolean) => void;
};

const DefList: React.FC<DefListProps> = (props) => {
  const {onVisibleChange} = props;

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<DefDetail>[] = [
    {
      title: "流程名称",
      key: "name",
      dataIndex: "name",
      width: 190,
      align: "center",
      search: false,
    },
    {
      title: "流程版本",
      key: "version",
      dataIndex: "version",
      valueType: "digit",
      width: 190,
      align: "center",
      search: false,
      render: (text, r) => [<Tag key="v" color="yellow">v{r.version}</Tag>],
    },
    {
      title: "流程分类",
      key: "category",
      dataIndex: "category",
      width: 190,
      align: "center",
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 190,
      align: "center",
      render: (text, r) => [
        <Button key="1" type="primary" ghost onClick={() => {
          onVisibleChange(false);
          history.push("/flow/newprocess")
          console.log(r.deploymentId);
        }}>发起流程</Button>
      ],
    }
  ];

  return (
    <div>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        options={false}
        search={false}
        rowKey="name"
        request={async (params) => {
          let list: DefDetail[] = [];
          try {
            await definitionList(1, params.pageSize ? params.pageSize : 10, params.name ? params.name : "", params.deployTime ? params.deployTime : "").then((d) => {
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
  )
}

export default (): React.ReactNode => {

  const actionRef = useRef<ActionType>();

  const [isDefListModalVisible, setIsDefListModalVisible] = useState<boolean>(false);

  const columns: ProColumns<MODEL.TaskDetail>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: "center",
    },
    {
      title: "流程编号",
      key: "deploymentId",
      dataIndex: "deploymentId",
      align: "center",
      copyable: true,
      // ellipsis: true,
      search: false,
      width: 300,
    },
    {
      title: "流程名称",
      key: "name",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "流程分类",
      key: "category",
      dataIndex: "category",
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
      title: "提交时间",
      key: "createTime",
      dataIndex: "createTime",
      valueType: "dateTime",
      width: 160,
      align: "center",
      sorter: true,
    },
    {
      title: "流程状态",
      key: "procStatus",
      dataIndex: "procStatus",
      align: "center",
      search: false,
      render: (text, r) => [r.finishTime == null ? <Tag key="v" color="green">进行中</Tag> :
        <Tag key="v" color="red">已完成</Tag>],
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
      title: "当前节点",
      key: "taskName",
      dataIndex: "taskName",
      align: "center",
      search: false,
    },
    {
      title: "办理",
      key: "assigneeName",
      dataIndex: "assigneeName",
      align: "center",
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: "center",
      render: (text, r) => [],
    }
  ];


  return (
    <div>
      <div style={{marginBottom: 10}}>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          toolbar={{
            title: '我的流程',
            tooltip: '😓',
            actions: [
              <div>
                <Button type="primary" onClick={() => setIsDefListModalVisible(true)}
                        icon={<PlusOutlined/>}>新增流程</Button>
                <Modal
                  visible={isDefListModalVisible}
                  width={window.screen.width * 3 / 5}
                  onCancel={() => setIsDefListModalVisible(false)}
                  footer={null}
                >
                  <DefList onVisibleChange={(visible) => {
                    setIsDefListModalVisible(visible);
                    actionRef.current?.reload();
                  }}/>
                </Modal>
              </div>
            ],
          }}
          request={async (params) => {
            let list: MODEL.TaskDetail[] = [];
            try {
              await myProcess(1, params.pageSize ? params.pageSize : 10, params.name ? params.name : "", params.deployTime ? params.deployTime : "").then((d) => {
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
