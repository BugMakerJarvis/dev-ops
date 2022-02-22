export type OnRecordsDelete = (id: string | number) => void
export type OnRecordAdd = (row: any) => void

type ColumnFilter = (confKey: string) => boolean;

export type DynamicTableOptions = {
  createAble?: boolean,
  exportExcelAble?: boolean,
  importExcelAble?: boolean,
  deleteAble?: boolean,
  searchAble?: boolean,
  actionAble?: ActionAbleOptions,
  editAble?: boolean
}

export type DynamicTablePros = {
  tableName?: string,
  content?: string,
  useContainer?: boolean,
  options?: DynamicTableOptions,
  initialParams?: any,
  urlList?: any,
  changeSelect?: (...args: any) => any,
  editorRender?: () => any,
  columnsFilter?: string[] | ColumnFilter
}

export type DynamicTableViewProps = {
  define?: MODEL.DynamicTable,
  columns?: MODEL.DynamicTableColumn[],
}

export type ActionAbleOptions = {
  edit?: string,
  delete?: string,
  show?: string,
}
