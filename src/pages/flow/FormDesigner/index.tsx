import React, {useRef, useState} from 'react'
// @ts-ignore
import {DesignForm, DesignFormRef} from 'react-form-create'
import 'antd/dist/antd.css'
import 'react-form-create/dist/style.css'
import {Button, Form, Input, message, PageHeader} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import {addForm} from "@/services/flow/form";
import {history} from "@@/core/history";

export default (): React.ReactNode => {
  const ref = useRef<DesignFormRef>(null);

  const [formName, setFormName] = useState<string>("");
  const [remark, setRemark] = useState<string>("");

  return (
    <div style={{height: 1000, marginBottom: 74}}>
      <PageHeader
        ghost={false}
        title="表单设计"
        extra={[
          <Form
            key="sf"
            name="sf"
            layout="inline"
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
          >
            <Form.Item
              label="表单名称"
              name="formName"
              rules={[{required: true, message: 'Please input the form name!'}]}
            >
              <Input style={{width: 175}} onChange={(e) => setFormName(e.target.value)}/>
            </Form.Item>
            <Form.Item
              label="备注"
              name="remark"
            >
              <Input style={{width: 175}} onChange={(e) => setRemark(e.target.value)}/>
            </Form.Item>
            <Form.Item>
              <Button icon={<SaveOutlined/>} type="dashed" htmlType="submit" onClick={() => {
                const formContent: string = ref.current.getJson();
                try {
                  addForm({
                    "formName": formName,
                    "formContent": formContent,
                    "remark": remark,
                    // todo: createBy 当前操作人员未存入
                    // "createBy": "",
                  }).then(res => {
                    if (res === 1) {
                      message.success("保存成功");
                    } else {
                      message.error("保存失败");
                    }
                  });
                } catch (e: any) {
                  message.error(e.message);
                }
                history.push("/flow/form");
              }}>保存表单</Button>
            </Form.Item>
          </Form>
        ]}
      >
      </PageHeader>
      <DesignForm ref={ref}/>
    </div>
  )
}
