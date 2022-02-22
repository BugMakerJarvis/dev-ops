import {
  queryRelationTables,
  queryStatusListenerBeans,
  updateTableDefineInfo
} from '@/services/dynamic-table/define';
import {
  ModalForm,
  ProFormCheckbox,
  ProFormGroup,
  ProFormList,
  ProFormSelect, ProFormText
} from '@ant-design/pro-form';
import {notification} from 'antd';
import React from 'react';
import {getIntl, getLocale} from "@@/plugin-locale/localeExports";

interface UpdateTableProps {
  table?: MODEL.DynamicTable,
  visiable?: boolean,
  onDismiss?: () => void,
  onUpdateSuccess?: () => void
}

const {messages} = getIntl(getLocale());

export default class UpdateTable extends React.PureComponent<UpdateTableProps, {
  table?: MODEL.DynamicTable,
  visible: boolean,
  totalRelationTables?: MODEL.DynamicTable[],
  statusListeners?: string[],
  relationTables?: {
    name: string,
    nickName?: string
  }[],
  bindStatusListeners?: string[]
}> {

  constructor(props: UpdateTableProps) {
    super(props);

    this.state = {
      table: props.table,
      visible: props.visiable === undefined ? false : props.visiable,
      totalRelationTables: []
    }
  }

  async componentDidMount() {
    try {
      this.setState({
        totalRelationTables: await queryRelationTables(),
        statusListeners: await queryStatusListenerBeans()
      })

    } catch (e) {

    }
  }

  UNSAFE_componentWillReceiveProps(props: UpdateTableProps) {

    if (props.visiable !== undefined && props.visiable !== this.state.visible) {
      this.setState({
        table: props.table,
        visible: props.visiable
      })
    }
  }

  async updateTableInfo(params: any) {
    const upParams: any = {
      ...this.state.table,
      tableName: params.tableName,
      tableNickName: params.tableNickName,
      isRelationTable: params.isRelation === undefined ? 0 : (params.isRelation ? 1 : 0)
    }

    if (this.state.table && this.state.table.id) {
      upParams.id = this.state.table.id;
    }

    const rls: { nickName: string, tableName: string }[] = params['meta.relation'];
    const sts: string[] = params['meta.statusListeners'];

    const meta: any = {
      relationTable: [],
      statusListeners: []
    }

    if (rls && rls.length > 0) {
      rls.forEach(v => {
        if (v.tableName) {
          meta.relationTable.push({
            name: v.tableName,
            nickName: this.getRelaNickName(v)
          })
        }
      })
    }

    if (sts && sts.length > 0) {
      meta.statusListeners = sts;
    }

    upParams.confMeta = JSON.stringify(meta);

    console.log('修订库表信息', upParams, this.state.table);
    try {
      const d: boolean = await updateTableDefineInfo(upParams);
      if (d) {
        notification.success({
          message: messages['pages.dynamicTable.success.table.update'],
        })

        this.setState({
          totalRelationTables: await queryRelationTables(),
          statusListeners: await queryStatusListenerBeans(),
        })

        if (this.props.onUpdateSuccess) {
          this.props.onUpdateSuccess();
        }
      } else {
        notification.warning({
          message: messages['pages.dynamicTable.warning.table.update']
        })
      }
    } catch (error) {
      console.log('更新库表配置失败', error)
    }
  }

  getRelaNickName(t: { nickName: string, tableName: string }) {
    if (t.nickName && t.nickName !== '') {
      return t.nickName;
    }

    for (let i = 0; i < this.state.totalRelationTables!.length; i++) {
      const tt = this.state.totalRelationTables![i];
      if (tt.tableName === t.tableName) {
        return tt.tableNickName
      }
    }
    return t.nickName;
  }

  render() {
    const updateState = this.state;
    if (!updateState.table || !updateState.visible) return null;
    const table: MODEL.DynamicTable = updateState.table;
    console.log('当前配置表信息', this.state.table)

    const initialValues: any = {
      ...updateState.table,
      isRelation: table.isRelationTable && table.isRelationTable === 1
    }
    if (table && table.confMeta) {
      const meta: MODEL.DynamicTableMeta = typeof table.confMeta === 'string' ? JSON.parse(table.confMeta) : table.confMeta;
      if (meta.relationTable) {
        initialValues['meta.relation'] = meta.relationTable.map(v => {
          return {
            tableName: v.name,
            nickName: v.nickName
          }
        })
      }

      if (meta.statusListeners) {
        initialValues['meta.statusListeners'] = meta.statusListeners;
      }
    }

    return <ModalForm<MODEL.DynamicTable & {
      isRelation: boolean
    }> visible={updateState.table !== undefined} width={window.screen.width * 3 / 4} initialValues={initialValues}
       title={messages['pages.dynamicTable.table.config']} modalProps={{
      onCancel: this.props.onDismiss
    }} onFinish={this.updateTableInfo.bind(this)}>
      <ProFormGroup>
        <ProFormText name="tableName" label={messages['pages.dynamicTable.table.name']} width="sm" fieldProps={{
          disabled: true
        }}/>
        <ProFormText name="tableNickName" label={messages['pages.dynamicTable.table.nickName']} width="sm"/>
        <ProFormCheckbox name="isRelation" label={messages['pages.dynamicTable.table.isRela']}/>
      </ProFormGroup>
      <ProFormList name="meta.statusListeners" label={messages['pages.dynamicTable.table.addStatusListener']}>
        <ProFormSelect width="sm"
                       label={messages['pages.dynamicTable.table.listener']}
                       name="statusBean"
                       options={updateState.statusListeners?.map(v => ({
                         value: v,
                         label: v
                       }))}
        />
      </ProFormList>
      <ProFormList name="meta.relation" label={messages['pages.dynamicTable.table.addRelaTable']}>
        <ProFormGroup>
          <ProFormSelect width="sm"
                         label={messages['pages.dynamicTable.table.name']}
                         name="tableName"
                         required
                         options={updateState.totalRelationTables?.map(v => ({
                           value: v.tableName,
                           label: v.tableNickName
                         }))}
                         fieldProps={{
                           onSelect: (v: any) => {
                             console.log('选择库表', v)
                           }
                         }}
          />
          <ProFormText name="nickName" label={messages['pages.dynamicTable.table.nickName']} width="sm"/>
        </ProFormGroup>
      </ProFormList>
    </ModalForm>
  }
}
