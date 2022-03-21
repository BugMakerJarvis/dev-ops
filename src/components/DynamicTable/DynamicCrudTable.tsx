import {
  deleteRecords,
  queryDynamicTableData,
  exportTableData,
  exportTableTemplate, importTableRows
} from "@/services/dynamic-table/define";
import {MinusOutlined, PlusOutlined, DownloadOutlined, TagOutlined, InboxOutlined} from "@ant-design/icons";
import {
  ProFormDateRangePicker,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-form";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import {Button, Divider, Result, Space, Table, Upload} from "antd";
import Tag from "antd/es/tag";
import Modal from "antd/lib/modal/Modal";
import React from "react";
import type {DynamicTablePros, DynamicTableViewProps} from "./types";
import UpdateTableRecord from "./UpdateTableRecord";
import {getIntl, getLocale} from "@@/plugin-locale/localeExports";

const {messages} = getIntl(getLocale());

const {Dragger} = Upload;

class CommonProTable extends React.PureComponent<DynamicTableViewProps & DynamicTablePros, {
  editRecord?: boolean,
  importRecords?: boolean,
  column?: any,
  selectIds?: (string | number)[],
  queryError?: API.ResponseStatus
}> {

  state = {
    editRecord: false,
    importRecords: false,
    column: undefined,
    selectIds: [],
    queryError: undefined
  }

  actionRef: ActionType | undefined = undefined;

  getColumns(): ProColumns<any>[] {
    // let table: MODEL.DynamicTable = this.props.define!;
    const columns: MODEL.DynamicTableColumn[] = this.props.columns!;

    if (!columns || columns.length === 0) return [];
    let displayColumns: MODEL.DynamicTableColumn[] = columns;
    if (this.props.columnsFilter) {
      if (typeof this.props.columnsFilter === 'function') {
        displayColumns = [];
        columns.forEach(v => {
          // @ts-ignore
          if (this.props.columnsFilter(v.confKey)) {
            displayColumns.push(v);
          }
        });
      } else {
        displayColumns = [];
        columns.forEach(v => {
          let has = false;
          for (let i = 0; i < this.props.columnsFilter!.length; i++) {
            const item: string = this.props.columnsFilter![i];
            has = v.confKey === item;
            if (has) break;
          }

          if (has) {
            displayColumns.push(v);
          }
        });
      }
    }
    // @ts-ignore
    const rows: ProColumns<any>[] = displayColumns.map<ProColumns<any>>((v) => {
      let m: MODEL.TableColumnQueryMeta | undefined = undefined;
      if (v.confKeyQueryMeta) {
        m = typeof v.confKeyQueryMeta === 'string' ? JSON.parse(v.confKeyQueryMeta) : v.confKeyQueryMeta;
      }

      if (v.confKeyType === 'TAGS') {
        return {
          dataIndex: v.confKey,
          title: v.confNickKey,
          valueType: 'labels',
          search: false,
          renderFormItem: (_, {defaultRender}) => {
            return defaultRender(_);
          },
          render: (_, record) => {
            const tags: string[] = record[v.confKey] && record[v.confKey].length > 0 ? (typeof record[v.confKey] === 'string' ? JSON.parse(record[v.confKey]) : record[v.confKey]) : [];
            // let labels: Array<string> = record[v.confKey]
            if (tags.length <= 0) return <p>-</p>
            return <Space size={[4, 8]} wrap>
              {tags.map((vv: string) => (<Tag key={`${record.id}-${v}`} icon={<TagOutlined/>} color="blue">
                {vv}
              </Tag>))}
            </Space>
          },
        }
      }

      if (v.confKeyType === 'SELECT') {
        const ve = {};
        if (m && m.selectArrays) {
          m.selectArrays.forEach(mm => {
            ve[mm.value] = mm.label
          })
        }
        return {
          dataIndex: v.confKey,
          title: v.confNickKey,
          valueType: 'select',
          valueEnum: ve,
          renderFormItem: (_, {type, defaultRender, ...rest}) => {
            if (m) {
              if (m.canFilter !== undefined && !m.canFilter) return null
            }

            const options: any[] = [];
            if (m && m.selectArrays) {
              // options.push({
              //   label: '全部',
              //   value: undefined
              // })
              m.selectArrays.forEach(vvv => {
                options.push(vvv);
              })
            }
            return <ProFormSelect {...rest} name={v.confKey} options={options}/>;
          }
        }
      }


      return {
        dataIndex: v.confKey,
        title: v.confNickKey,
        valueType: 'text',
        align: 'center',
        renderFormItem: (_, {type, defaultRender, ...rest}) => {
          if (type === 'form') {
            return null;
          }

          if (v.confKeyType === 'ASSETS' || v.confKeyType === 'MULTIASSETS' || v.confKeyType === 'TEXT' || v.confKeyType === 'TAGS') return null;
          if (m) {
            // let m: MODEL.TableColumnQueryMeta = typeof v.confKeyQueryMeta === 'string' ? JSON.parse(v.confKeyQueryMeta) : v.confKeyQueryMeta;
            if (m.canFilter !== undefined && !m.canFilter) return null
          }

          switch (v.confKeyType) {
            case 'VARCHAR':
              return <ProFormText {...rest} name={v.confKey} width="sm"/>
            case 'DATE':
              return <ProFormDateRangePicker {...rest} name={v.confKey} width="sm"/>
            case 'DATETIME':
              return <ProFormDateTimeRangePicker {...rest} name={v.confKey} width="sm"/>
            case 'INT':
              return <ProFormDigit {...rest} name={v.confKey} width="sm" fieldProps={{precision: 0}}/>
            case 'DOUBLE':
              return <ProFormDigit {...rest} name={v.confKey} width="sm"/>
            default:
              break;
          }
          return defaultRender(_);
        },
      }
    });

    if (this.props.options === undefined || this.props.options.editAble === undefined || this.props.options.editAble) {
      rows.push({
        title: messages['pages.dynamicTable.record.text.option'],
        valueType: 'option',

        render: (text, record) => [
          <a
            key="editable"
            onClick={() => {
              this.setState({
                editRecord: true,
                column: record
              })
            }}
          >
            {messages['pages.dynamicTable.record.a.update']}
          </a>
        ]
      })
    }
    return rows;
  }


  renderTopBar() {
    const btns = [];
    let keyIndex = 0;
    if (!this.props.options || this.props.options.createAble === undefined || this.props.options.createAble) {
      btns.push(<Button key={`${keyIndex}`} type="primary" onClick={() => {
        this.setState({
          editRecord: true,
          column: undefined
        })
      }}>
        <PlusOutlined/>
        {messages['pages.dynamicTable.record.button.create']}
      </Button>);
      keyIndex++;
    }

    if (!this.props.options || this.props.options.importExcelAble === undefined || this.props.options.importExcelAble) {
      btns.push(<Button key={`${keyIndex}`} type="ghost" onClick={() => {
        this.setState({
          importRecords: true
        })
      }}>
        <PlusOutlined/>
        {messages['pages.dynamicTable.record.button.batchImport']}
      </Button>);
      keyIndex++;
    }

    if ((this.state.selectIds !== undefined && this.state.selectIds.length > 0) && (!this.props.options || this.props.options.deleteAble === undefined || this.props.options.deleteAble)) {
      btns.push(<Button key={`${keyIndex}`} type="dashed" onClick={async () => {
        try {
          const d = await deleteRecords(this.props.define?.tableName, this.state.selectIds);
          if (d !== undefined) {
            this.setState({
              selectIds: []
            }, this.actionRef!.reloadAndRest);
          }
        } catch (error) {

        }
      }}>
        <MinusOutlined/>
        {messages['pages.dynamicTable.record.button.delete']}
      </Button>);
      keyIndex++;
    }

    return btns;
  }

  render() {
    const props = this.props;
    // @ts-ignore
    if (this.state.queryError && this.state.queryError.code === 1011) {
      // @ts-ignore
      return <Result status={403} title="403 Forbidden" subTitle={this.state.queryError.message}/>
    }
    const col: any = this.state.column || {};

    let uploadFile: Blob = new Blob();

    return <div>
      {/*@ts-ignore*/}
      <ProTable actionRef={(a: ActionType) => {
        this.actionRef = a;
      }}
                columns={this.getColumns()}
        // 控制多选 rowKey
                rowKey={record => record.id}
                tableLayout="fixed"
                toolBarRender={this.renderTopBar.bind(this)}
                rowSelection={!this.props.options || this.props.options.deleteAble === undefined || this.props.options.deleteAble ? {
                  selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                  onChange: (arg1, arg2) => {
                    if (arg2 === undefined || arg2.length <= 0) {
                      this.setState({
                        selectIds: []
                      })
                      return
                    }
                    const ids: (string | number)[] = [];
                    for (let i = 0; i < arg2.length; i++) {
                      const item: any = arg2[i];
                      if (item && item.id !== undefined) {
                        ids.push(item.id);
                      }
                    }
                    this.setState({
                      selectIds: ids
                    })
                  }
                } : false}
                request={async (params) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  params.eq_name && params.eq_name.trim()
                  const queryParams = {
                    params: {},
                    pager: {
                      pageSize: 20,
                      pageNo: 1
                    }
                  }

                  if (params) {
                    for (const name in params) {
                      if (name === 'current') queryParams.pager.pageNo = params[name] as number
                      else if (name === 'pageSize') queryParams.pager.pageSize = params[name] as number
                      else {
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        params[name] && (queryParams.params[name] = params[name]);
                      }
                    }
                  }

                  if (props.initialParams) {
                    queryParams.params = {
                      ...queryParams.params,
                      ...props.initialParams
                    }
                  }

                  try {
                    const data = await queryDynamicTableData(props.define?.tableName, queryParams)

                    return {
                      data: data.rows,
                      total: data.total,
                      success: true
                    }
                  } catch (error: any) {
                    const queryError: API.ResponseStatus = {
                      code: 1001,
                    }
                    if (error && error.code) {
                      queryError.code = error.code;
                      queryError.message = error.message;
                    }

                    this.setState({
                      queryError
                    })
                  }
                  return {
                    data: [],
                    success: true
                  }
                }}
                search={this.props.options !== undefined && this.props.options.searchAble !== undefined && !this.props.options.searchAble ? false : {
                  defaultCollapsed: true,
                  optionRender: (searchConfig, formProps, dom) => {
                    if (this.props.options && this.props.options.exportExcelAble !== undefined && !this.props.options.exportExcelAble) {
                      return dom.reverse()
                    }
                    return [
                      ...dom.reverse(),
                      <Button key="out" onClick={async () => {
                        try {
                          const blob = await exportTableData(this.props.define?.tableName, searchConfig.form?.getFieldsValue());
                          const a: any = document.createElement("a");
                          document.body.appendChild(a);
                          a.style = "display: none";
                          const csvUrl = URL.createObjectURL(blob);
                          a.href = csvUrl;
                          a.download = `${this.props.define?.tableNickName}.xlsx`;
                          a.click();
                          URL.revokeObjectURL(a.href)
                          a.remove();
                        } catch (e) {
                          console.log('动态表格', '导出出错：', e);
                        }
                      }}>{messages['pages.dynamicTable.record.button.export']}</Button>,
                    ]
                  },
                }}/>
      <UpdateTableRecord onDismiss={() => {
        this.setState({
          editRecord: false,
          column: undefined
        })
      }} visible={this.state.editRecord} define={this.props.define} columns={this.props.columns}
                         record={this.state.column} editCallback={is => {
        if (is && this.actionRef) {
          this.setState({
            editRecord: false,
            column: undefined
          }, this.actionRef.reload);
        }
      }} initialParams={{
        ...col,
        ...this.props.initialParams,
      }}/>
      <Modal title={messages['pages.dynamicTable.record.button.batchImport']} visible={this.state.importRecords}
             onCancel={() => {
               this.setState({
                 importRecords: false,
               })
             }}
             footer={[
               <Button type="primary" key="confirm" onClick={() => {
                 try {
                   const formData = new FormData();
                   formData.append("file", uploadFile);
                   formData.append("table", this.props.define!.tableName);
                   formData.append("params", this.props.initialParams ? JSON.stringify(this.props.initialParams) : "{}")
                   const res = importTableRows(formData);
                   console.log(res);
                 } catch (e: any) {
                   console.log(e.message);
                 }
                 this.setState({
                   importRecords: false,
                 });
                 this.actionRef?.reload();
               }}>
                 {messages['pages.dynamicTable.button.confirm']}
               </Button>
             ]}
      >
        <Button onClick={async () => {
          try {
            const blob = await exportTableTemplate(this.props.define?.tableName);
            const a: any = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            const csvUrl = URL.createObjectURL(blob);
            a.href = csvUrl;
            a.download = `${this.props.define?.tableNickName}-Template.xlsx`;
            a.click();
            URL.revokeObjectURL(a.href)
            a.remove();
          } catch (e) {
            console.log('动态表格', '导出出错：', e);
          }
        }}>
          <DownloadOutlined/>
          {messages['pages.dynamicTable.record.button.downloadTemplate']}
        </Button>
        <Divider/>

        <Dragger multiple={false} maxCount={1} onChange={(v) => {
          // @ts-ignore
          uploadFile = v.file.originFileObj;
        }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>

        <Divider plain style={{fontSize: 4, color: "red"}}>{messages['pages.dynamicTable.record.text.xlsx']}</Divider>
      </Modal>
    </div>
  }
}

export default class DynamicCrudTable extends React.PureComponent<DynamicTableViewProps & DynamicTablePros, DynamicTableViewProps & {}> {
  constructor(props: DynamicTableViewProps & DynamicTablePros) {
    super(props);
    this.state = {
      define: props.define,
      columns: props.columns
    }
  }

  UNSAFE_componentWillReceiveProps(props: DynamicTableViewProps) {
    if (props.define || props.columns) {
      this.setState({
        define: props.define,
        columns: props.columns
      })
    }
  }

  render() {
    if (!this.state.define || !this.state.columns) return null;
    return <CommonProTable {...this.state} {...this.props} />;
  }
}
