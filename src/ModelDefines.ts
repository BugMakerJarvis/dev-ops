import {SelectProps} from "antd"

export const ColumnTypeSelectValues = {
  VARCHAR: '字符串',
  TEXT: '长字符',
  DATE: '日期',
  DATETIME: '日期时间戳',
  INT: '整数',
  DOUBLE: '浮点数',
  SELECT: '选项',
  TAGS: '标签',
  ASSETS: '附件',
  MULTIASSETS: '多附件'
}


export const ColumnTypeSelectOptions: SelectProps<any>['options'] = []


for (const name in ColumnTypeSelectValues) {
  ColumnTypeSelectOptions.push({
    label: ColumnTypeSelectValues[name],
    value: name
  })
}
