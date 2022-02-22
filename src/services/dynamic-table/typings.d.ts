declare namespace API {
  declare namespace TableDefine {
    type TableConfig = {
      id: string | number,
      tableName: string,
      tableNickName: string,
      confVersion: number
    };

    type TableColumnConfig = {
      confKey: string,
      confNickKey: string,
      confKeyType: 'string' | 'number' | 'proccess' | 'state' | 'selector' | 'date' | 'datetime' | 'customer',
      confKeyMeta: any,
      confKeyEvent: any,
      confKeyState: any,
      confKeyAuthorization: any,
      confKeyDisplay: any,
      createTime: string | undefined | null,
      updateTime: string | undefined | null
    };
  }
}
