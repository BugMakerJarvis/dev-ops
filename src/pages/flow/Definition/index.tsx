import React, {useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {definitionList, deleteDefinition, importFile, updateState} from "@/services/flow/definition";
import {Button, Dropdown, Menu, Upload, message, Tag, Divider} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined, InboxOutlined,
  PauseCircleOutlined,
  PlaySquareOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {Link, history} from 'umi';
import {ModalForm, ProFormInstance, ProFormText} from "@ant-design/pro-form";

const {Dragger} = Upload;

type DefinitionDetail = {
  deploymentId: string,
  key: string,
  category: string,
  name: string,
  formName: string,
  version: number,
  suspensionState: number,
  deploymentTime: string,
}

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [uploadFile, setUploadFile] = useState<Blob>(new Blob());

  const columns: ProColumns<DefinitionDetail>[] = [
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
      title: "流程标识",
      key: "key",
      dataIndex: "key",
      align: "center",
      search: false,
    },
    {
      title: "流程分类",
      key: "category",
      dataIndex: "category",
      align: "center",
      search: false,
    },
    {
      title: "流程名称",
      key: "name",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "业务表单",
      key: "formName",
      dataIndex: "formName",
      valueType: "option",
      align: "center",
      search: false,
      render: (text, r) => [<div key="f">{r.formName === null ? <span style={{fontWeight: 'bold'}}>暂无表单</span> :
        <a>{r.formName}</a>}</div>],
    },
    {
      title: "流程版本",
      key: "version",
      dataIndex: "version",
      valueType: "digit",
      width: 100,
      align: "center",
      search: false,
      render: (text, r) => [<Tag key="v" color="yellow">v{r.version}</Tag>],
    },
    {
      title: "状态",
      key: "suspensionState",
      dataIndex: "suspensionState",
      valueType: "digit",
      width: 100,
      align: "center",
      search: false,
      render: (text, r) => [<Tag key="s"
                                 color={r.suspensionState === 1 ? "green" : "red"}>{r.suspensionState === 1 ? "激活" : "挂起"}</Tag>],
    },
    {
      title: "部署时间",
      key: "deploymentTime",
      dataIndex: "deploymentTime",
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
      render: (text, r) => [
        <Dropdown key="menu" overlay={() => {
          return (
            <Menu>
              <Menu.Item key="1" icon={<EditOutlined/>}>
                {<Link to={`/flow/flowdesigner?deployId=${r.deploymentId}`}>编辑</Link>}
              </Menu.Item>

              {r.suspensionState === 1 ?
                <Menu.Item key="2" icon={<PauseCircleOutlined/>} onClick={async () => {
                  try {
                    const res = await updateState(2, r.deploymentId);
                    message.success(res ? "挂起成功" : "挂起失败");
                    actionRef.current?.reload();
                  } catch (e: any) {
                    message.error(e.message);
                  }
                }}>挂起</Menu.Item> :
                <Menu.Item key="2" icon={<PlaySquareOutlined/>} onClick={async () => {
                  try {
                    const res = await updateState(1, r.deploymentId);
                    message.success(res ? "激活成功" : "激活失败");
                    actionRef.current?.reload();
                  } catch (e: any) {
                    message.error(e.message);
                  }
                }}>激活</Menu.Item>}

              <Menu.Item key="3" icon={<DeleteOutlined/>} onClick={async () => {
                try {
                  const res = await deleteDefinition(r.deploymentId);
                  message.success(res ? "删除成功" : "删除失败");
                  actionRef.current?.reload();
                } catch (e: any) {
                  message.error(e.message);
                }
              }}>删除</Menu.Item>
            </Menu>
          )
        }} placement="bottomCenter">
          <Button type="dashed">
            <EllipsisOutlined/>
          </Button>
        </Dropdown>,
      ],
    },
  ];

  return (
    <div>
      <div style={{marginBottom: 10}}>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          toolbar={{
            title: '流程定义',
            tooltip: '😓',
            actions: [
              <Button key="add" type="primary" icon={<PlusOutlined/>}
                      onClick={() => history.push("/flow/flowdesigner")}>
                新增
              </Button>,
              <ModalForm
                width={window.screen.width / 5}
                title="bpmn20.xml 文件导入"
                formRef={formRef}
                trigger={<Button type="dashed" icon={<UploadOutlined/>}>导入</Button>}
                submitter={{
                  searchConfig: {
                    submitText: '确认',
                    resetText: '取消',
                  },
                }}
                onFinish={async (values) => {
                  try {
                    const res = await importFile(values.processName, values.processCategory, uploadFile);
                    if (res === "导入成功") {
                      message.success(res);
                    } else {
                      message.error(res);
                    }
                    actionRef.current?.reload();
                  } catch (e: any) {
                    message.error(e.message);
                  }
                  formRef.current?.resetFields();
                  return true;
                }}
              >
                <Dragger multiple={false} maxCount={1} onChange={(v) => {
                  setUploadFile(v.file.originFileObj);
                }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Dragger>
                <Divider plain style={{fontSize: 4, color: "red"}}>提示：仅允许导入“bpmn20.xml”格式文件！</Divider>
                <ProFormText rules={[{required: true, message: '这是必填项'}]} width="md" name="processName" label="流程名称"/>
                <ProFormText rules={[{required: true, message: '这是必填项'}]} width="md" name="processCategory"
                             label="流程分类"/>
              </ModalForm>,
            ],
          }}
          request={async (params) => {
            let list: DefinitionDetail[] = [];
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
    </div>
  );
};
