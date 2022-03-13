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
          console.log(warnings);
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

// const BpmnView = () => {
//
//   let bpmnViewer = null;
//
//   useEffect(() => {
//     initBpmnModeler();
//   }, [])
//
//   const initBpmnModeler = () => {
//     bpmnViewer = new BpmnViewer({
//       container: '#canvas',
//       height: '100vh',
//     });
//
//     createInitDiagram();
//   }
//
//   const createInitDiagram = async () => {
//     try {
//       const res = await bpmnViewer.importXML('<?xml version="1.0" encoding="UTF-8"?>\n' +
//         '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://www.flowable.org/processdef">\n' +
//         '  <process id="process_o3paapxw" name="name_v08nbdun">\n' +
//         '    <startEvent id="startNode1" name="开始" />\n' +
//         '  </process>\n' +
//         '  <bpmndi:BPMNDiagram id="BPMNDiagram_flow">\n' +
//         '    <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="process_o3paapxw">\n' +
//         '      <bpmndi:BPMNShape id="BPMNShape_startNode1" bpmnElement="startNode1" bioc:stroke="">\n' +
//         '        <omgdc:Bounds x="240" y="200" width="30" height="30" />\n' +
//         '        <bpmndi:BPMNLabel>\n' +
//         '          <omgdc:Bounds x="242" y="237" width="23" height="14" />\n' +
//         '        </bpmndi:BPMNLabel>\n' +
//         '      </bpmndi:BPMNShape>\n' +
//         '    </bpmndi:BPMNPlane>\n' +
//         '  </bpmndi:BPMNDiagram>\n' +
//         '</definitions>');
//       console.log(res);
//     } catch (e) {
//       console.error(e);
//     }
//   }
//
//   return (
//     <div className="BpmnView">
//       <div id="canvas" className="container"></div>
//     </div>
//   )
// }
//
// export default BpmnView;
