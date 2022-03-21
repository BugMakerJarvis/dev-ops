import React, {useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {definitionList, deleteDefinition, importFile, updateState} from "@/services/flow/definition";
import {Button, Dropdown, Menu, Upload, message, Tag, Divider, Modal} from "antd";
import {
  BlockOutlined,
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
import ProCard from "@ant-design/pro-card";
import {addDeployForm, formList, getFormInfo} from "@/services/flow/form";
// @ts-ignore
import {GenerateForm, GenerateFormRef} from "react-form-create";
// import BpmnView from "@/components/BpmnView";

const {Dragger} = Upload;

type FormDetail = {
  formId: number,
  formName: string,
  formContent: string,
};

type FormListProps = {
  deploymentId: string,
  onRowChange: (formContent: string) => void;
  onVisibleChange: (visible: boolean) => void;
};

const FormList: React.FC<FormListProps> = (props) => {
  const {deploymentId, onRowChange, onVisibleChange} = props;

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<FormDetail>[] = [
    {
      title: "表单编号",
      key: "formId",
      dataIndex: "formId",
      align: "center",
      search: false,
    },
    {
      title: "表单名称",
      key: "formName",
      dataIndex: "formName",
      align: "center",
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: "center",
      render: (text, r) => [
        <Button key="1" type="primary" ghost onClick={async () => {
          onVisibleChange(false);
          try {
            const res = await addDeployForm({
              "formId": r.formId,
              "deployId": deploymentId,
            });
            if (res === 1) {
              message.success("配置表单成功");
            } else {
              message.error("配置表单失败");
            }
            actionRef.current?.reload();
          } catch (e: any) {
            message.error(e.message);
          }
        }}>确认</Button>
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
        rowKey="formId"
        request={async () => {
          let list: FormDetail[] = [];
          try {
            await formList({}).then((d) => {
              list = d;
            });
          } catch (e: any) {
            message.error(e.message);
          }
          return {
            data: list,
            success: true,
            total: list.length,
          }
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              if (record.formContent) {
                onRowChange(record.formContent);
              }
            },
          };
        }}
      >
      </ProTable>
    </div>
  )
}


type DefinitionDetail = {
  deploymentId: string,
  key: string,
  category: string,
  name: string,
  formName: string,
  formId: number,
  version: number,
  suspensionState: number,
  deploymentTime: string,
}

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const formListGenerateFormRef = useRef<GenerateFormRef>(null);
  const definitionListGenerateFormRef = useRef<GenerateFormRef>(null);

  const [uploadFile, setUploadFile] = useState<Blob>(new Blob());
  const [selectedFormContent, setSelectedFormContent] = useState<string>("");
  const [isFormListModalVisible, setIsFormListModalVisible] = useState<boolean>(false);
  const [isFormContentModalVisible, setIsFormContentModalVisible] = useState<boolean>(false);
  // const [isDefModalVisible, setIsDefModalVisible] = useState<boolean>(false);
  const [defFormContent, setDefFormContent] = useState<string>("");

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
      render: (text, r) => [
        <div key="f">{r.formName === null ? <span style={{fontWeight: 'bold'}}>暂无表单</span> :
          <div>
            <a onClick={async () => {
              try {
                setIsFormContentModalVisible(true);
                const formInfo = await getFormInfo(r.formId);
                setDefFormContent(formInfo.formContent);
              } catch (e: any) {
                message.error(e.message);
              }
            }}>{r.formName}</a>
            <Modal
              visible={isFormContentModalVisible}
              width={window.screen.width * 3 / 5}
              onCancel={() => setIsFormContentModalVisible(false)}
              footer={null}
            >
              {defFormContent === "" ? null :
                <GenerateForm widgetInfoJson={defFormContent} ref={definitionListGenerateFormRef}/>}
            </Modal>
          </div>}
        </div>
      ],
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
      // sorter: true,
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

              {r.formName === null ? <Menu.Item key="2" icon={<BlockOutlined/>}>
                <a onClick={() => setIsFormListModalVisible(true)}>配置表单</a>
                <Modal
                  visible={isFormListModalVisible}
                  width={window.screen.width * 3 / 5}
                  onCancel={() => setIsFormListModalVisible(false)}
                  footer={null}
                >
                  <ProCard split="vertical">
                    <ProCard colSpan="400px" ghost>
                      <FormList deploymentId={r.deploymentId}
                                onRowChange={(formContent) => setSelectedFormContent(formContent)}
                                onVisibleChange={(visible) => {
                                  setIsFormListModalVisible(visible);
                                  actionRef.current?.reload();
                                }}/>
                    </ProCard>
                    <ProCard>
                      {selectedFormContent === "" ? null :
                        <GenerateForm widgetInfoJson={selectedFormContent} ref={formListGenerateFormRef}/>}
                    </ProCard>
                  </ProCard>
                </Modal>
              </Menu.Item> : null}

              {r.suspensionState === 1 ?
                <Menu.Item key="3" icon={<PauseCircleOutlined/>} onClick={async () => {
                  try {
                    const res = await updateState(2, r.deploymentId);
                    message.success(res ? "挂起成功" : "挂起失败");
                    actionRef.current?.reload();
                  } catch (e: any) {
                    message.error(e.message);
                  }
                }}>挂起</Menu.Item> :
                <Menu.Item key="3" icon={<PlaySquareOutlined/>} onClick={async () => {
                  try {
                    const res = await updateState(1, r.deploymentId);
                    message.success(res ? "激活成功" : "激活失败");
                    actionRef.current?.reload();
                  } catch (e: any) {
                    message.error(e.message);
                  }
                }}>激活</Menu.Item>}

              <Menu.Item key="4" icon={<DeleteOutlined/>} onClick={async () => {
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
        }} placement="bottom">
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
          rowKey="deploymentId"
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
                  // @ts-ignore
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
