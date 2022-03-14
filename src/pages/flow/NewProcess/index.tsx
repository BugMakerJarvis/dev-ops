import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from "umi";
import ProCard from "@ant-design/pro-card";
import {Button, message, Statistic, Steps} from "antd";
import {history} from "@@/core/history";
import {FileImageOutlined, FileTextOutlined, SolutionOutlined} from "@ant-design/icons";
import {flowRecord, processVariables} from "@/services/flow/task";
// @ts-ignore
import {GenerateForm, GenerateFormRef} from "react-form-create";
import BpmnView from "@/components/BpmnView";
import {startDefinition} from "@/services/flow/instance";
import moment from 'moment';

const {Divider} = ProCard;

export default (): React.ReactNode => {

  const h = useHistory();
  const search = h.location.search;
  const params = {
    deployId: "",
    procInsId: "",
    procDefId: "",
    taskId: "",
    newProcess: "false",
  };
  if (search) {
    const p: any[] = search.substring(1).split("&");
    p.map(v => params[v.split("=")[0]] = v.split("=")[1])
  }

  const generateFormRef = useRef<GenerateFormRef>(null);
  const [defFormContent, setDefFormContent] = useState<string>("");
  const [flowList, setFlowList] = useState<MODEL.TaskDetail[]>([]);
  const [defFormValue, setDefFormValue] = useState<any>({});

  useEffect(() => {
    flowRecord(params.newProcess === "true" ? "" : params.procInsId, params.deployId).then((d) => {
      setDefFormContent(JSON.stringify(d.formData));
      if (params.newProcess === "false") {
        setFlowList(d.flowList);
      }
    });
    if (params.newProcess === "false" && params.taskId !== "") {
      processVariables(params.taskId).then((d: object) => {
        for (const [key, val] of Object.entries(d)) {
          if (key.indexOf("DatePicker") !== -1) {
            setDefFormValue({...d, [key]: moment(new Date(val.toString()))})
          }
        }
      })
    }
  }, []);

  return (
    <div>
      <ProCard
        title={<div><FileTextOutlined/> 基础信息</div>}
        extra={
          <Button type="primary" ghost onClick={() => {
            history.push("/flow/myprocess");
          }}>
            返回
          </Button>
        }
      >
        <ProCard/>
        <ProCard colSpan={{xl: '50%',}} bordered layout="default" actions={params.newProcess === "false" ? [] : [
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
        ]}>
          {defFormContent === "" ? null :
            <GenerateForm formValue={defFormValue} widgetInfoJson={defFormContent} ref={generateFormRef}/>}
        </ProCard>
        <ProCard/>
      </ProCard>

      {params.newProcess === "true" ? null : <ProCard
        style={{marginTop: 18}}
        title={<div><SolutionOutlined/> 审批记录</div>}
        headerBordered
        layout="center"
      >
        <Steps direction="vertical" current={flowList.length - 1}>
          {flowList.map(f => <Steps.Step key={f.taskId} title={f.taskName} description={
            <ProCard.Group direction='row'>
              <ProCard>
                <Statistic title="实际办理" value={f.assigneeName === null ? "未知" : f.assigneeName}/>
              </ProCard>
              <Divider type='vertical'/>
              <ProCard>
                <Statistic title="接收时间" value={f.createTime === null ? "未知" : f.createTime}/>
              </ProCard>
              <Divider type='vertical'/>
              <ProCard>
                <Statistic title="办结时间" value={f.finishTime === null ? "未知" : f.finishTime}/>
              </ProCard>
              <Divider type='vertical'/>
              <ProCard>
                <Statistic title="耗时" value={f.duration === null ? "未知" : f.duration}/>
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
        <BpmnView deployId={params.deployId}/>
      </ProCard>
    </div>
  );
};
