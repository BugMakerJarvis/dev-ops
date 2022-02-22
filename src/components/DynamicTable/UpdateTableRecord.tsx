import {insertRecord, updateRecord} from "@/services/dynamic-table/define";
import {
  ModalForm, ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDigit, ProFormGroup, ProFormSelect, ProFormText, ProFormTextArea
} from "@ant-design/pro-form";
import {message} from "antd";
import FormItem from "antd/lib/form/FormItem";
import React from "react";
import ProFormTag from "./ProFormTag";
import type {DynamicTablePros} from "./types";
import {getIntl, getLocale} from "@@/plugin-locale/localeExports";

interface UpdateTableRecordProps extends MODEL.DynamicTableConf {
  visible?: boolean,
  onDismiss?: () => void,
  record?: any,
  editCallback?: (success: boolean) => void,
}

const {messages} = getIntl(getLocale());

export default class UpdateTableRecord extends React.PureComponent<UpdateTableRecordProps & DynamicTablePros, UpdateTableRecordProps> {
  constructor(props: UpdateTableRecordProps) {
    super(props);

    this.state = {
      visible: props.visible,
      define: props.define,
      columns: props.columns,
      record: undefined
    }
  }

  UNSAFE_componentWillReceiveProps(props: UpdateTableRecordProps) {
    this.setState({
      define: props.define,
      columns: props.columns,
      visible: props.visible === undefined ? this.state.visible : props.visible,
      record: props.record
    })
  }

  renderForms() {
    const columns: MODEL.DynamicTableColumn[] = this.props.columns!;
    const forms: any[] = [];
    let formItem: any[] = [];
    let ii = 0, groupii = 0;
    columns.forEach((m: MODEL.DynamicTableColumn) => {
      if (m.confKeyType === 'ASSETS' || m.confKeyType === 'MULTIASSETS') return;
      let queryMeta: MODEL.TableColumnQueryMeta = {};
      let columnMeta: MODEL.DynamicColumnMeta = {};
      if (m.confKeyMeta) {
        columnMeta = typeof m.confKeyMeta === 'string' ? JSON.parse(m.confKeyMeta) : m.confMeta
      }
      if (m.confKeyQueryMeta) {
        queryMeta = typeof m.confKeyQueryMeta === 'string' ? JSON.parse(m.confKeyQueryMeta) : m.confMeta
      }
      let item: any = undefined;
      if (m.confKeyType === 'VARCHAR') {
        item = <ProFormText key={`${groupii}-item-${ii}`} width="sm"
                            required={columnMeta.isNotNull !== undefined && columnMeta.isNotNull}
                            name={m.confKey} label={m.confNickKey}/>
        ii++;
      } else if (m.confKeyType === 'DATE') {
        item = <ProFormDatePicker key={`${groupii}-item-${ii}`} width="sm"
                                  required={columnMeta.isNotNull !== undefined && columnMeta.isNotNull}
                                  name={m.confKey} label={m.confNickKey}/>
        ii++;
      } else if (m.confKeyType === 'DATETIME') {
        item = <ProFormDateTimePicker key={`${groupii}-item-${ii}`} width="sm"
                                      required={columnMeta.isNotNull !== undefined && columnMeta.isNotNull}
                                      name={m.confKey} label={m.confNickKey}/>
        ii++;
      } else if (m.confKeyType === 'SELECT') {
        const ve: any = {};
        if (queryMeta.selectArrays) {
          queryMeta.selectArrays.forEach(vve => {
            ve[`${vve.value}`] = vve.label
          })
        }
        item = <ProFormSelect key={`${groupii}-item-${ii}`} width="sm" fieldProps={{
          disabled: this.props.initialParams && this.props.initialParams[m.confKey] !== undefined
        }} valueEnum={ve} required={columnMeta.isNotNull !== undefined && columnMeta.isNotNull} name={m.confKey}
                              label={m.confNickKey}/>
        ii++;
      } else if (m.confKeyType === 'TEXT') {
        item = <ProFormTextArea key={`${groupii}-item-${ii}`} width="xl"
                                required={columnMeta.isNotNull !== undefined && columnMeta.isNotNull} name={m.confKey}
                                label={m.confNickKey}/>
        ii++;
      } else if (m.confKeyType === 'INT') {
        item = <ProFormDigit key={`${groupii}-item-${ii}`} width="sm"
                             required={columnMeta.isNotNull !== undefined && columnMeta.isNotNull} name={m.confKey}
                             label={m.confNickKey} fieldProps={{precision: 0}}/>
        ii++;
      } else if (m.confKeyType === 'DOUBLE') {
        item = <ProFormDigit key={`${groupii}-item-${ii}`} width="sm"
                             required={columnMeta.isNotNull !== undefined && columnMeta.isNotNull} name={m.confKey}
                             label={m.confNickKey}/>
        ii++;
      } else if (m.confKeyType === 'TAGS') {
        item =
          <FormItem key={`${groupii}-item-${ii}`} required={columnMeta.isNotNull !== undefined && columnMeta.isNotNull}
                    name={m.confKey} label={m.confNickKey}>
            <ProFormTag key={`${groupii}-tag-${ii}`}/>
          </FormItem>
        ii++;
      }

      if (item) {
        // if (formItem.length < 2) {
        formItem.push(item)
        // } else {
        //   formItem.push(item)
        //   forms.push(<ProFormGroup key={`group-${groupii}`}>
        //     {formItem}
        //   </ProFormGroup>)
        //   formItem = [];
        //   ii = 0;
        //   groupii++;
        // }
      }
    });
    if (formItem && formItem.length > 0) {
      forms.push(<ProFormGroup key={`group-${groupii}`}>
        {formItem}
      </ProFormGroup>)
    }
    return forms
  }

  validateForms(values: any) {
    const columns: MODEL.DynamicTableColumn[] = this.props.columns!;
    let isInvalid = true;
    columns.forEach(m => {
      if (!isInvalid) return
      // @ts-ignore
      let queryMeta: MODEL.TableColumnQueryMeta = {};
      let columnMeta: MODEL.DynamicColumnMeta = {};
      if (m.confKeyMeta) {
        columnMeta = typeof m.confKeyMeta === 'string' ? JSON.parse(m.confKeyMeta) : m.confMeta
      }
      if (m.confKeyQueryMeta) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        queryMeta = typeof m.confKeyQueryMeta === 'string' ? JSON.parse(m.confKeyQueryMeta) : m.confMeta
      }
      if (columnMeta.isNotNull !== undefined && columnMeta.isNotNull) {
        if (values[m.confKey] === undefined || values[m.confKey] === '') {
          isInvalid = false;
          if (m.confKeyType === 'SELECT' || m.confKeyType === 'DATE' || m.confKeyType === 'DATETIME') {
            message.warning('Please select => ' + m.confNickKey);
          } else if (m.confKeyType === 'ASSETS') {
            message.warning('Please upload => ' + m.confNickKey);
          } else {
            message.warning('Please enter => ' + m.confNickKey);
          }
        }
      }
    })
    return isInvalid;
  }

  render() {
    if (!this.state.visible || !this.state.columns) return null;
    return <ModalForm visible
                      title={this.props.initialParams !== undefined && this.props.initialParams.id ? messages['pages.dynamicTable.record.text.update'] : messages['pages.dynamicTable.record.text.add']}
                      initialValues={{
                        ...this.props.columns,
                        ...this.props.initialParams
                      }} modalProps={{
      onCancel: this.props.onDismiss
    }} onFinish={async (values) => {
      if (!this.validateForms(values)) {
        return;
      }
      try {
        if (this.props.initialParams && this.props.initialParams.id !== undefined) {
          console.log('动态表格', '修改记录', this.props.initialParams, values);
          const d = await updateRecord(this.props.define!.tableName, this.props.initialParams.id!, {
            ...this.props.initialParams,
            ...values
          });

          if (this.props.editCallback) {
            this.props.editCallback(d !== undefined)
          }
        } else {
          const d = await insertRecord(this.props.define?.tableName, values)
          if (this.props.editCallback) {
            this.props.editCallback(d !== undefined)
          }
        }

      } catch (error) {

      }
    }
    }>
      {this.renderForms()}
    </ModalForm>
  }
}
