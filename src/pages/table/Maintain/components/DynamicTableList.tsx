import {queryDynamicTables} from "@/services/dynamic-table/define";
import {Menu} from 'antd';
import React from "react";

export interface DynamicTableListActionType {
  reloadTables: () => void
}

export default class DynamicTableList extends React.PureComponent<{
  onTableSelect?: (table: MODEL.DynamicTable) => void
}, { tables?: MODEL.DynamicTable[] }> implements DynamicTableListActionType {
  state = {
    tables: []
  }

  reloadTables() {
    queryDynamicTables().then(dd => {
      this.setState({
        tables: dd.rows
      })
    })
  }

  componentDidMount() {
    this.reloadTables();
  }

  render() {
    const {tables} = this.state;
    return <Menu
      onSelect={e => {
        const t: MODEL.DynamicTable = tables![parseInt(e.key as string) - 1];
        if (this.props.onTableSelect) {
          this.props.onTableSelect(t);
        }
      }}
      style={{width: 320}}
      mode="inline"
      defaultSelectedKeys={tables && tables.length > 0 ? ['1'] : []}
    >
      {tables ? tables.map((v: MODEL.DynamicTable, i: number) => {
        return <Menu.Item key={`${i + 1}`}>{`${v.tableName}-${v.tableNickName}`}</Menu.Item>
      }) : null}
    </Menu>;
  }
}
