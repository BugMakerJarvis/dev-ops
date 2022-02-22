import {ColumnTypeSelectOptions} from '@/ModelDefines';
import {
  addTableColumn, updateTableColumn
} from '@/services/dynamic-table/define';
import {
  ModalForm,
  ProFormCheckbox,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormSelect, ProFormText
} from '@ant-design/pro-form';
import {message} from 'antd';
import React from 'react';
import {getIntl, getLocale} from "@@/plugin-locale/localeExports";

interface UpdateColumnProps {
  tableName?: string,
  column?: MODEL.DynamicTableColumn,
  visible?: boolean,
  isAdd?: boolean
  onDismiss?: () => void,
  onSubmitSuccess?: () => void
}

const columnTypeSelector = {
  VARCHAR: '字符串',
  TEXT: '长字符',
  DATE: '日期',
  DATETIME: '日期时间戳',
  INT: '整数',
  DOUBLE: '浮点数',
  ASSETS: '附件',
  MULTIASSETS: '多附件'
};

const {messages} = getIntl(getLocale());

export default class UpdateColumn extends React.PureComponent<UpdateColumnProps, UpdateColumnProps & {
  selectArrays?: {
    label: string,
    value: string,
    status?: string
  }[],
  isSelector?: boolean
}> {

  constructor(props: UpdateColumnProps) {
    super(props);

    this.state = {
      column: props.column,
      visible: props.visible === undefined ? false : props.visible,
      isAdd: props.isAdd === undefined ? false : props.isAdd,
      tableName: props.tableName,
      selectArrays: undefined,
      isSelector: false
    }
  }

  UNSAFE_componentWillReceiveProps(props: UpdateColumnProps) {
    this.setState({
      column: props.column
    })

    if (props.visible !== undefined && props.visible !== this.state.visible) {
      this.setState({
        visible: props.visible
      })
    }

    if (props.isAdd !== undefined && props.isAdd !== this.state.isAdd) {
      this.setState({
        isAdd: props.isAdd
      })
    }

    if (props.tableName !== undefined && props.tableName !== this.state.tableName) {
      this.setState({
        tableName: props.tableName
      })
    }
  }

  renderSelectorArrays() {
    const column: MODEL.DynamicTableColumn | undefined = this.state.column;
    if (column && column.confKeyType === 'SELECT') {
      let initValues: any[] = [];

      if (column.confKeyQueryMeta) {
        const meta: MODEL.TableColumnQueryMeta = typeof column.confKeyMeta === 'string' ? JSON.parse(column.confKeyQueryMeta) : column.confKeyMeta;
        // initValues['query.canFilter'] = meta.canFilter;
        if (meta.selectArrays) {
          initValues = meta.selectArrays.map(v => ({
            valueKey: v.value,
            valueLabel: v.label
          }))
        }
      }

      return <ProFormList initialValue={initValues} name="select.arrays"
                          label={messages['pages.dynamicTable.field.type.SELECT']}>
        <ProFormGroup>
          <ProFormDigit name="valueKey" label={messages['pages.dynamicTable.field.type.SELECT.key']} required
                        width="sm"/>
          <ProFormText name="valueLabel" label={messages['pages.dynamicTable.field.type.SELECT.value']} width="sm"/>
        </ProFormGroup>
      </ProFormList>
    }
    return this.state.isSelector ?
      <ProFormList name="select.arrays" label={messages['pages.dynamicTable.field.type.SELECT']}>
        <ProFormGroup>
          <ProFormDigit name="valueKey" label={messages['pages.dynamicTable.field.type.SELECT.key']} required
                        width="sm"/>
          <ProFormText name="valueLabel" label={messages['pages.dynamicTable.field.type.SELECT.value']} width="sm"/>
        </ProFormGroup>
      </ProFormList> : null;
  }

  render() {

    if (this.state.visible === undefined || !this.state.visible) return null;
    let initValues = undefined;
    const column: MODEL.DynamicTableColumn | undefined = this.state.column;

    if (column) {

      initValues = {
        ...column
      };

      if (column.confKeyMeta) {
        const meta: MODEL.DynamicColumnMeta = typeof column.confKeyMeta === 'string' ? JSON.parse(column.confKeyMeta) : column.confKeyMeta;
        initValues['meta.width'] = meta.width;
        initValues['meta.isNotNull'] = meta.isNotNull;
        initValues['meta.comment'] = meta.comment;
      }

      if (column.confKeyQueryMeta) {
        const meta: MODEL.TableColumnQueryMeta = typeof column.confKeyMeta === 'string' ? JSON.parse(column.confKeyQueryMeta) : column.confKeyMeta;
        initValues['query.canFilter'] = meta.canFilter;
      }
    }

    return <ModalForm visible={this.state.visible} initialValues={initValues} width={window.screen.width * 3 / 4}
                      title={this.state.column ? messages['pages.dynamicTable.field.config'] : messages['pages.dynamicTable.field.define']}
                      modalProps={{
                        onCancel: this.props.onDismiss
                      }} onFinish={async (v) => {
      const meta = {}, query: any = {};
      for (const name in v) {
        if (name.startsWith('meta')) {
          const metaKey = name.substring(5);
          meta[metaKey] = v[name];
        }

        if (name.startsWith('query')) {
          const metaKey = name.substring(6);
          query[metaKey] = v[name];
        }
      }

      if (v['select.arrays']) {
        query.selectArrays = v['select.arrays'].map((vv: any) => ({
          label: vv.valueLabel,
          value: vv.valueKey
        }));
      }

      if (column) {
        try {
          const clm = {
            ...column,
            ...v,
            confKeyMeta: JSON.stringify(meta),
            confKeyQueryMeta: JSON.stringify(query)
          }
          const d = await updateTableColumn(clm);
          if (d) {
            if (this.props.onSubmitSuccess) {
              this.props.onSubmitSuccess();
            }
          } else {
            message.warning(messages['pages.dynamicTable.warning.field.config']);
          }
        } catch (e) {

        }
      } else {
        if (v.confKey === undefined || v.confKey === '') {
          message.warning(messages['pages.dynamicTable.warning.field.enterFieldName'])
          return;
        }
        const clm = {
          confKey: v.confKey,
          confKeyType: v.confKeyType || 'VARCHAR',
          confNickKey: v.confNickKey,
          confKeySort: v.confKeySort,
          confKeyMeta: JSON.stringify(meta),
          confKeyQueryMeta: JSON.stringify(query)
        }

        console.log('新增字段', v, clm);
        try {
          const d = await addTableColumn(this.state.tableName!, clm as MODEL.DynamicTableColumn);
          if (d) {
            if (this.props.onSubmitSuccess) {
              this.props.onSubmitSuccess();
            }
          } else {
            message.warning(messages['pages.dynamicTable.warning.field.create']);
          }
        } catch (e) {

        }
      }

    }}>
      <ProFormGroup>
        <ProFormText name="confKey" label={messages['pages.dynamicTable.field.name']} width="sm" required fieldProps={{
          disabled: this.state.column !== undefined
        }}/>
        <ProFormText name="confNickKey" required label={messages['pages.dynamicTable.field.nickName']} width="sm"/>
        <ProFormSelect
          label={messages['pages.dynamicTable.field.type']}
          name="confKeyType"
          required
          width="xs"
          options={ColumnTypeSelectOptions}
          valueEnum={columnTypeSelector}
          fieldProps={{
            disabled: this.state.column !== undefined,
            onChange: (v) => {
              this.setState({
                isSelector: v === 'SELECT'
              })
            }
          }}
        />
        <ProFormDigit name="meta.width" label={messages['pages.dynamicTable.field.meta.length']} width="sm"
                      fieldProps={{
                        disabled: this.state.column !== undefined
                      }}/>
        <ProFormCheckbox name="meta.isNotNull" label={messages['pages.dynamicTable.field.meta.isNotNull']} width="xs"/>
        <ProFormCheckbox name="query.canFilter" label={messages['pages.dynamicTable.field.meta.canFilter']} width="xs"
                         disabled={this.state.column?.confKeyType === 'TAGS'}/>
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText name="meta.comment" label={messages['pages.dynamicTable.field.meta.comment']} width="sm"/>
        <ProFormDigit name="confKeySort" label={messages['pages.dynamicTable.field.sort']} width="sm"/>
      </ProFormGroup>
      {this.renderSelectorArrays()}
    </ModalForm>;
  }
}
