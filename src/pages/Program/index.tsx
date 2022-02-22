import {programList, runNohup} from '@/services/program/program';
import {ProFormUploadButton} from '@ant-design/pro-form';
import ProTable, {ActionType} from '@ant-design/pro-table';
import {Button, Modal, notification, Tag} from 'antd';
import React, {useRef} from 'react';
import {useState} from 'react';

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const [programState, setProgramState] = useState<{
    showUpload: boolean,
  }>({
    showUpload: false
  });
  return <div>
    <div style={{marginBottom: 10}}>
      <ProTable
        actionRef={actionRef}
        columns={[
          {
            dataIndex: 'jarName',
            title: 'jar文件名'
          },
          {
            dataIndex: 'lastModifyTime',
            title: '最后修改日期'
          },
          {
            dataIndex: 'lastStartTime',
            title: '最后启动日期'
          },
          {
            dataIndex: 'pid',
            title: 'pid'
          },
          {
            dataIndex: 'isRunning',
            title: '运行状态',
            valueType: 'labels',
            render: (_, record) => {
              return <Tag title={record.isRunning ? "运行中" : "已停止"}
                          color={record.isRunning ? "green" : "red"}>{record.isRunning ? "运行中" : "已停止"}</Tag>
            }
          },
          {
            dataIndex: 'logName',
            title: '日志文件'
          },
          {
            title: '操作',
            valueType: 'option',
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render: (text, record, _, action) => [
              <a key={`${record.jarName}-start`} style={{
                color: record.isRunning ? 'red' : 'blue'
              }} onClick={async () => {
                try {
                  const d = await runNohup(record.jarName);
                  if (d) {
                    actionRef.current?.reload();
                    notification.success({
                      message: '启动成功！'
                    })
                  } else {
                    notification.error({
                      message: '启动失败！'
                    })
                  }
                } catch (e: any) {
                  notification.error({
                    message: '启动失败：' + e.message
                  })
                }
              }}>
                {record.isRunning ? "重启" : "启动"}
              </a>
            ],
            fixed: 'right'
          }
        ]}
        tableLayout="fixed"
        search={false}
        toolBarRender={() => [
          <Button type="primary" onClick={() => {
            setProgramState({
              ...programState,
              showUpload: true
            })
          }}>
            上传微服务
          </Button>
        ]}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        request={async (params) => {
          try {
            const d = await programList();
            console.log('微服务列表', d);
            return {
              data: d,
              success: true
            }
          } catch (e) {
            console.error('微服务列表', '请求出错', e);
            return {
              data: [],
              success: false,
            }

          }
        }}/>

      <Modal visible={programState.showUpload} title="微服务上传" onCancel={() => {
        setProgramState({
          ...programState,
          showUpload: false
        })
      }} onOk={() => {
        setProgramState({
          ...programState,
          showUpload: false
        })
        actionRef.current?.reload()
      }}>
        <ProFormUploadButton
          extra="支持扩展名：.jar"
          name="file"
          title="选择jar"
          max={1}
          fieldProps={{
            action: '/api/base/program/uploadjar',
            method: 'POST',
            multiple: false
          }}
        />
      </Modal>
    </div>
  </div>
}
