import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import {useEffect} from "react";
import './index.less';

const BpmnDesigner = () => {

  let bpmnModeler = null;

  useEffect(() => {
    initBpmnModeler();
  }, [])

  const initBpmnModeler = () => {
    bpmnModeler = new BpmnModeler({
      container: '#canvas',
      height: '100vh',
      propertiesPanel: {
        parent: '.properties-panel',
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule,
      ],
      // moddleExtensions: {
      //   camunda: camundaModdleDescriptor,
      // },
    });

    createInitDiagram();
  }

  const createInitDiagram = async () => {
    try {
      const res = await bpmnModeler.importXML('<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://www.flowable.org/processdef">\n' +
        '  <process id="process_o3paapxw" name="name_v08nbdun">\n' +
        '    <startEvent id="startNode1" name="开始" />\n' +
        '  </process>\n' +
        '  <bpmndi:BPMNDiagram id="BPMNDiagram_flow">\n' +
        '    <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="process_o3paapxw">\n' +
        '      <bpmndi:BPMNShape id="BPMNShape_startNode1" bpmnElement="startNode1" bioc:stroke="">\n' +
        '        <omgdc:Bounds x="240" y="200" width="30" height="30" />\n' +
        '        <bpmndi:BPMNLabel>\n' +
        '          <omgdc:Bounds x="242" y="237" width="23" height="14" />\n' +
        '        </bpmndi:BPMNLabel>\n' +
        '      </bpmndi:BPMNShape>\n' +
        '    </bpmndi:BPMNPlane>\n' +
        '  </bpmndi:BPMNDiagram>\n' +
        '</definitions>');
      console.log(res);
      console.log("属性面板数据 ", bpmnModeler.get('propertiesPanel'));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="BpmnDesigner">
      <div id="canvas" className="container"></div>
      <div className="properties-panel"></div>
    </div>
  )
}

export default BpmnDesigner;
