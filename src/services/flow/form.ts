import { DeleteForm, GetForm, PostForm } from '../ReqUtils';

/**
 * 查询流程表单列表
 */
export const formList = async (form: any) => {
  return PostForm<any>('/api/flowable/form/list', {
    ...form,
  });
};

/**
 * 获取流程表单详细信息
 */
export const getFormInfo = async (formId: number) => {
  return GetForm<any>(`/api/flowable/form/get/${formId}`);
};

/**
 * 新增流程表单
 */
export const addForm = async (form: any) => {
  return PostForm<any>('/api/flowable/form/add', {
    ...form,
  });
};

/**
 * 修改流程表单
 */
export const updateForm = async (form: any) => {
  return PostForm<any>('/api/flowable/form/update', {
    ...form,
  });
};

/**
 * 删除流程表单
 *
 * @param formIds 流程表单id数组    例/delete/7,8
 */
export const deleteForm = async (formIds: any) => {
  return DeleteForm<any>(`/api/flowable/form/delete/${formIds}`);
};

/**
 * 挂载流程表单
 */
export const addDeployForm = async (deployForm: any) => {
  return PostForm<any>('/api/flowable/form/addDeployForm', {
    ...deployForm,
  });
};

/**
 * 挂载任务表单
 */
export const addTaskForm = async (taskForm: any) => {
  return PostForm<any>('/api/flowable/form/addTaskForm', {
    ...taskForm,
  });
};

/**
 * 查询任务挂着的表单
 */
export const getFormByTaskId = async (taskId: string) => {
  return GetForm<any>(`/api/flowable/form/getFormByTaskId?taskId=${taskId}`);
};
