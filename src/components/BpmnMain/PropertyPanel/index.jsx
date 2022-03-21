import React, {Component} from "react";
import {Input, Select, Form, Button, Divider, Switch, Card, Row, Col, Tag, Space, Radio} from "antd";
import _ from "lodash";
import styles from "./index.less";
import {getRoleList, getUserList} from "@/services/rbac/rbac";
import {getIntl, getLocale} from "@@/plugin-locale/localeExports";

const {Option} = Select;

const {messages} = getIntl(getLocale());

/** 属性面板 */
class PropertyPanel extends Component {
  /**
   * react v16.3版本后生命周期
   * A：Init    => constructor => getDerivedStateFromProps => render => componentDidMount
   * B: Update  => getDerivedStateFromProps => shoulComponentUpdate => render => getSnapshortBeforeUpdate => componentDidUpdate
   * C: Unmount => componentWillUnmount
   */
  constructor(props) {
    super(props);
    this.state = {
      users: [], // 可选用户列表
      // roles: [], // 可选角色列表
      element: {}, // 节点事件对象
      elementInfo: {
        // 节点属性信息
        id: "", // 节点id
        name: "", // 节点名称
        $type: "", // 节点类型
        // approvalType: "user", // 审批类型
        // approvalValue: "", // 审批人/角色
        "activiti:assignee": ""
        // FlowLineType: "normal", // 流程线属性类型（可设为默认或条件分支，或不设置）
      },
    };
  }

  componentDidMount() {
    // 1.初始化可选用户和角色列表
    this.initData();
    // 2.初始化监听事件和候选用户
    this.addEventListener();
  }

  /** 初始化可选用户和角色列表 */
  initData = async () => {
    const userList = await getUserList();
    // const roleList = await getRoleList();
    userList.map(u => {
      u.value = u.username;
      u.label = u.nickname;
    });
    // roleList.map(r => {
    //   r.value = r.code;
    //   r.label = r.name;
    // })
    this.setState({
      // 1.初始化可选用户列表
      users: userList,
      // 2.初始化可选角色列表
      // roles: roleList,
    });
  };

  /** 添加节点事件监听 */
  addEventListener = () => {
    // 1.监听节点选中
    this.props.bpmn.on("selection.changed", (e) => {
      const element = e.newSelection[0];
      if (!element) return;
      const elementInfo = {
        ...element.businessObject,
        ...element.businessObject.$attrs,
      };
      // 选中时:保存任务节点 element 和任务节点信息 elementInfo
      this.setState({
        element,
        elementInfo,
      });
      console.log("选中", elementInfo);
    });

    //  2.监听节点属性变化
    this.props.bpmn.on("element.changed", (e) => {
      // 获取节点属性
      const {element} = e;
      if (!element) return;
      const oldElementInfo = this.state.elementInfo;
      const newElementInfo = {
        ...element.businessObject,
        ...element.businessObject.$attrs,
      };

      // 节点xml属性变化更新到state视图
      if (element.id === oldElementInfo.id) {
        this.setState({elementInfo: newElementInfo});
      }
    });

    this.props.bpmn.on('root.added', (e) => {
      const {element} = e;
      if (!element) return;
      const newElementInfo = {
        ...element.businessObject,
        ...element.businessObject.$attrs,
      };

      // 节点xml属性变化更新到state视图
      if (element.type === "bpmn:Process") {
        this.setState({elementInfo: newElementInfo});
      }
    });

    this.props.bpmn.on('element.click', (e) => {
      const {element} = e;
      if (!element) return;
      const newElementInfo = {
        ...element.businessObject,
        ...element.businessObject.$attrs,
      };

      // 节点xml属性变化更新到state视图
      if (element.type === "bpmn:Process") {
        this.setState({elementInfo: newElementInfo});
      }
    });
  };

  /**
   * 编辑Xml节点颜色
   * @param {String} color 颜色
   */
  editColor = (color) => {
    const modeling = this.props.bpmn.get("modeling");
    const element = this.state.element;
    modeling.setColor(element, {fill: null, stroke: color});
    modeling.updateProperties(element, {color: color});
  };

  /**
   * 更新Xml节点名称
   * @param {Object} e 事件对象
   */
  updateLabel = (e) => {
    const newName = e.target.value;
    const modeling = this.props.bpmn.get("modeling");
    const {element} = this.state;
    modeling.updateLabel(element, newName);
  };
  //
  // /**
  //  * 更新Xml节点Id
  //  * @param {Object} e 事件对象
  //  */
  // updateId = (e) => {
  //   const newId = e.target.value;
  //   const modeling = this.props.bpmn.get("modeling");
  //   const {element} = this.state;
  //   modeling.updateId(element, newId);
  // };

  /**
   * 更新xml节点属性
   * @param {Object} params 对象参数
   */
  updateProperties = (params) => {
    const modeling = this.props.bpmn.get("modeling");
    const element = this.state.element;
    // Object.keys(params).forEach((k) => {
    //   const newKey = "flowable:" + k;
    //   params[newKey] = params[k];
    //   // delete params[k];
    // })
    // console.log(params);
    modeling.updateProperties(element, params);
  };

  /**
   * 更新xml节点表达式
   * @param {Object}} e 事件对象
   */
  updateCondition = (e) => {
    const value = e.target.value;
    const modeling = this.props.bpmn.get("modeling");
    const element = this.state.element;
    modeling.updateProperties(element, {
      conditionExpression: this.props.bpmn
        .get("moddle")
        .create("bpmn:FormalExpression", {body: value}),
    });
  };

  // // 更新流程线条属性类型
  // updateFlowLineType = (value) => {
  //   // 条件分支
  //   if (value === "condition") {
  //     this.updateProperties({
  //       FlowLineType: value,
  //     });
  //   }
  //   // 默认分支
  //   else if (value === "default") {
  //     this.updateProperties({
  //       FlowLineType: "default",
  //       conditionExpression: null, // 清空条件表达式
  //     });
  //   }
  //   // 普通分支
  //   else {
  //     this.updateProperties({
  //       FlowLineType: "normal",
  //       conditionExpression: null, // 清空条件表达式
  //     });
  //   }
  // };

  // @todo 属性面板
  render() {
    const {bpmn} = this.props;

    // const {elementInfo, users, roles, approvalType} = this.state;
    const {elementInfo, users} = this.state;
    /** 审批下拉框标题 */
    // const approvalTitle = approvalType === "user" ? "选择审批人" : "选择审批角色";
    /** 审批人下拉框列表 */
      // const approvalList = elementInfo.approvalType === "user" ? users : roles;
    const approvalList = users;

    /** 表达式内容 */
    const ConditionValue = _.get(elementInfo, "conditionExpression.body", "");

    /** 是否显示Process组件 */
    const showProcess = ['bpmn:Process'].includes(elementInfo.$type);

    /** 是否显示StartEnd组件 */
    const showStartEnd = ['bpmn:IntermediateThrowEvent', 'bpmn:StartEvent', 'bpmn:EndEvent'].includes(elementInfo.$type);

    /** 是否显示Task组件 */
    const showTask = [
      // 'bpmn:UserTask',
      'bpmn:Task',
      'bpmn:SendTask',
      'bpmn:ReceiveTask',
      'bpmn:ManualTask',
      'bpmn:BusinessRuleTask',
      'bpmn:ServiceTask',
      'bpmn:ScriptTask',
      // 'bpmn:CallActivity',
      // 'bpmn:SubProcess',
    ].includes(elementInfo.$type);

    /** 是否显示UserTask组件*/
    const showUserTask = ['bpmn:UserTask',].includes(elementInfo.$type);

    /** 是否显示SequenceFlow组件 */
    const showSequenceFlow = ['bpmn:SequenceFlow'].includes(elementInfo.$type);

    /** 是否显示Gateway组件 */
    const showGateway = ['bpmn:InclusiveGateway', 'bpmn:ExclusiveGateway', 'bpmn:ParallelGateway', 'bpmn:EventBasedGateway'].includes(elementInfo.$type);

    return (
      <div className={styles.PropertyPanel}>
        {showProcess && (
          <Card title={messages['component.bpmnMain.propertyPanel.process']} bordered={false}>
            <Space direction="vertical" size="large">
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.process.key']} allowClear
                     value={elementInfo.id}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.process.name']} allowClear
                     value={elementInfo.name}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.description']} allowClear/>
              <Space>
                <span>{messages['component.bpmnMain.propertyPanel.process.category']} 👉</span>
                <Select placeholder="Please select...">
                  <Option value="categoryOne">Category_1</Option>
                  <Option value="categoryTwo">Category_2</Option>
                </Select>
              </Space>
              <Space>
                <span>{messages['component.bpmnMain.propertyPanel.execution-listener']} 👉</span>
                <Button type="dashed">{messages['component.bpmnMain.propertyPanel.edit']}</Button>
              </Space>
            </Space>
          </Card>
        )}

        {showTask && (
          <Card title={messages['component.bpmnMain.propertyPanel.task']} bordered={false}>
            <Space direction="vertical" size="large">
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.id']} allowClear value={elementInfo.id}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.name']} allowClear value={elementInfo.name}
                     onChange={this.updateLabel}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.description']} allowClear/>
              <Space>
                <span>{messages['component.bpmnMain.propertyPanel.execution-listener']} 👉</span>
                <Button type="dashed">{messages['component.bpmnMain.propertyPanel.edit']}</Button>
              </Space>
            </Space>
          </Card>
        )}

        {showUserTask && (
          <Card title={messages['component.bpmnMain.propertyPanel.user-task']} bordered={false}>
            <Space direction="vertical" size="large">
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.id']} allowClear value={elementInfo.id}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.name']} allowClear value={elementInfo.name}
                     onChange={this.updateLabel}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.description']} allowClear/>
              <Space>
                <span>{messages['component.bpmnMain.propertyPanel.task-listener']} 👉</span>
                <Button type="dashed">{messages['component.bpmnMain.propertyPanel.edit']}</Button>
              </Space>

              {/*<Radio.Group*/}
              {/*  value={elementInfo.approvalType}*/}
              {/*  onChange={(e) => {*/}
              {/*    this.updateProperties({*/}
              {/*      approvalType: e.target.value,*/}
              {/*      approvalValue: "",*/}
              {/*    });*/}
              {/*    this.setState({*/}
              {/*      approvalType: e.target.value,*/}
              {/*    })*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <Radio value={"user"}>指定成员</Radio>*/}
              {/*  <Radio value={"role"}>指定角色</Radio>*/}
              {/*</Radio.Group>*/}

              {/*<span>{approvalTitle} 👇</span>*/}
              <span>{messages['component.bpmnMain.propertyPanel.user-task.assignee']} 👇</span>
              <Select
                showSearch
                style={{width: "100%"}}
                // value={elementInfo.approvalValue}
                value={elementInfo["activiti:assignee"]}
                onChange={(value) => {
                  this.updateProperties({
                    // approvalValue: value,
                    // "activiti:assignee": value,
                    "activiti:assignee": value
                  });
                }}
              >
                {approvalList.map((i) => (
                  <Select.Option key={i.value} value={i.value}>
                    {i.label}
                  </Select.Option>
                ))}
              </Select>
            </Space>
          </Card>
        )}

        {showSequenceFlow && (
          <Card title={messages['component.bpmnMain.propertyPanel.sequence-flow']} bordered={false}>
            <Space direction="vertical" size="large">
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.id']} allowClear value={elementInfo.id}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.name']} allowClear value={elementInfo.name}
                     onChange={this.updateLabel}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.description']} allowClear/>
              <Space>
                <span>{messages['component.bpmnMain.propertyPanel.execution-listener']} 👉</span>
                <Button type="dashed">{messages['component.bpmnMain.propertyPanel.edit']}</Button>
              </Space>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.sequence-flow.condition-expression']}
                     value={ConditionValue} onChange={this.updateCondition} allowClear/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.sequence-flow.skip-expression']}
                     allowClear/>
            </Space>
          </Card>
        )}

        {showGateway && (
          <Card title={messages['component.bpmnMain.propertyPanel.gateway']} bordered={false}>
            <Space direction="vertical" size="large">
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.id']} allowClear value={elementInfo.id}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.name']} allowClear value={elementInfo.name}
                     onChange={this.updateLabel}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.description']} allowClear/>
              <Space>
                <span>{messages['component.bpmnMain.propertyPanel.execution-listener']} 👉</span>
                <Button type="dashed">{messages['component.bpmnMain.propertyPanel.edit']}</Button>
              </Space>
              <Space>
                <span>{messages['component.bpmnMain.propertyPanel.gateway.async']} 👉</span>
                <Switch checkedChildren={messages['component.bpmnMain.propertyPanel.gateway.open']}
                        unCheckedChildren={messages['component.bpmnMain.propertyPanel.gateway.close']}/>
              </Space>
            </Space>
          </Card>
        )}

        {showStartEnd && (
          <Card title={messages['component.bpmnMain.propertyPanel.start-end']} bordered={false}>
            <Space direction="vertical" size="large">
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.id']} allowClear value={elementInfo.id}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.name']} allowClear value={elementInfo.name}
                     onChange={this.updateLabel}/>
              <Input addonBefore={messages['component.bpmnMain.propertyPanel.description']} allowClear/>
              <Space>
                <span>{messages['component.bpmnMain.propertyPanel.execution-listener']} 👉</span>
                <Button type="dashed">{messages['component.bpmnMain.propertyPanel.edit']}</Button>
              </Space>
            </Space>
          </Card>
        )}
      </div>
    );
  }
}

export default PropertyPanel;
