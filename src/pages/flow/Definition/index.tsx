import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  definitionList,
  deleteDefinition,
  importFile,
  updateState,
} from '@/services/flow/definition';
import { Button, Dropdown, Menu, Upload, message, Tag, Divider, Modal } from 'antd';
import {
  BlockOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  InboxOutlined,
  PauseCircleOutlined,
  PlaySquareOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Link, history } from 'umi';
import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { addDeployForm, formList, getFormInfo } from '@/services/flow/form';
// @ts-ignore
import { GenerateForm, GenerateFormRef } from 'react-form-create';
import { getIntl, getLocale } from '@@/plugin-locale/localeExports';
// import BpmnView from "@/components/BpmnView";

const { Dragger } = Upload;

const { messages } = getIntl(getLocale());

type FormDetail = {
  formId: number;
  formName: string;
  formContent: string;
};

type FormListProps = {
  deploymentId: string;
  onRowChange: (formContent: string) => void;
  onVisibleChange: (visible: boolean) => void;
};

const FormList: React.FC<FormListProps> = (props) => {
  const { deploymentId, onRowChange, onVisibleChange } = props;

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<FormDetail>[] = [
    {
      title: messages['pages.flow.form.field.formId'],
      key: 'formId',
      dataIndex: 'formId',
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.form.field.formName'],
      key: 'formName',
      dataIndex: 'formName',
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.form.field.option'],
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (text, r) => [
        <Button
          key="1"
          type="primary"
          ghost
          onClick={async () => {
            onVisibleChange(false);
            try {
              const res = await addDeployForm({
                formId: r.formId,
                deployId: deploymentId,
              });
              if (res === 1) {
                message.success(messages['pages.flow.definition.response.form.success']);
              } else {
                message.error(messages['pages.flow.definition.response.form.fail']);
              }
              actionRef.current?.reload();
            } catch (e: any) {
              message.error(e.message);
            }
          }}
        >
          {messages['pages.flow.definition.button.confirm']}
        </Button>,
      ],
    },
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
          };
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
      />
    </div>
  );
};

type DefinitionDetail = {
  deploymentId: string;
  key: string;
  category: string;
  name: string;
  formName: string;
  formId: number;
  version: number;
  suspensionState: number;
  deploymentTime: string;
};

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const formListGenerateFormRef = useRef<GenerateFormRef>(null);
  const definitionListGenerateFormRef = useRef<GenerateFormRef>(null);

  const [uploadFile, setUploadFile] = useState<Blob>(new Blob());
  const [selectedFormContent, setSelectedFormContent] = useState<string>('');
  const [isFormListModalVisible, setIsFormListModalVisible] = useState<boolean>(false);
  const [isFormContentModalVisible, setIsFormContentModalVisible] = useState<boolean>(false);
  // const [isDefModalVisible, setIsDefModalVisible] = useState<boolean>(false);
  const [defFormContent, setDefFormContent] = useState<string>('');

  const columns: ProColumns<DefinitionDetail>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: messages['pages.flow.definition.field.deploymentId'],
      key: 'deploymentId',
      dataIndex: 'deploymentId',
      align: 'center',
      copyable: true,
      // ellipsis: true,
      search: false,
      width: 300,
    },
    {
      title: messages['pages.flow.definition.field.key'],
      key: 'key',
      dataIndex: 'key',
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.definition.field.category'],
      key: 'category',
      dataIndex: 'category',
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.definition.field.name'],
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: messages['pages.flow.definition.field.formName'],
      key: 'formName',
      dataIndex: 'formName',
      valueType: 'option',
      align: 'center',
      search: false,
      render: (text, r) => [
        <div key="f">
          {r.formName === null ? (
            <span style={{ fontWeight: 'bold' }}>
              {messages['pages.flow.definition.field.formName.notExist']}
            </span>
          ) : (
            <div>
              <a
                onClick={async () => {
                  try {
                    setIsFormContentModalVisible(true);
                    const formInfo = await getFormInfo(r.formId);
                    setDefFormContent(formInfo.formContent);
                  } catch (e: any) {
                    message.error(e.message);
                  }
                }}
              >
                {r.formName}
              </a>
              <Modal
                visible={isFormContentModalVisible}
                width={(window.screen.width * 3) / 5}
                onCancel={() => setIsFormContentModalVisible(false)}
                footer={null}
              >
                {defFormContent === '' ? null : (
                  <GenerateForm
                    widgetInfoJson={defFormContent}
                    ref={definitionListGenerateFormRef}
                  />
                )}
              </Modal>
            </div>
          )}
        </div>,
      ],
    },
    {
      title: messages['pages.flow.definition.field.version'],
      key: 'version',
      dataIndex: 'version',
      valueType: 'digit',
      width: 100,
      align: 'center',
      search: false,
      render: (text, r) => [
        <Tag key="v" color="yellow">
          v{r.version}
        </Tag>,
      ],
    },
    {
      title: messages['pages.flow.definition.field.suspensionState'],
      key: 'suspensionState',
      dataIndex: 'suspensionState',
      valueType: 'digit',
      align: 'center',
      search: false,
      render: (text, r) => [
        <Tag key="s" color={r.suspensionState === 1 ? 'green' : 'red'}>
          {r.suspensionState === 1
            ? messages['pages.flow.definition.field.suspensionState.activated']
            : messages['pages.flow.definition.field.suspensionState.suspended']}
        </Tag>,
      ],
    },
    {
      title: messages['pages.flow.definition.field.deploymentTime'],
      key: 'deploymentTime',
      dataIndex: 'deploymentTime',
      valueType: 'dateTime',
      width: 160,
      align: 'center',
      // sorter: true,
    },
    {
      title: messages['pages.flow.definition.field.option'],
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (text, r) => [
        <Dropdown
          key="menu"
          overlay={() => {
            return (
              <Menu>
                <Menu.Item key="1" icon={<EditOutlined />}>
                  {
                    <Link to={`/flow/flowdesigner?deployId=${r.deploymentId}`}>
                      {messages['pages.flow.definition.field.option.edit']}
                    </Link>
                  }
                </Menu.Item>

                {r.formName === null ? (
                  <Menu.Item key="2" icon={<BlockOutlined />}>
                    <a onClick={() => setIsFormListModalVisible(true)}>
                      {messages['pages.flow.definition.field.option.formConfig']}
                    </a>
                    <Modal
                      visible={isFormListModalVisible}
                      width={(window.screen.width * 3) / 5}
                      onCancel={() => setIsFormListModalVisible(false)}
                      footer={null}
                    >
                      <ProCard split="vertical">
                        <ProCard colSpan="400px" ghost>
                          <FormList
                            deploymentId={r.deploymentId}
                            onRowChange={(formContent) => setSelectedFormContent(formContent)}
                            onVisibleChange={(visible) => {
                              setIsFormListModalVisible(visible);
                              actionRef.current?.reload();
                            }}
                          />
                        </ProCard>
                        <ProCard>
                          {selectedFormContent === '' ? null : (
                            <GenerateForm
                              widgetInfoJson={selectedFormContent}
                              ref={formListGenerateFormRef}
                            />
                          )}
                        </ProCard>
                      </ProCard>
                    </Modal>
                  </Menu.Item>
                ) : null}

                {r.suspensionState === 1 ? (
                  <Menu.Item
                    key="3"
                    icon={<PauseCircleOutlined />}
                    onClick={async () => {
                      try {
                        const res = await updateState(2, r.deploymentId);
                        message.success(
                          res
                            ? messages['pages.flow.definition.response.suspend.success']
                            : messages['pages.flow.definition.response.suspend.fail'],
                        );
                        actionRef.current?.reload();
                      } catch (e: any) {
                        message.error(e.message);
                      }
                    }}
                  >
                    {messages['pages.flow.definition.field.option.suspend']}
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key="3"
                    icon={<PlaySquareOutlined />}
                    onClick={async () => {
                      try {
                        const res = await updateState(1, r.deploymentId);
                        message.success(
                          res
                            ? messages['pages.flow.definition.response.activate.success']
                            : messages['pages.flow.definition.response.activate.fail'],
                        );
                        actionRef.current?.reload();
                      } catch (e: any) {
                        message.error(e.message);
                      }
                    }}
                  >
                    {messages['pages.flow.definition.field.option.activate']}
                  </Menu.Item>
                )}

                <Menu.Item
                  key="4"
                  icon={<DeleteOutlined />}
                  onClick={async () => {
                    try {
                      const res = await deleteDefinition(r.deploymentId);
                      message.success(
                        res
                          ? messages['pages.flow.definition.response.delete.success']
                          : messages['pages.flow.definition.response.delete.fail'],
                      );
                      actionRef.current?.reload();
                    } catch (e: any) {
                      message.error(e.message);
                    }
                  }}
                >
                  {messages['pages.flow.definition.field.option.delete']}
                </Menu.Item>
              </Menu>
            );
          }}
          placement="bottom"
        >
          <Button type="dashed">
            <EllipsisOutlined />
          </Button>
        </Dropdown>,
      ],
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          rowKey="deploymentId"
          search={{ labelWidth: 'auto' }}
          toolbar={{
            title: messages['pages.flow.definition'],
            tooltip: '😓',
            actions: [
              <Button
                key="add"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => history.push('/flow/flowdesigner')}
              >
                {messages['pages.flow.definition.action.new']}
              </Button>,
              <ModalForm
                width={window.screen.width / 5}
                title={messages['pages.flow.definition.action.input.title']}
                formRef={formRef}
                trigger={
                  <Button type="dashed" icon={<UploadOutlined />}>
                    {messages['pages.flow.definition.action.input']}
                  </Button>
                }
                submitter={{
                  searchConfig: {
                    submitText: messages['pages.flow.definition.action.input.confirm'],
                    resetText: messages['pages.flow.definition.action.input.cancel'],
                  },
                }}
                onFinish={async (values) => {
                  try {
                    const res = await importFile(
                      values.processName,
                      values.processCategory,
                      uploadFile,
                    );
                    if (res === '导入成功') {
                      message.success(messages['pages.flow.definition.response.input.success']);
                    } else {
                      message.error(messages['pages.flow.definition.response.input.fail']);
                    }
                    actionRef.current?.reload();
                  } catch (e: any) {
                    message.error(e.message);
                  }
                  formRef.current?.resetFields();
                  return true;
                }}
              >
                <Dragger
                  multiple={false}
                  maxCount={1}
                  onChange={(v) => {
                    // @ts-ignore
                    setUploadFile(v.file.originFileObj);
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    {messages['pages.flow.definition.action.input.tip.upload']}
                  </p>
                </Dragger>
                <Divider
                  plain
                  style={{
                    fontSize: 10,
                    color: 'red',
                  }}
                >
                  {messages['pages.flow.definition.action.input.tip.file']}
                </Divider>
                <ProFormText
                  rules={[{ required: true }]}
                  width="md"
                  name="processName"
                  label={messages['pages.flow.definition.field.name']}
                />
                <ProFormText
                  rules={[{ required: true }]}
                  width="md"
                  name="processCategory"
                  label={messages['pages.flow.definition.field.category']}
                />
              </ModalForm>,
            ],
          }}
          request={async (params) => {
            let list: DefinitionDetail[] = [];
            try {
              await definitionList(
                1,
                params.pageSize ? params.pageSize : 10,
                params.name ? params.name : '',
                params.deployTime ? params.deployTime : '',
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
        />
      </div>
    </div>
  );
};
