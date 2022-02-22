declare namespace API {

  type ResponseStatus = {
    code: number,
    message?: string
  }

  interface ResponseData<T> {
    data?: T,
    status: ResponseStatus
  }
  //
  // interface OpmUser {
  //   operId?: string | number,
  //   operPwd?: string
  // }
}
