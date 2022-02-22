//sysUser
import {DeleteForm, GetForm, PostForm} from "@/services/ReqUtils";

export const getUserList = async () => {
  return GetForm<any>(`/api/sysUser/list`)
}

export const getUserListByParams = async (params?: any) => {
  return PostForm<any>(`/api/sysUser/getPageList`, {
    ...params
  })
}


export const insertUser = async (params?: any) => {
  return PostForm<any>(`/api/sysUser/add`, {
    ...params
  })
}

export const updateUser = async (params?: any) => {
  return PostForm<any>(`/api/sysUser/update`, {
    ...params
  })
}

export const deleteUser = async (id: number) => {
  return DeleteForm<any>(`/api/sysUser/delete/${id}`)
}

export const getUserById = async (id: number) => {
  return GetForm<any>(`/api/sysUser/info/${id}`)
}

export const getUserByName = async (name: string) => {
  return GetForm<any>(`/api/sysUser/getByUsername?name=${name}`)
}

//sysOrg
export const getOrgList = async () => {
  return GetForm<any>(`/api/sysOrg/list`)
}

export const insertOrg = async (params?: any) => {
  return PostForm<any>(`/api/sysOrg/add`, {
    ...params
  })
}

export const updateOrg = async (params?: any) => {
  return PostForm<any>(`/api/sysOrg/update`, {
    ...params
  })
}

export const deleteOrg = async (id: number) => {
  return DeleteForm<any>(`/api/sysOrg/delete/${id}`)
}

export const getOrgById = async (id: number) => {
  return GetForm<any>(`/api/sysOrg/info/${id}`)
}

export const getOrgByName = async (name: string) => {
  return GetForm<any>(`/api/sysOrg/info/name/${name}`)
}

export const getOrgTreeList = async () => {
  return GetForm<any>(`/api/sysOrg/tree`)
}

//sysRole
export const getRoleList = async () => {
  return GetForm<any>(`/api/sysRole/list`)
}

export const deleteRole = async (id: number) => {
  return DeleteForm<any>(`/api/sysRole//delete/${id}`)
}

export const insertRole = async (params?: any) => {
  return PostForm<any>(`/api/sysRole/add`, {
    ...params
  })
}
