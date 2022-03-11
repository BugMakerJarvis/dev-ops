declare namespace MODEL {

  type DynamicColumnType =
    'VARCHAR'
    | 'TEXT'
    | 'DATE'
    | 'DATETIME'
    | 'INT'
    | 'DOUBLE'
    | 'ASSETS'
    | 'MULTIASSETS'
    | 'SELECT'
    | 'TAGS'

  interface DynamicColumnTypeMap {
    VARCHAR: '字符串',
    TEXT: '长字符',
    DATE: '日期',
    DATETIME: '日期时间戳',
    INT: '整数',
    DOUBLE: '浮点数',
    SELECT: '选项',
    ASSETS: '附件',
    MULTIASSETS: '多附件'
  }

  interface DynamicEventTask {
    className: string,
    group?: string,
    name: string,
    cron: string
  }

  interface DynamicTableMeta {
    relationTable?: {
      name: string,
      nickName?: string,
      rela_id?: string | number
    }[],
    statusListeners?: string[]
  }

  interface DynamicColumnMeta {
    width?: number,
    isNotNull?: boolean,
    comment?: string
  }

  interface DynamicTable {
    id: number,
    tableName: string,
    tableNickName?: string,
    confVersion?: number,
    confMeta?: DynamicTableMeta,
    confEvent?: {
      tasks?: DynamicEventTask[]
    },
    confState?: any,
    createTime?: string,
    updateTime?: string,
    isRelationTable?: number
  }

  interface DynamicTableColumn extends DynamicTable {
    confKey: string;
    confNickKey: string;
    confKeyType: string;
    confKeyMeta?: any;
    confKeyQueryMeta?: any;
    confKeyEvent?: any;
    confKeyState?: any;
    confKeySort?: number;
    confKeyAuthorization?: any;
    confKeyDisplay?: any;
  }

  interface DynamicTableConf {
    define?: DynamicTable,
    columns?: DynamicTableColumn[]
  }

  interface PaginationResult<T> {
    rows: T[],
    total: number
  }

  interface TableColumnQueryMeta {
    canFilter?: boolean,
    selectArrays?: {
      label: string,
      value: string,
      status?: string
    }[]
  }


  /**
   * FlowTaskDto
   */
  interface TaskDetail {
    taskId: string;
    taskName: string;
    taskDefKey: string;
    assigneeId: string;
    deptName: string;
    startDeptName: string;
    assigneeName: string;
    startUserId: string;
    startUserName: string;
    category: string;
    deployId: string;
    procDefId: string;
    procDefKey: string;
    procDefName: string;
    procDefVersion: number;
    procInsId: string;
    hisProcInsId: string;
    duration: string;
    candidate: string;
    createTime: string;
    finishTime: string;
  }
}
