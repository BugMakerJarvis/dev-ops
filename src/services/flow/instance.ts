import { DeleteForm, PostForm } from '../ReqUtils';

/**
 * 根据流程定义id启动流程实例
 */
export const startDefinition = async (procDefId: string, variables: any) => {
  return PostForm<any>(`/api/flowable/instance/startBy/${procDefId}`, {
    ...variables,
  });
};

/**
 * 激活或挂起流程实例
 */
export const updateState = async (state: number, instanceId: string) => {
  return PostForm<any>(
    `/api/flowable/instance/updateState?state=${state}&instanceId=${instanceId}`,
  );
};

/**
 * 删除流程实例
 */
export const deleteInstance = async (instanceId: string, deleteReason: string) => {
  return DeleteForm<any>(
    `/api/flowable/instance/delete?instanceId=${instanceId}&deleteReason=${deleteReason}`,
  );
};

/**
 * 删除所有流程实例
 */
export const deleteAllInstance = async (deleteReason: string) => {
  return DeleteForm<any>(`/api/flowable/instance/delete?deleteReason=${deleteReason}`);
};
