import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from "umi";
import ProCard from "@ant-design/pro-card";
import {Button, message, Statistic, Steps} from "antd";
import {history} from "@@/core/history";
import {
  CloseCircleOutlined,
  EditOutlined,
  FileImageOutlined,
  FileTextOutlined,
  SolutionOutlined,
  UndoOutlined
} from "@ant-design/icons";
import {
  completeTask,
  findReturnTaskList,
  flowRecord,
  processVariables,
  rejectTask,
  returnTask
} from "@/services/flow/task";
// @ts-ignore
import {GenerateForm, GenerateFormRef} from "react-form-create";
import BpmnView from "@/components/BpmnView";
import {startDefinition} from "@/services/flow/instance";
import moment from 'moment';
import {ModalForm, ProFormRadio, ProFormTextArea} from "@ant-design/pro-form";

const {Divider} = ProCard;

export default (): React.ReactNode => {

  const h = useHistory();
  const search = h.location.search;
  const params = {
    deployId: "",
    procInsId: "",
    procDefId: "",
    taskId: "",
    // handleType "info" | "newProcess" | "handle"
    handleType: "",
  };
  if (search) {
    const p: any[] = search.substring(1).split("&");
    p.map(v => params[v.split("=")[0]] = v.split("=")[1])
  }

  const generateFormRef = useRef<GenerateFormRef>(null);
  const [defFormContent, setDefFormContent] = useState<string>("");
  const [flowList, setFlowList] = useState<MODEL.TaskDetail[]>([]);
  const [stepLength, setStepLength] = useState<number>(0);
  const [defFormValue, setDefFormValue] = useState<any>({});
  const [returnList, setReturnList] = useState<any[]>([]);

  useEffect(() => {
    if ((params.handleType === "info" || params.handleType === "handle") && params.taskId !== "") {
      processVariables(params.taskId).then((d: object) => {
        setDefFormValue(d);
        for (const [key, val] of Object.entries(d)) {
          if (key.indexOf("DatePicker") !== -1) {
            setDefFormValue({...d, [key]: moment(new Date(val.toString()))})
          }
        }
      });
    }
    flowRecord(params.handleType === "newProcess" ? "" : params.procInsId, params.deployId).then((d) => {
      // 表单
      setDefFormContent(JSON.stringify(d.formData));
      // 流转记录
      if (params.handleType === "info" || params.handleType === "handle") {
        const fl = d.flowList;
        setStepLength(fl[0].duration === null ? fl.length - 1 : fl.length);
        setFlowList(fl);
      }
    });
  }, []);

  return (
    <div>
      <ProCard
        title={<div><FileTextOutlined/> 基础信息</div>}
        extra={
          <Button type="primary" ghost onClick={() => {
            history.goBack();
          }}>
            返回
          </Button>
        }
      >
        <ProCard/>
        <ProCard colSpan={{xl: '50%',}} bordered layout="default" actions={params.handleType === "newProcess" ? [
          <Button type="primary" onClick={async () => {
            let variables = null;
            await generateFormRef.current.getData().then((d: any) => {
              variables = d;
            });
            try {
              const res = await startDefinition(params.procDefId, variables);
              if (res === "流程启动成功") {
                message.success(res);
              } else {
                message.error(res);
              }
              history.push("/flow/myprocess");
            } catch (e: any) {
              message.error(e.message);
            }
          }}>提交</Button>,
          <Button type="default" onClick={() => {
            generateFormRef.current.reset();
          }}>
            重置
          </Button>,
        ] : (params.handleType === "handle" ? [
          <ModalForm
            title="审批流程"
            width={window.screen.width * 2 / 5}
            trigger={
              <Button type="dashed" style={{backgroundColor: "lightgreen", borderColor: "yellow", borderRadius: 5}}
                      icon={<EditOutlined/>}>
                审批
              </Button>
            }
            onFinish={async (v) => {
              try {
                const res = await completeTask({
                  "taskId": params.taskId,
                  "instanceId": params.procInsId,
                  "comment": v.comment,
                });
                if (res) {
                  message.success('审批成功');
                  history.push("/flow/todo");
                } else {
                  message.error("审批失败");
                }
              } catch (e: any) {
                message.error(e.message);
              }
              return true;
            }}
          >
            <ProFormTextArea name="comment" label="审批意见" rules={[{required: true}]}/>
          </ModalForm>,
          <ModalForm
            title="退回流程"
            width={window.screen.width * 2 / 5}
            trigger={
              <Button type="dashed" style={{backgroundColor: "lightskyblue", borderColor: "yellow", borderRadius: 5}}
                      icon={<UndoOutlined/>} onClick={async () => {
                try {
                  const res = await findReturnTaskList({"taskId": params.taskId});
                  res.map((r: any) => {
                    r.label = r.name;
                    r.value = r.id;
                  });
                  setReturnList(res);
                } catch (e: any) {
                  message.error(e.message);
                }
              }}>
                退回
              </Button>
            }
            onFinish={async (v) => {
              try {
                const res = await returnTask({
                  "taskId": params.taskId,
                  "targetKey": v.targetKey,
                  "comment": v.comment,
                });
                if (res) {
                  message.success('退回成功');
                  history.push("/flow/todo");
                } else {
                  message.error("退回失败");
                }
              } catch (e: any) {
                message.error(e.message);
              }
              return true;
            }}
          >
            <ProFormRadio.Group
              name="targetKey"
              label="退回节点"
              radioType="button"
              options={returnList}
            />
            <ProFormTextArea name="comment" label="退回意见" rules={[{required: true}]}/>
          </ModalForm>,
          <ModalForm
            title="驳回流程"
            width={window.screen.width * 2 / 5}
            trigger={
              <Button type="dashed" style={{backgroundColor: "red", borderColor: "yellow", borderRadius: 5}}
                      icon={<CloseCircleOutlined/>}>
                驳回
              </Button>
            }
            onFinish={async (v) => {
              try {
                const res = await rejectTask({
                  "taskId": params.taskId,
                  "comment": v.comment,
                });
                if (res) {
                  message.success('驳回成功');
                  history.push("/flow/todo");
                } else {
                  message.error("驳回失败");
                }
              } catch (e: any) {
                message.error(e.message);
              }
              return true;
            }}
          >
            <ProFormTextArea name="comment" label="驳回意见" rules={[{required: true}]}/>
          </ModalForm>,] : [])}>
          {defFormContent === "" ? null :
            <GenerateForm formValue={defFormValue} widgetInfoJson={defFormContent} ref={generateFormRef}/>}
        </ProCard>
        <ProCard/>
      </ProCard>

      {params.handleType === "newProcess" ? null : <ProCard
        style={{marginTop: 18}}
        title={<div><SolutionOutlined/> 审批记录</div>}
        headerBordered
        layout="center"
      >
        <Steps direction="vertical" current={stepLength}>
          {flowList.reverse().map(f =>
            <Steps.Step key={f.taskId} title={f.taskName === null ? "未命名节点" : f.taskName}
                        description={
                          <ProCard.Group direction='row'>
                            <ProCard>
                              <Statistic title="实际办理"
                                         value={f.assigneeName === null ? "未知" : f.assigneeName}/>
                            </ProCard>
                            <Divider type='vertical'/>
                            <ProCard>
                              <Statistic title="接收时间"
                                         value={f.createTime === null ? "未知" : f.createTime}/>
                            </ProCard>
                            <Divider type='vertical'/>
                            <ProCard>
                              <Statistic title="办结时间"
                                         value={f.finishTime === null ? "未知" : f.finishTime}/>
                            </ProCard>
                            <Divider type='vertical'/>
                            <ProCard>
                              <Statistic title="耗时"
                                         value={f.duration === null ? "未知" : f.duration}/>
                            </ProCard>
                          </ProCard.Group>
                        }/>)}
        </Steps>
      </ProCard>}

      <ProCard
        style={{marginTop: 18}}
        title={<div><FileImageOutlined/> 流程图</div>}
        headerBordered
        layout="default"
      >
        <BpmnView deployId={params.deployId} procInsId={params.procInsId}/>
      </ProCard>
    </div>
  );
};
