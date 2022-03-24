import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import { DesignForm, DesignFormRef } from 'react-form-create';
import 'antd/dist/antd.css';
import 'react-form-create/dist/style.css';
import { Button, Form, Input, message, PageHeader } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { addForm, getFormInfo, updateForm } from '@/services/flow/form';
import { history } from '@@/core/history';
import { useHistory } from 'umi';
import { getIntl, getLocale } from '@@/plugin-locale/localeExports';

const { messages } = getIntl(getLocale());

export default (): React.ReactNode => {
  const ref = useRef<DesignFormRef>(null);
  const [form] = Form.useForm();

  const [formId, setFormId] = useState<number>(0);
  const [formName, setFormName] = useState<string>('');
  const [remark, setRemark] = useState<string>('');
  const [isUpdateForm, setIsUpdateForm] = useState<boolean>(false);

  const his = useHistory();
  const search = his.location.search;

  useEffect(() => {
    let urlFormId = null;
    if (search) {
      urlFormId = search.substring(1).split('=')[1];
      getFormInfo(urlFormId).then((d) => {
        ref.current.setJson(d.formContent);
        form.setFieldsValue({
          formName: d.formName,
          remark: d.remark,
        });
        setFormId(d.formId);
        setFormName(d.formName);
        setRemark(d.remark);
        setIsUpdateForm(true);
      });
    }
  }, []);

  return (
    <div style={{ height: 1000, marginBottom: 74 }}>
      <PageHeader
        ghost={false}
        title={messages['pages.flow.formdesigner.title']}
        extra={[
          <Form
            key="sf"
            name="sf"
            layout="inline"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            form={form}
          >
            <Form.Item
              label={messages['pages.flow.formdesigner.label.formName']}
              name="formName"
              rules={[{ required: true, message: 'Please input the form name!' }]}
            >
              <Input style={{ width: 175 }} onChange={(e) => setFormName(e.target.value)} />
            </Form.Item>
            <Form.Item label={messages['pages.flow.formdesigner.label.remark']} name="remark">
              <Input style={{ width: 175 }} onChange={(e) => setRemark(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button
                icon={<SaveOutlined />}
                type="dashed"
                htmlType="submit"
                onClick={async () => {
                  const formContent: string = ref.current.getJson();
                  try {
                    if (isUpdateForm) {
                      await updateForm({
                        formId: formId,
                        formName: formName,
                        formContent: formContent,
                        remark: remark,
                        // todo: updateBy
                        // "updateBy": "",
                      }).then((res) => {
                        if (res === 1) {
                          message.success(
                            messages['pages.flow.formdesigner.response.save.success'],
                          );
                        } else {
                          message.error(messages['pages.flow.formdesigner.response.save.fail']);
                        }
                      });
                    } else {
                      await addForm({
                        formName: formName,
                        formContent: formContent,
                        remark: remark,
                        // todo: createBy
                        // "createBy": "",
                      }).then((res) => {
                        if (res === 1) {
                          message.success(
                            messages['pages.flow.formdesigner.response.save.success'],
                          );
                        } else {
                          message.error(messages['pages.flow.formdesigner.response.save.fail']);
                        }
                      });
                    }
                  } catch (e: any) {
                    message.error(e.message);
                  }
                  history.push('/flow/form');
                }}
              >
                {messages['pages.flow.formdesigner.button.save']}
              </Button>
            </Form.Item>
          </Form>,
        ]}
      ></PageHeader>
      <DesignForm ref={ref} />
    </div>
  );
};
