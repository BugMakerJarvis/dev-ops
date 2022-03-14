import {GetForm, PostForm} from '../ReqUtils';

/**
 * 获取我发起的流程
 */
export const myProcess = async (
  pageNum: number,
  pageSize: number,
) => {
  return GetForm<any>(
    `/api/flowable/task/myProcess?pageNum=${pageNum}&pageSize=${pageSize}`,
  );
};

/**
 * 取消申请
 */
export const stopProcess = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/stopProcess', {
    ...flowTaskVo,
  });
};

/**
 * 撤回流程
 */
export const revokeProcess = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/revokeProcess', {
    ...flowTaskVo,
  });
};

/**
 * 获取待办列表
 */
export const todoList = async (
  pageNum: number,
  pageSize: number,
) => {
  return GetForm<any>(
    `/api/flowable/task/todoList?pageNum=${pageNum}&pageSize=${pageSize}`,
  );
};

/**
 * 获取已办任务
 */
export const finishedList = async (pageNum: number, pageSize: number) => {
  return GetForm<any>(`/api/flowable/task/finishedList?pageNum=${pageNum}&pageSize=${pageSize}`);
};

/**
 * 流程历史流转记录
 */
export const flowRecord = async (procInsId: string, deployId: string) => {
  return GetForm<any>(`/api/flowable/task/flowRecord?procInsId=${procInsId}&deployId=${deployId}`);
};

/**
 * 获取流程变量
 */
export const processVariables = async (taskId: string) => {
  return GetForm<any>(`/api/flowable/task/processVariables/${taskId}`);
};

/**
 * 审批任务
 */
export const completeTask = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/complete', {
    ...flowTaskVo,
  });
};

/**
 * 驳回任务
 */
export const rejectTask = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/reject', {
    ...flowTaskVo,
  });
};

/**
 * 退回任务
 */
export const returnTask = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/return', {
    ...flowTaskVo,
  });
};

/**
 * 获取所有可回退的节点
 */
export const findReturnTaskList = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/returnList', {
    ...flowTaskVo,
  });
};

/**
 * 删除任务
 */
export const deleteTask = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/delete', {
    ...flowTaskVo,
  });
};

/**
 * 认领/签收任务
 */
export const claimTask = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/claim', {
    ...flowTaskVo,
  });
};

/**
 * 取消认领/签收任务
 */
export const unClaimTask = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/unClaim', {
    ...flowTaskVo,
  });
};

/**
 * 委派任务
 */
export const delegateTask = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/delegate', {
    ...flowTaskVo,
  });
};

/**
 * 转办任务
 */
export const assignTask = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/assign', {
    ...flowTaskVo,
  });
};

/**
 * 获取下一节点
 */
export const getNextFlowNode = async (flowTaskVo: any) => {
  return PostForm<any>('/api/flowable/task/nextFlowNode', {
    ...flowTaskVo,
  });
};

/**
 * 获取流程图
 */
export const getFlowViewer = async (procInsId: string) => {
  return GetForm<any>(`/api/flowable/task/flowViewer/${procInsId}`);
};
