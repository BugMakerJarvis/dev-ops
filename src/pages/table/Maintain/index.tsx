import {ColumnTypeSelectOptions} from '@/ModelDefines';
import {currentUser} from '@/services/ant-design-pro/api';
import {
  defineTable, deleteTableColumn, queryDynamicTableConf, queryDynamicTables, queryRelationTables
} from '@/services/dynamic-table/define';
import {PlusOutlined, SettingOutlined, TableOutlined} from '@ant-design/icons';
import ProForm, {
  ModalForm,
  ProFormCheckbox,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormSelect, ProFormText
} from '@ant-design/pro-form';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {Button, message, Space} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {useModel, getIntl, getLocale} from 'umi';
import DynamicTableList from './components/DynamicTableList';
import UpdateColumn from "./components/UpdateColumn";
import UpdateTable from "./components/UpdateTable";

export default (): React.ReactNode => {
  const {messages} = getIntl(getLocale());
  const actionRef = useRef<ActionType>();
  const tableListRef = useRef<any>(messages['pages.dynamicTable.table.list']);
  const {initialState, setInitialState} = useModel('@@initialState');
  const [creatorState, setCreatorState] = useState<{
    defineTable?: boolean,
    updateTable?: boolean,
    defineTableColumn?: boolean,
    columnsEditor?: boolean,
    dynamicTable?: MODEL.DynamicTable,
    dynamicTableColumn?: MODEL.DynamicTableColumn,
    loadingState?: {
      editColumnsLoading?: boolean
    },
    dynamicTables?: MODEL.DynamicTable[],
    relationTables?: MODEL.DynamicTable[]
    totalRelationTables?: MODEL.DynamicTable[],
    hasRelationTables?: any[],
  }>({
    defineTable: false,
    updateTable: false,
    defineTableColumn: false,
    columnsEditor: false,
    dynamicTable: undefined,
    dynamicTableColumn: undefined,
    loadingState: {
      editColumnsLoading: false
    },
    dynamicTables: [],
    relationTables: [],
    totalRelationTables: [],
    hasRelationTables: []
  });

  const columns: ProColumns<MODEL.DynamicTableColumn>[] = [
    {
      title: messages['pages.dynamicTable.field.name'],    //表头显示的名称
      dataIndex: 'confKey', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
      align: "center",
    },
    {
      title: messages['pages.dynamicTable.field.nickName'],
      dataIndex: 'confNickKey',
      align: "center",
    },
    {
      title: messages['pages.dynamicTable.field.type'],
      dataIndex: 'confKeyType',
      align: "center",
    },
    {
      title: messages['pages.dynamicTable.field.sort'],
      dataIndex: 'confKeySort',
      align: "center",
    },
    {
      title: messages['pages.dynamicTable.field.version'],
      dataIndex: 'confVersion',
      align: "center",
    },
    {
      title: messages['pages.dynamicTable.field.createTime'],
      dataIndex: 'createTime',
      align: "center",
    },
    {
      title: messages['pages.dynamicTable.field.option'],
      valueType: 'option',
      align: "center",
      render: (_text, record) => [
        <a
          key="editable"
          onClick={() => {
            setCreatorState({
              ...creatorState,
              dynamicTableColumn: record,
              defineTableColumn: true
            })
          }}
        >
          {messages['pages.dynamicTable.field.a.config']}
        </a>,
        <a
          key="deletable"
          onClick={async () => {
            try {
              const d = await deleteTableColumn(record.tableName, record.id);
              if (d) {
                actionRef.current?.reload();
              } else {
                message.warning(messages['pages.dynamicTable.warning.field.delete']);
              }
            } catch (e) {
            }
          }}
        >
          {messages['pages.dynamicTable.field.a.delete']}
        </a>
      ],
    },
  ];

  const loadDynamicTables = () => {
    return queryDynamicTables().then(d => {
      setCreatorState({
        ...creatorState,
        dynamicTables: d.rows
      })
      return Promise.resolve(true)
    })
  }

  useEffect(() => {
    if (initialState?.currentUser !== undefined && initialState.currentUser !== null) {
      loadDynamicTables().then(() => {
        queryRelationTables().then(v => {
          if (v) {
            setCreatorState({
              ...creatorState,
              totalRelationTables: v,
              relationTables: v
            })
          }
        })
      })
    } else {
      currentUser().then(u => {
        if (u) {
          setInitialState({
            ...initialState,
            currentUser: u.data
          })
        }
        return u;
      }).then(() => {
        return loadDynamicTables()
      }).then(() => {
        queryRelationTables().then(v => {
          if (v) {
            setCreatorState({
              ...creatorState,
              totalRelationTables: v,
              relationTables: v
            })
          }
        })
      })
    }
  }, [])

  let initialColumnForm = undefined;
  if (creatorState.dynamicTableColumn) {
    initialColumnForm = {...creatorState.dynamicTableColumn};
    if (initialColumnForm.confKeyMeta !== undefined && initialColumnForm.confKeyMeta !== '') {
      initialColumnForm.confKeyMeta = typeof initialColumnForm.confKeyMeta === 'string' ? JSON.parse(initialColumnForm.confKeyMeta) : {};
      for (const name in initialColumnForm.confKeyMeta) {
        initialColumnForm[`meta.${name}`] = initialColumnForm.confKeyMeta[name];
      }
    }

    console.log('配置字段：', initialColumnForm)
  }

  const relaTables = {};

  if (creatorState.totalRelationTables) {
    for (let i = 0; i < creatorState.totalRelationTables.length; i++) {
      const m: MODEL.DynamicTable = creatorState.totalRelationTables[i];
      relaTables[m.tableName] = m.tableNickName;
    }
  }

  return (
    <div>
      <div style={{marginBottom: 10}}>
        {creatorState.dynamicTable ?
          <div>
            <Space>
              <Button key="1" type={"dashed"} size="middle" onClick={() => {
                setCreatorState({
                  ...creatorState,
                  updateTable: true
                })
              }}>
                <SettingOutlined/>
                {messages['pages.dynamicTable.table.config']}
              </Button>
              <Button key="2" type="primary" onClick={() => {
                setCreatorState({
                  ...creatorState,
                  defineTable: true
                })
              }}>
                <TableOutlined/>
                {messages['pages.dynamicTable.table.create']}
              </Button>
              {/*Todo: Click on a button => new page*/}
              {/*<Button key="3" type="default"*/}
              {/*        onClick={() => console.log("new page")}>*/}
              {/*  <PlusSquareOutlined/>*/}
              {/*  {messages['pages.dynamicTable.page.create']}*/}
              {/*</Button>*/}
            </Space>
          </div> : <div>
            <Space>
              <Button key="2" type="primary" onClick={() => {
                setCreatorState({
                  ...creatorState,
                  defineTable: true
                })
              }}>
                <TableOutlined/>
                {messages['pages.dynamicTable.table.create']}
              </Button>
              {/*Todo: Click on a button => new page*/}
              {/*<Button key="3" type="default"*/}
              {/*        onClick={() => console.log("new page")}>*/}
              {/*  <PlusSquareOutlined/>*/}
              {/*  {messages['pages.dynamicTable.page.create']}*/}
              {/*</Button>*/}
            </Space>
          </div>
        }
      </div>

      {
        initialState?.currentUser ? <ProTable actionRef={actionRef} tableRender={(_, dom) =>
          (
            <div
              style={{
                display: 'flex',
                width: '100%',
              }}
            >
              <DynamicTableList ref={tableListRef} onTableSelect={t => {
                setCreatorState({
                  ...creatorState,
                  dynamicTable: t
                })
              }}/>
              <div style={{flex: 1,}}>
                {dom}
              </div>
            </div>)} search={{filterType: 'light'}} params={{
          tableName: creatorState.dynamicTable ? creatorState.dynamicTable.tableName : undefined
        }} columns={columns} request={async (params) => {
          try {
            if (params.tableName === undefined || params.tableName === '') {
              return {
                data: [],
                success: true,
                total: 0
              }
            }
            const d = await queryDynamicTableConf(params.tableName);
            return d ? {
              data: d.columns ? d.columns : [],
              success: true,
              total: d.columns ? d.columns.length : 0
            } : {
              data: [],
              success: true,
              total: 0
            }
          } catch (e) {
            return {
              data: undefined,
              success: false
            }
          }
        }} rowKey="id" toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined/>} type="primary"
                  disabled={!creatorState.dynamicTable} onClick={() => {
            setCreatorState({
              ...creatorState,
              defineTableColumn: true,
            })
          }}>
            {messages['pages.dynamicTable.field.create']}
          </Button>
        ]}
        /> : null
      }

      <ModalForm visible={creatorState.defineTable} width={window.screen.width * 4 / 5}
                 title={messages['pages.dynamicTable.table.define']} modalProps={{
        onCancel: () => {
          setCreatorState({
            ...creatorState,
            defineTable: false
          })
        }
      }} onFinish={async (values) => {
        const cols: any[] = values.columns ? values.columns : [];
        if (cols.length === 0) {
          message.warning(messages['pages.dynamicTable.warning.table.atLeastOneField'])
          return
        }
        try {
          const is = await defineTable({
            define: {
              tableName: values.tableName,
              tableNickName: values.tableNickName
            },
            columns: cols.map(v => {
              const meta = {};
              for (const name in v) {
                if (name.startsWith('meta')) {
                  const metaKey = name.substring(5);
                  meta[metaKey] = v[name];
                }
              }
              const clm = {
                confKey: v.confKey,
                confKeyType: v.confKeyType,
                confNickKey: v.confNickKey,
                confKeyMeta: JSON.stringify(meta)
              }
              return clm;
            })
          });

          setCreatorState({
            ...creatorState,
            defineTable: false
          })
          if (is) {
            message.success(messages['pages.dynamicTable.success.table.create'])
            actionRef.current?.reload(true)
          } else {
            message.warning(messages['pages.dynamicTable.warning.table.create'])
          }
        } catch (e: any) {
          message.error(messages['pages.dynamicTable.error.table.define'] + e.message);
        }
      }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="tableName"
            label={messages['pages.dynamicTable.table.name']}
            placeholder={messages['pages.dynamicTable.table.name.placeholder'].toString()}
            required
          />
          <ProFormText
            width="md" name="tableNickName"
            label={messages['pages.dynamicTable.table.nickName']}
            placeholder={messages['pages.dynamicTable.table.nickName.placeholder'].toString()}/>
        </ProForm.Group>
        <ProFormList name="columns" label={messages['pages.dynamicTable.field.list']}>
          <ProFormGroup>
            <ProFormText
              rules={[
                {
                  required: true,
                },
              ]}
              name="confKey"
              label={messages['pages.dynamicTable.field.name']}
              placeholder={messages['pages.dynamicTable.field.name.placeholder'].toString()}
              width="sm"
            />
            <ProFormText
              rules={[
                {
                  required: true,
                },
              ]}
              name="confNickKey"
              label={messages['pages.dynamicTable.field.nickName']}
              width="sm"
            />
            <ProFormSelect
              label={messages['pages.dynamicTable.field.type']}
              name="confKeyType"
              required
              width="xs"
              options={ColumnTypeSelectOptions}
            />
            <ProFormDigit name="meta.width" label={messages['pages.dynamicTable.field.meta.length']} width="sm"/>
            <ProFormCheckbox name="meta.isNotNull" label={messages['pages.dynamicTable.field.meta.isNotNull']}
                             width="xs"/>
            <ProFormText name="meta.comment" label={messages['pages.dynamicTable.field.meta.comment']} width="sm"/>
          </ProFormGroup>
        </ProFormList>
      </ModalForm>

      {/** 配置字段 */}
      <UpdateColumn tableName={creatorState.dynamicTable?.tableName} visible={creatorState.defineTableColumn}
                    column={creatorState.dynamicTableColumn} onDismiss={() => {
        setCreatorState({
          ...creatorState,
          defineTableColumn: false,
          dynamicTableColumn: undefined
        })
      }} onSubmitSuccess={() => {
        setCreatorState({
          ...creatorState,
          defineTableColumn: false,
          dynamicTableColumn: undefined
        })
        actionRef.current?.reload();
      }}/>
      {/** 配置库表 */}
      <UpdateTable table={creatorState.dynamicTable} visiable={creatorState.updateTable} onDismiss={() => {
        setCreatorState({
          ...creatorState,
          updateTable: false
        })
      }} onUpdateSuccess={async () => {
        const tableConf = await queryDynamicTableConf(creatorState.dynamicTable!.tableName);
        const updateCreatorState = Object.assign({}, creatorState, {"dynamicTable": tableConf.define});
        setCreatorState({
          ...updateCreatorState,
          updateTable: false
        })

        if (tableListRef) {
          console.log('刷新列表页', tableListRef)
          tableListRef.current.reloadTables();
        }
      }}/>
    </div>
  );
}
