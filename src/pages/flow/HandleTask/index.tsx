import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'umi';
import ProCard from '@ant-design/pro-card';
import { Button, message, Statistic, Steps } from 'antd';
import { history } from '@@/core/history';
import {
  CloseCircleOutlined,
  EditOutlined,
  FileImageOutlined,
  FileTextOutlined,
  SolutionOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  completeTask,
  findReturnTaskList,
  flowRecord,
  processVariables,
  rejectTask,
  returnTask,
} from '@/services/flow/task';
// @ts-ignore
import { GenerateForm, GenerateFormRef } from 'react-form-create';
import BpmnView from '@/components/BpmnView';
import { startDefinition } from '@/services/flow/instance';
import moment from 'moment';
import { ModalForm, ProFormRadio, ProFormTextArea } from '@ant-design/pro-form';
import { getIntl, getLocale } from '@@/plugin-locale/localeExports';

const { messages } = getIntl(getLocale());

const { Divider } = ProCard;

export default (): React.ReactNode => {
  const h = useHistory();
  const search = h.location.search;
  const params = {
    deployId: '',
    procInsId: '',
    procDefId: '',
    taskId: '',
    // handleType "info" | "newProcess" | "handle"
    handleType: '',
  };
  if (search) {
    const p: any[] = search.substring(1).split('&');
    p.map((v) => (params[v.split('=')[0]] = v.split('=')[1]));
  }

  const generateFormRef = useRef<GenerateFormRef>(null);
  const [defFormContent, setDefFormContent] = useState<string>('');
  const [flowList, setFlowList] = useState<MODEL.TaskDetail[]>([]);
  const [stepLength, setStepLength] = useState<number>(0);
  const [defFormValue, setDefFormValue] = useState<any>({});
  const [returnList, setReturnList] = useState<any[]>([]);

  useEffect(() => {
    if ((params.handleType === 'info' || params.handleType === 'handle') && params.taskId !== '') {
      processVariables(params.taskId).then((d: object) => {
        setDefFormValue(d);
        for (const [key, val] of Object.entries(d)) {
          if (key.indexOf('DatePicker') !== -1) {
            setDefFormValue({ ...d, [key]: moment(new Date(val.toString())) });
          }
        }
      });
    }
    flowRecord(params.handleType === 'newProcess' ? '' : params.procInsId, params.deployId).then(
      (d) => {
        // 表单
        setDefFormContent(JSON.stringify(d.formData));
        // 流转记录
        if (params.handleType === 'info' || params.handleType === 'handle') {
          const fl = d.flowList;
          setStepLength(fl[0].duration === null ? fl.length - 1 : fl.length);
          setFlowList(fl);
        }
      },
    );
  }, []);

  return (
    <div>
      <ProCard
        title={
          <div>
            <FileTextOutlined /> {messages['pages.flow.handletask.title.basic']}
          </div>
        }
        extra={
          <Button
            type="primary"
            ghost
            onClick={() => {
              history.goBack();
            }}
          >
            {messages['pages.flow.handletask.button.goBack']}
          </Button>
        }
      >
        <ProCard />
        <ProCard
          colSpan={{ xl: '50%' }}
          bordered
          layout="default"
          actions={
            params.handleType === 'newProcess'
              ? [
                  <Button
                    type="primary"
                    onClick={async () => {
                      let variables = null;
                      await generateFormRef.current.getData().then((d: any) => {
                        variables = d;
                      });
                      try {
                        const res = await startDefinition(params.procDefId, variables);
                        if (res === '流程启动成功') {
                          message.success(
                            messages['pages.flow.handletask.response.submit.success'],
                          );
                        } else {
                          message.error(messages['pages.flow.handletask.response.submit.fail']);
                        }
                        history.push('/flow/myprocess');
                      } catch (e: any) {
                        message.error(e.message);
                      }
                    }}
                  >
                    {messages['pages.flow.handletask.button.submit']}
                  </Button>,
                  <Button
                    type="default"
                    onClick={() => {
                      generateFormRef.current.reset();
                    }}
                  >
                    {messages['pages.flow.handletask.button.reset']}
                  </Button>,
                ]
              : params.handleType === 'handle'
              ? [
                  <ModalForm
                    title={messages['pages.flow.handletask.title.approve']}
                    width={(window.screen.width * 2) / 5}
                    trigger={
                      <Button
                        type="dashed"
                        style={{
                          backgroundColor: 'lightgreen',
                          borderColor: 'yellow',
                          borderRadius: 5,
                        }}
                        icon={<EditOutlined />}
                      >
                        {messages['pages.flow.handletask.button.approve']}
                      </Button>
                    }
                    onFinish={async (v) => {
                      try {
                        const res = await completeTask({
                          taskId: params.taskId,
                          instanceId: params.procInsId,
                          comment: v.comment,
                        });
                        if (res) {
                          message.success(
                            messages['pages.flow.handletask.response.approve.success'],
                          );
                          history.push('/flow/todo');
                        } else {
                          message.error(messages['pages.flow.handletask.response.approve.fail']);
                        }
                      } catch (e: any) {
                        message.error(e.message);
                      }
                      return true;
                    }}
                  >
                    <ProFormTextArea
                      name="comment"
                      label={messages['pages.flow.handletask.comment.approve']}
                      rules={[{ required: true }]}
                    />
                  </ModalForm>,
                  <ModalForm
                    title={messages['pages.flow.handletask.title.return']}
                    width={(window.screen.width * 2) / 5}
                    trigger={
                      <Button
                        type="dashed"
                        style={{
                          backgroundColor: 'lightskyblue',
                          borderColor: 'yellow',
                          borderRadius: 5,
                        }}
                        icon={<UndoOutlined />}
                        onClick={async () => {
                          try {
                            const res = await findReturnTaskList({ taskId: params.taskId });
                            res.map((r: any) => {
                              r.label = r.name;
                              r.value = r.id;
                            });
                            setReturnList(res);
                          } catch (e: any) {
                            message.error(e.message);
                          }
                        }}
                      >
                        {messages['pages.flow.handletask.button.return']}
                      </Button>
                    }
                    onFinish={async (v) => {
                      try {
                        const res = await returnTask({
                          taskId: params.taskId,
                          targetKey: v.targetKey,
                          comment: v.comment,
                        });
                        if (res) {
                          message.success(
                            messages['pages.flow.handletask.response.return.success'],
                          );
                          history.push('/flow/todo');
                        } else {
                          message.error(messages['pages.flow.handletask.response.return.fail']);
                        }
                      } catch (e: any) {
                        message.error(e.message);
                      }
                      return true;
                    }}
                  >
                    <ProFormRadio.Group
                      name="targetKey"
                      label={messages['pages.flow.handletask.button.return.node']}
                      radioType="button"
                      options={returnList}
                      rules={[{ required: true }]}
                    />
                    <ProFormTextArea
                      name="comment"
                      label={messages['pages.flow.handletask.comment.return']}
                      rules={[{ required: true }]}
                    />
                  </ModalForm>,
                  <ModalForm
                    title={messages['pages.flow.handletask.title.reject']}
                    width={(window.screen.width * 2) / 5}
                    trigger={
                      <Button
                        type="dashed"
                        style={{ backgroundColor: 'red', borderColor: 'yellow', borderRadius: 5 }}
                        icon={<CloseCircleOutlined />}
                      >
                        {messages['pages.flow.handletask.button.reject']}
                      </Button>
                    }
                    onFinish={async (v) => {
                      try {
                        const res = await rejectTask({
                          taskId: params.taskId,
                          comment: v.comment,
                        });
                        if (res) {
                          message.success(
                            messages['pages.flow.handletask.response.reject.success'],
                          );
                          history.push('/flow/todo');
                        } else {
                          message.error(messages['pages.flow.handletask.response.reject.fail']);
                        }
                      } catch (e: any) {
                        message.error(e.message);
                      }
                      return true;
                    }}
                  >
                    <ProFormTextArea
                      name="comment"
                      label={messages['pages.flow.handletask.comment.reject']}
                      rules={[{ required: true }]}
                    />
                  </ModalForm>,
                ]
              : []
          }
        >
          {defFormContent === '' ? null : (
            <GenerateForm
              formValue={defFormValue}
              widgetInfoJson={defFormContent}
              ref={generateFormRef}
            />
          )}
        </ProCard>
        <ProCard />
      </ProCard>

      {params.handleType === 'newProcess' ? null : (
        <ProCard
          style={{ marginTop: 18 }}
          title={
            <div>
              <SolutionOutlined /> {messages['pages.flow.handletask.title.record']}
            </div>
          }
          headerBordered
          layout="center"
        >
          <Steps direction="vertical" current={stepLength}>
            {flowList.reverse().map((f) => (
              <Steps.Step
                key={f.taskId}
                title={
                  f.taskName === null
                    ? messages['pages.flow.handletask.title.record.anonymous']
                    : f.taskName
                }
                description={
                  <ProCard.Group direction="row">
                    <ProCard>
                      <Statistic
                        title={messages['pages.flow.handletask.title.record.assigneeName']}
                        value={
                          f.assigneeName === null
                            ? messages['pages.flow.handletask.title.record.unknown'].toString()
                            : f.assigneeName
                        }
                      />
                    </ProCard>
                    <Divider type="vertical" />
                    <ProCard>
                      <Statistic
                        title={messages['pages.flow.handletask.title.record.createTime']}
                        value={
                          f.createTime === null
                            ? messages['pages.flow.handletask.title.record.unknown'].toString()
                            : f.createTime
                        }
                      />
                    </ProCard>
                    <Divider type="vertical" />
                    <ProCard>
                      <Statistic
                        title={messages['pages.flow.handletask.title.record.finishTime']}
                        value={
                          f.finishTime === null
                            ? messages['pages.flow.handletask.title.record.unknown'].toString()
                            : f.finishTime
                        }
                      />
                    </ProCard>
                    <Divider type="vertical" />
                    <ProCard>
                      <Statistic
                        title={messages['pages.flow.handletask.title.record.duration']}
                        value={
                          f.duration === null
                            ? messages['pages.flow.handletask.title.record.unknown'].toString()
                            : f.duration
                        }
                      />
                    </ProCard>
                  </ProCard.Group>
                }
              />
            ))}
          </Steps>
        </ProCard>
      )}

      <ProCard
        style={{ marginTop: 18 }}
        title={
          <div>
            <FileImageOutlined /> {messages['pages.flow.handletask.title.diagram']}
          </div>
        }
        headerBordered
        layout="default"
      >
        <BpmnView deployId={params.deployId} procInsId={params.procInsId} />
      </ProCard>
    </div>
  );
};
