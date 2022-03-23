import React, { useRef } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Space } from 'antd';
import { deleteForm, formList } from '@/services/flow/form';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from '@@/core/history';
// @ts-ignore
import { GenerateForm, GenerateFormRef } from 'react-form-create';
import { ModalForm, ProFormInstance } from '@ant-design/pro-form';
import { getIntl, getLocale } from '@@/plugin-locale/localeExports';

const { messages } = getIntl(getLocale());

type FormDetail = {
  formId: number;
  formName: string;
  formContent: string;
  remark: string;
};

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();

  const generateFormRef = useRef<GenerateFormRef>(null);

  const formRef = useRef<ProFormInstance>();

  const columns: ProColumns<FormDetail>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: messages['pages.flow.form.field.formId'],
      key: 'formId',
      dataIndex: 'formId',
      width: 214,
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.form.field.formName'],
      key: 'formName',
      dataIndex: 'formName',
      width: 214,
      align: 'center',
    },
    {
      title: messages['pages.flow.form.field.remark'],
      key: 'remark',
      dataIndex: 'remark',
      width: 214,
      align: 'center',
      search: false,
    },
    {
      title: messages['pages.flow.form.field.option'],
      key: 'option',
      valueType: 'option',
      width: 214,
      align: 'center',
      render: (text, r) => {
        return (
          <Space>
            <ModalForm
              title={messages['pages.flow.form.detail']}
              formRef={formRef}
              trigger={
                <Button type="dashed" icon={<InfoCircleOutlined />}>
                  {messages['pages.flow.form.field.option.detail']}
                </Button>
              }
              submitter={false}
              onFinish={async (values) => {
                console.log(values);
                message.success(messages['pages.flow.form.response.submit.success']);
                return true;
              }}
            >
              <GenerateForm widgetInfoJson={r.formContent} ref={generateFormRef} />
            </ModalForm>
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => {
                history.push(`/flow/formdesigner?formId=${r.formId}`);
              }}
            >
              {messages['pages.flow.form.field.option.edit']}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={async () => {
                try {
                  const res = await deleteForm(r.formId);
                  if (res === 1) {
                    message.success(messages['pages.flow.form.response.delete.success']);
                  } else {
                    message.error(messages['pages.flow.form.response.delete.fail']);
                  }
                  actionRef.current?.reload();
                } catch (e: any) {
                  message.error(e.message);
                }
              }}
            >
              {messages['pages.flow.form.field.option.delete']}
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          rowKey="formId"
          search={{ labelWidth: 'auto' }}
          toolbar={{
            title: messages['pages.flow.form'],
            tooltip: '😓',
            actions: [
              <Button
                key="add"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => history.push('/flow/formdesigner')}
              >
                {messages['pages.flow.form.new']}
              </Button>,
            ],
          }}
          request={async (params) => {
            let list: FormDetail[] = [];
            try {
              await formList(
                params.formName === undefined ? {} : { formName: params.formName },
              ).then((d) => {
                list = d;
              });
            } catch (e: any) {
              message.error(e.message);
            }
            return {
              data: list,
              success: true,
              total: list.length,
            };
          }}
        />
      </div>
    </div>
  );
};
