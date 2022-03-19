import BpmnViewer from "bpmn-js/lib/Viewer";
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import React, {Component} from "react";
import {readXml} from "@/services/flow/definition";
import {message} from "antd";
import Xml from "@/components/BpmnMain/xml";
import './index.less';
import {getFlowViewer} from "@/services/flow/task";

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
    const procInsId = this.props.procInsId;
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

        try {
          let canvas = this.state.bpmnView.get('canvas');
          const taskList = await getFlowViewer(procInsId);
          if (taskList && taskList.length > 0) {
            this.state.bpmnView.getDefinitions().rootElements[0].flowElements.forEach(n => {
              if (n.$type === 'bpmn:UserTask') {
                let completeTask = taskList.find(m => m.key === n.id)
                let todoTask = taskList.find(m => !m.completed)
                let endTask = taskList[taskList.length - 1]
                if (completeTask) {
                  canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo');
                  n.outgoing.forEach(nn => {
                    let targetTask = taskList.find(m => m.key === nn.targetRef.id)
                    if (targetTask) {
                      canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo');
                    } else if (nn.targetRef.$type === 'bpmn:ExclusiveGateway') {
                      // canvas.addMarker(nn.id, 'highlight');
                      canvas.addMarker(nn.id, completeTask.completed ? 'highlight' : 'highlight-todo');
                      canvas.addMarker(nn.targetRef.id, completeTask.completed ? 'highlight' : 'highlight-todo');
                    } else if (nn.targetRef.$type === 'bpmn:EndEvent') {
                      if (!todoTask && endTask.key === n.id) {
                        canvas.addMarker(nn.id, 'highlight');
                        canvas.addMarker(nn.targetRef.id, 'highlight');
                      }
                      if (!completeTask.completed) {
                        canvas.addMarker(nn.id, 'highlight-todo');
                        canvas.addMarker(nn.targetRef.id, 'highlight-todo');
                      }
                    }
                  });
                }
              } else if (n.$type === 'bpmn:ExclusiveGateway') {
                /** 86-89 解决Gateway不显示颜色*/
                let completeGateway = taskList.find(m => m.key === n.id);
                if (completeGateway) {
                  canvas.addMarker(n.id, completeGateway.completed ? 'highlight' : 'highlight-todo');

                  n.outgoing.forEach(nn => {
                    let targetTask = taskList.find(m => m.key === nn.targetRef.id)
                    if (targetTask) {
                      canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo');
                    }
                  })
                }
              } else if (n.$type === 'bpmn:StartEvent') {
                n.outgoing.forEach(nn => {
                  let completeTask = taskList.find(m => m.key === nn.targetRef.id)
                  if (completeTask) {
                    canvas.addMarker(nn.id, 'highlight');
                    canvas.addMarker(n.id, 'highlight');
                    return
                  }
                });
              } else if (n.$type === 'bpmn:EndEvent') {
                /** 86-89 解决End不显示颜色*/
                let completeEnd = taskList.find(m => m.key === n.id);
                if (completeEnd) {
                  canvas.addMarker(n.id, completeEnd.completed ? 'highlight' : 'highlight-todo');
                }
              }
            })
          }
        } catch (err) {
          console.log('error rendering', err);
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
