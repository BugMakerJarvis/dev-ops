import React, {Component} from 'react';
import {Input, Radio, Select, Form, Button, Checkbox, Divider, Switch} from 'antd';
import styles from './index.less';

const {Option} = Select;

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
      users: [
        {value: 'ls@163.com', label: '李四'},
        {value: 'zs@qq.com', label: '张三'},
        {value: '$INITIATOR', label: '发起人自己'},
      ],
      roles: [
        {value: 'to_review', label: '复核人'},
        {value: 'rechecker', label: '审定人'},
      ],
      // 任务节点
      element: null,
    };
  }

  componentDidMount() {
    this.addEventListener();
  }

  /** 添加节点事件监听 */
  addEventListener = () => {
    this.props.bpmn.on('selection.changed', (e) => {
      const element = e.newSelection[0];
      console.log('selection.changed', element);
      if (element) {
        this.setState({
          element,
        });
      }
    });

    this.props.bpmn.on('root.added', (e) => {
      const {element} = e;
      console.log('root.added', element);
      if (element.type === 'bpmn:Process') {
        this.setState({
          element,
        });
      }
    });

    this.props.bpmn.on('element.click', (e) => {
      const {element} = e;
      console.log('element.click', element);
      if (element.type === 'bpmn:Process') {
        this.setState({
          element,
        });
      }
    });
  };

  /**
   * 编辑Xml节点颜色
   * @param {String} color 颜色
   */
  editColor = (color) => {
    const modeling = this.props.bpmn.get('modeling');
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
    console.log('updateLabel', newName);
    const modeling = this.props.bpmn.get('modeling');
    const {element} = this.state;
    modeling.updateLabel(element, newName);
  };

  /**
   * 更新xml节点属性
   * @param {Object} params 对象参数
   */
  updateProperties = (params) => {
    const modeling = this.props.bpmn.get('modeling');
    const element = this.state.element;
    modeling.updateProperties(element, params);
  };

  // @todo 属性面板
  render() {
    const {bpmn} = this.props;
    const {element} = this.state;
    const type = element?.type;

    /** 是否显示Process组件 */
    const showProcess = ['bpmn:Process'].includes(type);

    /** 是否显示StartEnd组件 */
    const showStartEnd = ['bpmn:IntermediateThrowEvent', 'bpmn:StartEvent', 'bpmn:EndEvent'].includes(type);

    /** 是否显示Task组件 */
    const showTask = ['bpmn:UserTask',
      'bpmn:Task',
      'bpmn:SendTask',
      'bpmn:ReceiveTask',
      'bpmn:ManualTask',
      'bpmn:BusinessRuleTask',
      'bpmn:ServiceTask',
      'bpmn:ScriptTask',
      // 'bpmn:CallActivity',
      // 'bpmn:SubProcess',
    ].includes(type);

    /** 是否显示SequenceFlow组件 */
    const showSequenceFlow = ['bpmn:SequenceFlow'].includes(type);

    /** 是否显示Gateway组件 */
    const showGateway = ['bpmn:InclusiveGateway', 'bpmn:ExclusiveGateway', 'bpmn:ParallelGateway', 'bpmn:EventBasedGateway'].includes(type);

    return (
      <div className={styles.PropertyPanel}>
        {showProcess && (
          <Form name="Process" labelCol={{span: 8}}>
            <Divider orientation="center">流程</Divider>
            <Form.Item label="流程标识Key" name="id"
                       rules={[{required: true, message: 'Please input process key!'}]}>
              <Input/>
            </Form.Item>
            <Form.Item label="流程分类" name="processCategory">
              <Select placeholder="Please select...">
                <Option value="categoryOne">流程类别一</Option>
                <Option value="categoryTwo">流程类别二</Option>
              </Select>
            </Form.Item>
            <Form.Item label="流程名称" name="name">
              <Input/>
            </Form.Item>
            <Form.Item label="节点描述" name="documentation">
              <Input/>
            </Form.Item>
            <Form.Item label="执行监听器" name="executionListener">
              <Button type="dashed">编辑</Button>
            </Form.Item>
          </Form>
        )}

        {showTask && (
          <Form name="Task" labelCol={{span: 8}}>
            <Divider orientation="center">任务</Divider>
            <Form.Item label="节点Id" name="id"
                       rules={[{required: true, message: 'Please input node id!'}]}>
              <Input key={element.id} value={element.id} onChange={(e) => {
                console.log(e.target.value)
              }}/>
            </Form.Item>
            <Form.Item label="节点名称" name="name"
                       rules={[{required: true, message: 'Please input node name!'}]}>
              <Input/>
            </Form.Item>
            <Form.Item label="节点描述" name="documentation">
              <Input/>
            </Form.Item>
            <Form.Item label="任务监听器" name="taskListener">
              <Button type="dashed">编辑</Button>
            </Form.Item>
          </Form>
        )}

        {showSequenceFlow && (
          <Form name="SequenceFlow" labelCol={{span: 8}}>
            <Divider orientation="center">流程线</Divider>
            <Form.Item label="节点Id" name="id"
                       rules={[{required: true, message: 'Please input node id!'}]}>
              <Input/>
            </Form.Item>
            <Form.Item label="节点名称" name="name">
              <Input/>
            </Form.Item>
            <Form.Item label="节点描述" name="documentation">
              <Input/>
            </Form.Item>
            <Form.Item label="执行监听器" name="executionListener">
              <Button type="dashed">编辑</Button>
            </Form.Item>
            <Form.Item label="跳转条件" name="conditionExpression">
              <Input/>
            </Form.Item>
            <Form.Item label="跳过表达式" name="skipExpression">
              <Input/>
            </Form.Item>
          </Form>
        )}

        {showGateway && (
          <Form name="Gateway" labelCol={{span: 8}}>
            <Divider orientation="center">网关</Divider>
            <Form.Item label="节点Id" name="id"
                       rules={[{required: true, message: 'Please input node id!'}]}>
              <Input/>
            </Form.Item>
            <Form.Item label="节点名称" name="name">
              <Input/>
            </Form.Item>
            <Form.Item label="节点描述" name="documentation">
              <Input/>
            </Form.Item>
            <Form.Item label="执行监听器" name="executionListener">
              <Button type="dashed">编辑</Button>
            </Form.Item>
            <Form.Item label="异步" name="async">
              <Switch checkedChildren="开启" unCheckedChildren="关闭"/>
            </Form.Item>
          </Form>
        )}

        {showStartEnd && (
          <Form name="StartEnd" labelCol={{span: 8}}>
            <Divider orientation="center">始末节点</Divider>
            <Form.Item label="节点Id" name="id"
                       rules={[{required: true, message: 'Please input node id!'}]}>
              <Input/>
            </Form.Item>
            <Form.Item label="节点名称" name="name">
              <Input/>
            </Form.Item>
            <Form.Item label="节点描述" name="documentation">
              <Input/>
            </Form.Item>
            <Form.Item label="执行监听器" name="executionListener">
              <Button type="dashed">编辑</Button>
            </Form.Item>
            <Form.Item label="发起人" name="initiator">
              <Input/>
            </Form.Item>
          </Form>
        )}
      </div>
    );
  }
}

export default PropertyPanel;
