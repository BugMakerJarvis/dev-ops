import {GetForm, PostForm, ResponseFilter} from '../ReqUtils';
import {request} from 'umi';

/**
 * 查询库表配置
 * @param tableName   库表名称
 * @returns
 */
export const queryDynamicTableConf = async (tableName: string) => {
  return GetForm<MODEL.DynamicTableConf>(`/api/base/dynamictable/conf?name=${tableName}`).then(
    (d: MODEL.DynamicTableConf) => {
      if (d && d.define && d.define.confMeta) {
        if (typeof d.define.confMeta === 'string') {
          d.define.confMeta = JSON.parse(d.define.confMeta);
        }
      }
      return d;
    },
  );
};

/**
 * 动态表数据查询
 * @param tableName
 * @param params?
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const queryDynamicTableData = async <T>(
  tableName: string | undefined,
  params?: any,
  url?: string,
): Promise<MODEL.PaginationResult<any>> => {
  return PostForm<MODEL.PaginationResult<any>>(`/api/${url || 'base/dynamictable/query'}`, {
    table: tableName,
    ...params,
  });
};

export const queryDynamicTables = async (
  params?: any,
): Promise<MODEL.PaginationResult<MODEL.DynamicTable>> => {
  return GetForm<MODEL.PaginationResult<MODEL.DynamicTable>>('/api/base/dynamictable/tables', {
    ...params,
  });
};

export const defineTable = async (params?: any): Promise<boolean> => {
  return PostForm<boolean>('/api/base/dynamictable/define', {
    ...params,
  });
};

export const deleteTableColumn = async (tableName: string, id: number) => {
  return GetForm<boolean>(`/api/base/dynamictable/deletecolumn?name=${tableName}&id=${id}`);
};

export const addTableColumn = async (tableName: string, column: MODEL.DynamicTableColumn) => {
  return PostForm<boolean>('/api/base/dynamictable/addcolumn', {
    name: tableName,
    column: column,
  });
};

export const updateTableColumn = async (column: any) => {
  return PostForm<boolean>('/api/base/dynamictable/updatecolumn', {
    ...column,
  });
};

export const queryRelationTables = async (): Promise<MODEL.DynamicTable[] | undefined> => {
  return GetForm<MODEL.DynamicTable[]>('/api/base/dynamictable/relationtables');
};

export const queryAllTasks = async (
  name: string,
): Promise<MODEL.DynamicEventTask[] | undefined> => {
  return GetForm<MODEL.DynamicTable[]>(`/api/base/dynamictable/alltasks?name=${name}`);
};

/**
 * 新增动态表数据
 * @param tableName
 * @param record
 * @returns
 */
export const insertRecord = async (tableName: string | undefined, record: any, url?: string) => {
  return PostForm<any>(`/api/${url || 'base/dynamictable/addrecord'}`, {
    name: tableName,
    record,
  });
};

export const deleteRecords = async (tableName: string | undefined, ids: any) => {
  return PostForm<any>(`/api/base/dynamictable/deleterecords`, {
    name: tableName,
    ids,
  });
};

/**
 * 更新动态表数据
 * @param tableName
 * @param id
 * @param record
 * @returns
 */
export const updateRecord = async (tableName: string, id: number | string, record: any) => {
  return PostForm<number>('/api/base/dynamictable/updaterecord', {
    table: tableName,
    id,
    record,
  });
};

/**
 * 获取动态表状态触发器
 * @returns
 */
export const queryStatusListenerBeans = async () => {
  return GetForm<string[]>('/api/base/dynamictable/statuslistenerbeans');
};

/**
 * 更新库表配置信息
 * @param info 库表配置信息
 * @returns
 */
export const updateTableDefineInfo = async (info: any) => {
  return PostForm<boolean>('/api/base/dynamictable/updatetable', info);
};

/**
 * 导出动态表数据
 * @param name
 * @param params
 * @returns
 */
export const exportTableData = async (name: string | undefined, params: any) => {
  return request('/api/base/dynamictable/exportdata', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
    data: {
      name,
      params,
    },
  });
};

/**
 * 导出动态表批量导入模板
 * @param name
 * @returns
 */
export const exportTableTemplate = async (name: string | undefined) => {
  return request(`/api/base/dynamictable/exporttemplate?name=${name}`, {
    method: 'GET',
    responseType: 'blob',
  });
};

/**
 * 批量导入
 * @param form
 * @returns
 */
export const importTableRows = async (form: any) => {
  return request('/api/base/dynamictable/importdata', {
    method: 'POST',
    requestType: 'form',
    headers: {
      // "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundarywwA3SQl4NjQmhgRr"
    },
    data: form,
  }).then(ResponseFilter).then((d: any) => {
    console.log('FILE网络请求结果', '/api/base/dynamictable/importdata', d);
    return d;
  });
};
