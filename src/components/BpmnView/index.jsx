import BpmnViewer from "bpmn-js/lib/Viewer";
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import React, {Component} from "react";
import {readXml} from "@/services/flow/definition";
import {message} from "antd";
import Xml from "@/components/BpmnMain/xml";
import './index.less';

class BpmnView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bpmnView: null,
    };
  }

  componentDidMount() {
    this.initBpmnView();
  }

  initBpmnView = () => {
    const deployId = this.props.deployId;
    this.setState(
      {
        bpmnView: new BpmnViewer({
          container: '#canvas',
          height: '100vh',
          additionalModules: [
            MoveCanvasModule, // 移动整个画布
          ]
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
          const result = await this.state.bpmnView.importXML(receivedXml === null ? Xml : receivedXml);
          const {warnings} = result;
          console.log(warnings, "BpmnView warnings");
          this.state.bpmnView.get("canvas").zoom("fit-viewport", "auto");
        } catch (err) {
          console.log(err.message, err.warnings);
        }
      },
    )
  }

  render() {
    return (
      <div className="BpmnView">
        <div id="canvas" className="container"></div>
      </div>
    );
  }
}

export default BpmnView;
