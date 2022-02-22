import {request} from 'umi';
import {message} from 'antd';

export const ResponseFilter = (v: API.ResponseData<any>): any => {
  if (v.status && v.status.code && v.status.code !== 1000) {
    message.error(v.status.message + ' 错误码：' + v.status.code)
    return Promise.reject(new Error(v.status.message + ' 错误码：' + v.status.code));
  }
  return Promise.resolve(v.data);
}

export const PostForm = async <T>(api: string, body?: any, options?: { [key: string]: any }) => {
  return request<API.ResponseData<T>>(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  }).then(ResponseFilter).then((d: any) => {
    console.log('POST网络请求结果', api, d);
    return d;
  })
}

export const GetForm = async <T>(api: string, options?: { [key: string]: any }) => {
  return request<API.ResponseData<T>>(api, {
    method: 'GET',
    ...(options || {}),
  }).then(ResponseFilter).then((d: any) => {
    console.log('GET网络请求结果', api, d);
    return d;
  })
}

export const DeleteForm = async <T>(api: string, options?: { [key: string]: any }) => {
  return request<API.ResponseData<T>>(api, {
    method: 'DELETE',
    ...(options || {}),
  }).then(ResponseFilter).then((d: any) => {
    console.log('DELETE网络请求结果', api, d);
    return d;
  })
}
