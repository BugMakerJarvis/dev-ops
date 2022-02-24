import React, {useRef} from 'react';
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, message, Space} from "antd";
import {deleteForm, formList} from "@/services/flow/form";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {history} from "@@/core/history";
// @ts-ignore
import {GenerateForm, GenerateFormRef} from "react-form-create";
import {ModalForm, ProFormInstance} from '@ant-design/pro-form';

type FormDetail = {
  formId: number,
  formName: string,
  formContent: string,
  remark: string,
}

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();

  const generateFormRef = useRef<GenerateFormRef>(null);

  const formRef = useRef<ProFormInstance>();

  const columns: ProColumns<FormDetail>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: "center",
    },
    {
      title: "表单编号",
      key: "formId",
      dataIndex: "formId",
      width: 214,
      align: "center",
      search: false,
    },
    {
      title: "表单名称",
      key: "formName",
      dataIndex: "formName",
      width: 214,
      align: "center",
    },
    {
      title: "备注",
      key: "remark",
      dataIndex: "remark",
      width: 214,
      align: "center",
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 214,
      align: "center",
      render: (text, r) => {
        return (
          <Space>
            <ModalForm
              title="表单详情"
              formRef={formRef}
              trigger={
                <Button type="dashed" icon={<InfoCircleOutlined/>}>
                  详情
                </Button>
              }
              submitter={false}
              onFinish={async (values) => {
                console.log(values);
                message.success('提交成功');
                return true;
              }}
            >
              <GenerateForm widgetInfoJson={r.formContent} ref={generateFormRef}/>
            </ModalForm>
            <Button type="primary" ghost icon={<EditOutlined/>} onClick={() => {
              history.push(`/flow/formdesigner?formId=${r.formId}`);
            }}>编辑</Button>
            <Button danger icon={<DeleteOutlined/>} onClick={async () => {
              try {
                const res = await deleteForm(r.formId);
                if (res === 1) {
                  message.success("删除成功");
                } else {
                  message.error("删除失败");
                }
                actionRef.current?.reload();
              } catch (e: any) {
                message.error(e.message);
              }
            }}>删除</Button>
          </Space>
        );
      }
    }
  ];

  return (
    <div>
      <div style={{marginBottom: 10}}>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          rowKey="formId"
          toolbar={{
            title: '表单配置',
            tooltip: '😓',
            actions: [
              <Button key="add" type="primary" icon={<PlusOutlined/>}
                      onClick={() => history.push("/flow/formdesigner")}>
                新增
              </Button>,
            ],
          }}
          request={async (params) => {
            let list: FormDetail[] = [];
            try {
              await formList(params.formName === undefined ? {} : {"formName": params.formName}).then((d) => {
                list = d;
              });
            } catch (e: any) {
              message.error(e.message);
            }
            return {
              data: list,
              success: true,
              total: list.length,
            }
          }}
        >
        </ProTable>
      </div>
    </div>
  );
};
