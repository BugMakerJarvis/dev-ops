import {DeleteForm, GetForm, PostForm, ResponseFilter} from '../ReqUtils';
import {request} from "umi";

/**
 * 查询流程定义列表
 */
export const definitionList = async (
  pageNum: number,
  pageSize: number,
  name: string,
  deployTime: string,
) => {
  return GetForm<any>(
    `/api/flowable/definition/list?pageNum=${pageNum}&pageSize=${pageSize}&name=${name}&deployTime=${deployTime}`,
  );
};

/**
 * 读取xml文件
 */
export const readXml = async (deployId: string) => {
  return GetForm<any>(`/api/flowable/definition/readXml/${deployId}`);
};

/**
 * 读取图片文件
 */
export const readImage = async (deployId: string) => {
  return GetForm<any>(`/api/flowable/definition/readImage/${deployId}`);
};

/**
 * 删除流程定义
 */
export const delDeployment = async (deployId: string) => {
  return DeleteForm<any>(`/api/flowable/definition/delete?deployId=${deployId}`);
};

/**
 * 激活或挂起流程定义
 */
export const updateState = async (state: number, deployId: string) => {
  return GetForm<any>(`/api/flowable/definition/updateState?state=${state}&deployId=${deployId}`);
};

/**
 * 保存流程设计器内的xml文件
 */
export const saveXml = async (name: string, category: string, xml: string) => {
  return PostForm<any>('/api/flowable/definition/save', {
    name: name,
    category: category,
    xml: xml,
  });
};

/**
 * 导入流程文件 上传bpmn20的xml文件
 */
export const importFile = async (name: string, category: string, uploadFile: Blob) => {
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("name", name);
  formData.append("category", category);
  return request("/api/flowable/definition/import", {
    method: 'POST',
    headers: {
      // "Content-Type": "multipart/form-data;"
    },
    requestType: 'form',
    data: formData,
  }).then(ResponseFilter).then((d: any) => {
    console.log('File网络请求结果', "/api/flowable/definition/import", d);
    return d;
  });
};

/**
 * 指定流程办理人员列表
 */
export const userList = async (user: any) => {
  return PostForm<any>('/api/flowable/definition/userList', {
    ...user,
  });
};

/**
 * 指定流程办理组列表
 */
export const roleList = async (role: any) => {
  return PostForm<any>('/api/flowable/definition/roleList', {
    ...role,
  });
};

/**
 * 删除流程定义
 */
export const deleteDefinition = async (deployId: string) => {
  return DeleteForm<any>(
    `/api/flowable/definition/delete?deployId=${deployId}`,
  );
};
