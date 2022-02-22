import {queryDynamicTableConf} from '@/services/dynamic-table/define';
import ProCard from '@ant-design/pro-card';
import {Tabs} from 'antd';
import React from 'react';
import DynamicCrudTable from './DynamicCrudTable';
import './index.less';
import type {DynamicTablePros} from './types';

const {TabPane} = Tabs;

class RelationSingleTable extends React.PureComponent<{
  table: string,
  tableName: string,
  rela_id?: string | number,
  selectedId?: string | number
}, {
  selectedId?: string | number
} & MODEL.DynamicTableConf & DynamicTablePros> {
  state = {
    define: undefined,
    columns: undefined,
    viewId: undefined,
    selectedId: -1
  }

  async componentDidMount() {
    if (this.props.table === undefined) return;
    try {
      const d = await queryDynamicTableConf(this.props.table!);
      this.setState({
        ...d
      })
    } catch (error) {

    }
  }

  UNSAFE_componentWillReceiveProps(props: any) {
    if (props.selectedId && (props.selectedId !== -1 || props.selectedId !== '-1')) {
      this.setState({
        selectedId: props.selectedId
      })
    }
  }

  render() {
    const props = this.props;
    const dynamicTableState = this.state;
    if (dynamicTableState.define === undefined || dynamicTableState.columns === undefined) {
      return null
    }
    return <DynamicCrudTable
      tableName={props.table}
      define={dynamicTableState.define}
      columns={dynamicTableState.columns}
      initialParams={{
        t_ext_id: this.state.selectedId
      }}
      options={{
        createAble: false,
        deleteAble: false,
        searchAble: false,
        importExcelAble: false
      }}
    />;
  }
}

class RelationTables extends React.PureComponent<{ majorTable?: MODEL.DynamicTable, selectedId?: string | number }, { majorTable?: MODEL.DynamicTable, selectedId?: string | number, }> {
  constructor(props: { majorTable?: MODEL.DynamicTable, selectedId: string | number }) {
    super(props);
    this.state = {
      majorTable: props.majorTable,
      selectedId: props.selectedId,
      // totalRelationTables: [],
    }
  }

  UNSAFE_componentWillReceiveProps(props: any) {
    if (props.selectedId && (props.selectedId !== -1 || props.selectedId !== '-1')) {
      this.setState({
        selectedId: props.selectedId
      })
    }
  }

  // async componentDidMount() {
  //     try {
  //         this.setState({
  //             totalRelationTables: await queryRelationTables(),
  //         })
  //     } catch (error) {

  //     }
  // }

  render() {
    if (this.props.majorTable && this.props.majorTable.confMeta && this.props.majorTable.confMeta.relationTable) {
      return <ProCard style={{marginTop: 20}}>
        <Tabs defaultActiveKey={'1'}>
          {
            this.props.majorTable.confMeta.relationTable.map((v, index) => {
              return <TabPane tab={v.nickName || v.name} key={`${index + 1}`}>
                <RelationSingleTable table={v.name} selectedId={this.state.selectedId || -1}
                                     tableName={v.nickName || v.name} rela_id={v.rela_id}/>
              </TabPane>
            })
          }
        </Tabs>
      </ProCard>
    }
    return null;
  }
}

export default class DynamicTable extends React.PureComponent<DynamicTablePros, MODEL.DynamicTableConf & DynamicTablePros> {

  state = {
    define: undefined,
    columns: undefined,
    viewId: undefined
  }


  async componentDidMount() {
    if (this.props.tableName === undefined) return;
    try {
      const d = await queryDynamicTableConf(this.props.tableName!);
      this.setState({
        ...d
      })
    } catch (error) {

    }
  }

  render() {
    const props = this.props;
    const dynamicTableState = this.state;

    const dynamicTable = <div className='test'>
      <DynamicCrudTable {...props} {...dynamicTableState} />
      {dynamicTableState.define ? <RelationTables majorTable={dynamicTableState.define}/> : null}
    </div>

    if (props.useContainer !== undefined && !props.useContainer) {
      return <div>
        {dynamicTable}
      </div>
    }
    return <div>
      {/* <PageContainer loading={dynamicTableState?.columns === undefined || dynamicTableState.define === undefined}> */}
      {dynamicTable}
      {/* </PageContainer> */}
    </div>
  }
}
