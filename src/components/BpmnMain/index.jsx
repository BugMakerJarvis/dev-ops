import React, {Component} from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnToolBar from './ToolBar';
import PropertyPanel from './PropertyPanel';
import BpmData from './BpmData';
import Xml from './xml';
import './index.less';
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import {readXml} from "@/services/flow/definition";
import {message} from "antd";
import {getLocale} from "@@/plugin-locale/localeExports";

class BpmnMain extends Component {
  /**
   * react v16.3版本后生命周期
   * A：Init    => constructor => getDerivedStateFromProps => render => componentDidMount
   * B: Update  => getDerivedStateFromProps => shoulComponentUpdate => render => getSnapshortBeforeUpdate => componentDidUpdate
   * C: Unmount => componentWillUnmount
   */
  constructor(props) {
    super(props);
    this.state = {
      bpmn: null,
      bpmData: new BpmData(),
    };
  }

  componentDidMount() {
    this.initBpmn();
    this.customPalette();
  }

  /** 初始化Bpmn */
  initBpmn = () => {
    const deployId = this.props.deployId;
    this.setState(
      {
        bpmn: new BpmnModeler({
          container: document.getElementById('canvas'),
          keyboard: {bindTo: window},
          // propertiesPanel: {
          //   parent: '.properties-panel',
          // },
          // additionalModules: [
          //   propertiesPanelModule,
          //   propertiesProviderModule,
          // ],
        }),
      },
      async () => {
        try {
          let receivedXml = null;
          if (deployId !== null) {
            try {
              receivedXml = await readXml(deployId);
            } catch (e) {
              message.error(e.message);
            }
          }
          const result = await this.state.bpmn.importXML(receivedXml === null ? Xml : receivedXml);
          const {warnings} = result;
          console.log(warnings, "BpmnMain warnings");
        } catch (err) {
          console.log(err.message, err.warnings);
        }
        // this.state.bpmn.importXML(Xml, (err) => {
        //   if (err) {
        //     console.error(err);
        //   }
        // });
      },
    );
  };

  // 定制左侧工具栏面板
  customPalette = () => {
    try {
      // 获取 bpmn 设计器实例
      const canvas = document.getElementById('canvas');
      const djsPalette = canvas.children[0].children[1].children[4];
      const djsPalStyle = {
        width: getLocale() === 'en-US' ? '210px' : '130px',
        padding: '5px',
        background: 'white',
        left: '20px',
        borderRadius: '5px',
      };
      for (var key in djsPalStyle) {
        djsPalette.style[key] = djsPalStyle[key];
      }
      const palette = djsPalette.children[0];
      const allGroups = palette.children;
      allGroups[0].style['display'] = 'none';
      // 修改控件样式
      for (var gKey in allGroups) {
        const group = allGroups[gKey];
        for (var cKey in group.children) {
          const control = group.children[cKey];
          const controlStyle = {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            padding: '5px',
          };
          if (
            control.className &&
            control.dataset &&
            control.className.indexOf('entry') !== -1
          ) {
            const controlProps = this.state.bpmData.getControl(
              control.dataset.action,
            );
            control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${controlProps['title']}</div>`;
            for (var csKey in controlStyle) {
              control.style[csKey] = controlStyle[csKey];
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {bpmn} = this.state;
    return (
      <div className="Bpmn">
        <div className="canvas" id="canvas"></div>
        {/* 工具栏 */}
        {bpmn && <BpmnToolBar bpmn={bpmn}/>}
        {/* 属性面板 */}
        {bpmn && <PropertyPanel bpmn={bpmn}/>}
        {/*<div className="properties-panel"></div>*/}
      </div>
    );
  }
}

export default BpmnMain;
