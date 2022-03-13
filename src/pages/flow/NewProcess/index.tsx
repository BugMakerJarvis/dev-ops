import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from "umi";
import ProCard from "@ant-design/pro-card";
import {Button, message} from "antd";
import {history} from "@@/core/history";
import {FileImageOutlined, FileTextOutlined, SolutionOutlined} from "@ant-design/icons";
import {flowRecord} from "@/services/flow/task";
// @ts-ignore
import {GenerateForm, GenerateFormRef} from "react-form-create";
import BpmnView from "@/components/BpmnView";
import {startDefinition} from "@/services/flow/instance";

export default (): React.ReactNode => {

  const h = useHistory();
  const search = h.location.search;
  const params = {
    deployId: "",
    procDefId: "",
    newProcess: false,
  };
  if (search) {
    const p: any[] = search.substring(1).split("&");
    p.map(v => params[v.split("=")[0]] = v.split("=")[1])
  }

  const generateFormRef = useRef<GenerateFormRef>(null);
  const [defFormContent, setDefFormContent] = useState<string>("");

  useEffect(() => {
    flowRecord("", params.deployId).then((d) => {
      setDefFormContent(JSON.stringify(d.formData));
    });
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
        <ProCard colSpan={{xl: '50%',}} bordered layout="default" actions={[
          <Button type="primary" onClick={async () => {
            try {
              const res = await startDefinition(params.procDefId, null);
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
          {defFormContent === "" ? null : <GenerateForm widgetInfoJson={defFormContent} ref={generateFormRef}/>}
        </ProCard>
        <ProCard/>
      </ProCard>

      {params.newProcess ? null : <ProCard
        style={{marginTop: 18}}
        title={<div><SolutionOutlined/> 审批记录</div>}
        headerBordered
        layout="center"
      >
        审批记录
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
