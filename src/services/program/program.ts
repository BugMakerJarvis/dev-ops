import {GetForm} from '../ReqUtils';

export const programList = async () => {
  return GetForm<any>('/api/base/program/list')
}

export const runNohup = async (jar: string) => {
  return GetForm<any>(`/api/base/program/nophupjar?jar=${jar}`)
}
