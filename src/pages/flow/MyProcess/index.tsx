import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Tag, Modal, Button, Dropdown, Menu, message } from 'antd';
import { myProcess, stopProcess } from '@/services/flow/task';
import { definitionList } from '@/services/flow/definition';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { history } from '@@/core/history';
import { deleteInstance } from '@/services/flow/instance';
import { getIntl, getLocale } from '@@/plugin-locale/localeExports';

const { messages } = getIntl(getLocale());

type DefDetail = {
  deploymentId: string;
  id: string;
  name: string;
  version: number;
  category: string;
};

type DefListProps = {
  onVisibleChange: (visible: boolean) => void;
};

const DefList: React.FC<DefListProps> = (props) => {
  const { onVisibleChange } = props;

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<DefDetail>[] = [
    {
      title: messages['pages.flow.definition.field.name'],
      key: 'name',
      dataIndex: 'name',
      width: 190,
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.definition.field.version'],
      key: 'version',
      dataIndex: 'version',
      valueType: 'digit',
      width: 190,
      align: 'center',
      search: false,
      render: (text, r) => [
        <Tag key="v" color="yellow">
          v{r.version}
        </Tag>,
      ],
    },
    {
      title: messages['pages.flow.definition.field.category'],
      key: 'category',
      dataIndex: 'category',
      width: 190,
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.definition.field.option'],
      key: 'option',
      valueType: 'option',
      width: 190,
      align: 'center',
      render: (text, r) => [
        <Button
          key="1"
          type="primary"
          ghost
          onClick={() => {
            onVisibleChange(false);
            history.push(
              `/flow/taskrecord?deployId=${r.deploymentId}&procDefId=${r.id}&handleType=newProcess`,
            );
          }}
        >
          {messages['pages.flow.myprocess.field.option.launch']}
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
        rowKey="name"
        request={async (params) => {
          let list: DefDetail[] = [];
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
      ></ProTable>
    </div>
  );
};

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();

  const [isDefListModalVisible, setIsDefListModalVisible] = useState<boolean>(false);

  const columns: ProColumns<MODEL.TaskDetail>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: messages['pages.flow.myprocess.field.deployId'],
      key: 'deployId',
      dataIndex: 'deployId',
      align: 'center',
      copyable: true,
      // ellipsis: true,
      search: false,
      width: 300,
    },
    {
      title: messages['pages.flow.myprocess.field.procDefName'],
      key: 'procDefName',
      dataIndex: 'procDefName',
      align: 'center',
    },
    {
      title: messages['pages.flow.myprocess.field.category'],
      key: 'category',
      dataIndex: 'category',
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.myprocess.field.version'],
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
      title: messages['pages.flow.myprocess.field.createTime'],
      key: 'createTime',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 160,
      align: 'center',
      // sorter: true,
    },
    {
      title: messages['pages.flow.myprocess.field.procStatus'],
      key: 'procStatus',
      dataIndex: 'procStatus',
      align: 'center',
      search: false,
      render: (text, r) => [
        r.finishTime === null ? (
          <Tag key="v" color="green">
            {messages['pages.flow.myprocess.field.procStatus.ongoing']}
          </Tag>
        ) : (
          <Tag key="v" color="red">
            {messages['pages.flow.myprocess.field.procStatus.finished']}
          </Tag>
        ),
      ],
    },
    {
      title: messages['pages.flow.myprocess.field.duration'],
      key: 'duration',
      dataIndex: 'duration',
      width: 160,
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.myprocess.field.taskName'],
      key: 'taskName',
      dataIndex: 'taskName',
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.myprocess.field.assigneeName'],
      key: 'assigneeName',
      dataIndex: 'assigneeName',
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.myprocess.field.option'],
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (text, r) => [
        <Dropdown
          key="menu"
          overlay={() => {
            return (
              <Menu>
                <Menu.Item
                  key="1"
                  icon={<InfoCircleOutlined />}
                  onClick={() => {
                    history.push(
                      `/flow/taskrecord?procInsId=${r.procInsId}&deployId=${r.deployId}&taskId=${r.taskId}&handleType=info`,
                    );
                  }}
                >
                  {messages['pages.flow.myprocess.field.option.detail']}
                </Menu.Item>

                <Menu.Item
                  key="2"
                  icon={<CloseCircleOutlined />}
                  onClick={async () => {
                    try {
                      const res = await stopProcess({ instanceId: r.procInsId });
                      if (res) {
                        message.success(messages['pages.flow.myprocess.response.cancel.success']);
                      } else {
                        message.error(messages['pages.flow.myprocess.response.cancel.fail']);
                      }
                      actionRef.current?.reload();
                    } catch (e: any) {
                      // message.error(e.message);
                    }
                  }}
                >
                  {messages['pages.flow.myprocess.field.option.cancel']}
                </Menu.Item>

                <Menu.Item
                  key="3"
                  icon={<DeleteOutlined />}
                  onClick={async () => {
                    try {
                      const res = await deleteInstance(r.procInsId, '');
                      if (res) {
                        message.success(
                          messages['pages.flow.myprocess.response.delete'] +
                            ` ${r.procInsId} ` +
                            messages['pages.flow.myprocess.response.delete.success'],
                        );
                      } else {
                        message.success(
                          messages['pages.flow.myprocess.response.delete'] +
                            ` ${r.procInsId} ` +
                            messages['pages.flow.myprocess.response.delete.fail'],
                        );
                      }
                      actionRef.current?.reload();
                    } catch (e: any) {
                      message.error(e.message);
                    }
                  }}
                >
                  {messages['pages.flow.myprocess.field.option.delete']}
                </Menu.Item>
              </Menu>
            );
          }}
          placement="bottomCenter"
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
          rowKey="procInsId"
          search={{ labelWidth: 'auto' }}
          toolbar={{
            title: messages['pages.flow.myprocess'],
            tooltip: '😓',
            actions: [
              <div>
                <Button
                  type="primary"
                  onClick={() => setIsDefListModalVisible(true)}
                  icon={<PlusOutlined />}
                >
                  {messages['pages.flow.myprocess.action.new']}
                </Button>
                <Modal
                  visible={isDefListModalVisible}
                  width={(window.screen.width * 3) / 5}
                  onCancel={() => setIsDefListModalVisible(false)}
                  footer={null}
                >
                  <DefList
                    onVisibleChange={(visible) => {
                      setIsDefListModalVisible(visible);
                      actionRef.current?.reload();
                    }}
                  />
                </Modal>
              </div>,
            ],
          }}
          request={async (params) => {
            let list: MODEL.TaskDetail[] = [];
            try {
              await myProcess(
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
