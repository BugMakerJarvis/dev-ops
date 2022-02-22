import React, {useEffect, useRef, useState} from 'react';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import {Tree, Input} from 'antd';
import {getOrgByName, getOrgTreeList, getUserListByParams} from "@/services/rbac/rbac";

const {Search} = Input;

type User = {
  id: number,
  username: string,
  nickname: string,
  phone: string,
  state: number,
  orgId: number,
  orgName: string,
  roleId: number,
  roleName: string,
  createTime: number,
  updateTime: number,
};

type DetailListProps = {
  selectedOrgId: number,
  selectedOrgName: string,
};

const DetailList: React.FC<DetailListProps> = (props) => {

  const ref = useRef<ActionType>();

  const columns: ProColumns<User>[] = [
    {
      title: '用户编号',
      key: 'id',
      dataIndex: 'id',
      valueType: 'digit',
      align: "center",
    },
    {
      title: '账号',
      key: 'username',
      dataIndex: 'username',
      valueType: 'text',
      align: "center",
    },
    {
      title: '昵称',
      key: 'nickname',
      dataIndex: 'nickname',
      valueType: 'text',
      align: "center",
    },
    {
      title: '手机号码',
      key: 'phone',
      dataIndex: 'phone',
      valueType: 'text',
      align: "center",
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      valueType: 'text',
      align: "center",
    },
    {
      title: '角色名称',
      key: 'roleName',
      dataIndex: 'roleName',
      valueType: 'text',
      align: "center",
    },
    {
      title: '创建时间',
      key: 'createdTime',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: "center",
    },
    {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      align: "center",
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: "center",
      render: () => [<a key="a">删除</a>],
    },
  ];

  return (
    <ProTable<User>
      columns={columns}
      params={{"orgId": props.selectedOrgId}}
      request={async (params) => {
        let userList: User[] = [];
        try {
          await getUserListByParams(params).then((d) => {
            userList = d.records;
            userList.forEach((user: any) => {
              if (user.id) {
                user.key = user.id
              }
            })
          })
        } catch (e) {
        }
        return {
          data: userList,
          success: true,
          total: userList.length,
        }
      }}
      actionRef={ref}
      pagination={{
        showSizeChanger: true,
      }}
      rowKey="key"
      search={false}
      toolBarRender={() => []}
      headerTitle={props.selectedOrgName}
    />
  );
};


export default (): React.ReactNode => {
  const [treeData, setTreeData] = useState<any[]>([]);

  const [selectedOrgId, setSelectedOrgId] = useState<number>(1);
  const [selectedOrgName, setSelectedOrgName] = useState<string>('');

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const copyTransFun = (arr: any[]) => {
    arr.forEach((item) => {
      if (item.name) {
        item.title = item.name;
        delete item.name;
      }
      if (item.id) {
        item.key = item.id;
        delete item.id;
      }
      if (item.children?.length) {
        copyTransFun(item.children);
      }
    });
  };

  useEffect(() => {
    // 获取左侧组织树状结构
    getOrgTreeList().then(d => {
      copyTransFun(d);
      setTreeData(d);
    })
  }, []);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
    setExpandedKeys(expandedKeysValue);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    console.log('onSelect', info);
    setSelectedOrgId(info.node.key);
    setSelectedOrgName(info.node.title);
    setSelectedKeys(selectedKeysValue);
  };

  const onSearch = async (orgName: string) => {
    await getOrgByName(orgName).then((d) => {
      onExpand([d.parentId]);
      onSelect([d.id], {
        node: {
          key: d.id,
          title: d.name,
        }
      });
    });
  };

  return (
    <div>
      <ProCard split="vertical">
        <ProCard colSpan="384px">
          <Search style={{marginBottom: 8}} placeholder="Search" onSearch={onSearch}/>
          <Tree
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={true}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            treeData={treeData}
          />
        </ProCard>
        <ProCard>
          <DetailList selectedOrgId={selectedOrgId} selectedOrgName={selectedOrgName}/>
        </ProCard>
      </ProCard>
    </div>
  );
}
