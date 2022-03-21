import {getIntl, getLocale} from "@@/plugin-locale/localeExports";

/**
 * 存储流程设计相关参数
 */

const {messages} = getIntl(getLocale());

export default class BpmData {
  constructor() {
    this.controls = [] // 设计器控件
    this.init()
  }

  init() {
    this.controls = [
      {
        action: 'create.start-event',
        title: messages['component.bpmnMain.bpmData.start-event'],
      },
      {
        action: 'create.intermediate-event',
        title: messages['component.bpmnMain.bpmData.intermediate-event'],
      },
      {
        action: 'create.end-event',
        title: messages['component.bpmnMain.bpmData.end-event'],
      },
      {
        action: 'create.exclusive-gateway',
        title: messages['component.bpmnMain.bpmData.exclusive-gateway'],
      },
      {
        action: 'create.task',
        title: messages['component.bpmnMain.bpmData.task'],
      },
      {
        action: 'create.user-task',
        title: messages['component.bpmnMain.bpmData.user-task'],
      },
      {
        action: 'create.user-sign-task',
        title: messages['component.bpmnMain.bpmData.user-sign-task'],
      },
      {
        action: 'create.subprocess-expanded',
        title: messages['component.bpmnMain.bpmData.subprocess-expanded'],
      },
      {
        action: 'create.data-object',
        title: messages['component.bpmnMain.bpmData.data-object'],
      },
      {
        action: 'create.data-store',
        title: messages['component.bpmnMain.bpmData.data-store'],
      }, {
        action: 'create.participant-expanded',
        title: messages['component.bpmnMain.bpmData.participant-expanded'],
      },
      {
        action: 'create.group',
        title: messages['component.bpmnMain.bpmData.group'],
      }
    ]
  }

  //  获取控件配置信息
  getControl(action) {
    const result = this.controls.filter(item => item.action === action)
    return result[0] || {}
  }
}
