function randomStr() {
  return Math.random().toString(36).slice(-8)
}

const processId = "process_" + randomStr();
const processName = "name_" + randomStr();

export default `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:activiti="http://activiti.org/bpmn" targetNamespace="http://www.activiti.org/processdef">
  <process id="${processId}" name="${processName}" isExecutable="true">
    <documentation>${processName}</documentation>
    <startEvent id="Event_10j6a1b" />
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
    <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="${processId}">
      <bpmndi:BPMNShape id="Event_10j6a1b_di" bpmnElement="Event_10j6a1b">
        <omgdc:Bounds x="362" y="232" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;
