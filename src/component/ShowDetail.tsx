import { Button, Input, Modal, Select, Table, Tag } from "antd";
import React from "react";
import styled from "styled-components";
import axios from "axios";
import { listProxy } from "../constant";
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
`;
export type DataType = {
  created_at: string;
  group_name: string;
  id: string;
  name: string;
  path: string;
  proxy: string;
};
type Props = {
  data: DataType[];
  apiUrl: string;
};

const filterKey = "nguyenngocduyby96akldjfklajdflk";
export const ShowDetail: React.FC<Props> = ({ data, apiUrl }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalProxy, setOpenModalProxy] = React.useState(false);
  const [startNumber, setStartNumber] = React.useState("");
  const [endNumber, setEndNumber] = React.useState("");

  const [profileStart, setProfileStart] = React.useState("");
  const [profileEnd, setProfileEnd] = React.useState("");
  const [proxyStart, setProxyStart] = React.useState("");
  const [proxyEnd, setProxyEnd] = React.useState("");
  const [filterGroup, setFilterGroup] = React.useState(
    "nguyenngocduyby96akldjfklajdflk"
  );

  const [currentData, setCurrentData] = React.useState<DataType[]>([]);

  React.useEffect(() => {
    if (data) {
      setCurrentData(data);
    }
  }, [data]);

  React.useEffect(() => {
    if (filterGroup !== "nguyenngocduyby96akldjfklajdflk") {
      setCurrentData(data.filter((item) => item.group_name === filterGroup));
    } else {
      setCurrentData(data);
    }
  }, [filterGroup]);

  const columns = [
    {
      title: "Id",
      key: "index",
      render: (text: any, record: any, index: any) => {
        const id = record.id;
        const idx = currentData.findIndex((i) => i.id === id);
        return idx + 1;
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Group",
      dataIndex: "group_name",
      key: "group_name",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Proxy",
      dataIndex: "proxy",
      key: "proxy",
    },
  ];

  const columnsProxy = [
    {
      title: "Id",
      key: "index",
      render: (text: any, record: any, index: any) => {
        const proxy = record.proxy;
        const i = listProxy.findIndex((i) => i === proxy);
        return i + 1;
      },
    },
    {
      title: "Tên Proxy",
      dataIndex: "proxy",
      key: "proxy",
    },
    {
      title: "Đang được sử dụng ở",
      dataIndex: "used",
      key: "used",
    },
  ];

  const listProxyTable = React.useMemo(() => {
    return listProxy.reduce((acc: any, key: any, i: number) => {
      console.log("index", i);
      const index = data.findIndex((item) => item.proxy === key);
      if (index === -1) {
        return [...acc, { proxy: key, used: "" }];
      }
      return [...acc, { proxy: key, used: data[index].name }];
    }, []);
  }, [listProxy]);

  const callOpenProfile = async (id: string) => {
    const response = await axios.get(`${apiUrl}/v2/start?profile_id=${id}`);
  };

  const handleOk = () => {
    const list = currentData.slice(Number(startNumber) - 1, Number(endNumber));
    list.forEach(async (element, index) => {
      await callOpenProfile(element.id);
    });
  };

  let optionSelectGroup: string[] = [];
  data.forEach((element, index) => {
    if (!optionSelectGroup.includes(element.group_name)) {
      optionSelectGroup.push(element.group_name);
    }
  });

  const callCloseProfile = async (id: string) => {
    await axios.get(`${apiUrl}/v2/stop?profile_id=${id}`);
  };

  const handleCloseProfile = () => {
    const list = currentData.slice(Number(startNumber) - 1, Number(endNumber));
    list.forEach((element, index) => {
      callCloseProfile(element.id);
    });
  };

  const callUpdateProxy = async (id: string, proxy: string) => {
    console.log({id})
    console.log({proxy})
    await axios.get(`${apiUrl}/v2/update?id=${id}&proxy=${proxy}`);
  };

  const handleUpdateProxy = () => {
    const listProfile = currentData.slice(
      Number(profileStart) - 1,
      Number(profileEnd)
    );
    const listProxyUpdate = listProxy.slice(
      Number(proxyStart) - 1,
      Number(proxyEnd)
    );
    listProfile.forEach((element, index) => {
      callUpdateProxy(element.id, listProxyUpdate[index]);
    });
  };

  return (
    <Wrapper>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "2rem",
        }}
      >
        <div>Tổng số lượng Profile: {currentData.length} Kênh</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: 20 }}>Bộ Lọc Group</div>
          <Select
            value={filterGroup}
            style={{ width: 300 }}
            onChange={(value) => setFilterGroup(value)}
            options={[
              ...optionSelectGroup.map((item) => ({
                value: item,
                label: item,
              })),
              { value: filterKey, label: "Tất cả các group" },
            ]}
          />
        </div>
        <div>
          <Button
            type="default"
            style={{ marginRight: 10 }}
            onClick={() => setOpenModalProxy(true)}
          >
            List Proxy
          </Button>
          <Button
            type="default"
            style={{ marginRight: 10 }}
            onClick={() => handleCloseProfile()}
          >
            Đóng tất cả Profile
          </Button>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Mở Profile
          </Button>
        </div>
      </div>
      <Table
        rowKey={"id"}
        style={{ width: "90%" }}
        dataSource={currentData}
        columns={columns}
      />
      {openModal && (
        <Modal
          title="Mở Profile"
          open={openModal}
          onOk={handleOk}
          onCancel={() => setOpenModal(false)}
        >
          <div style={{ margin: "2rem" }}>
            Mở từ acc số:
            <Input
              type="number"
              placeholder="Nhập từ acc số"
              value={startNumber}
              onChange={(e) => setStartNumber(e.target.value)}
            ></Input>
          </div>
          <div style={{ margin: "2rem" }}>
            Đến acc số:
            <Input
              type="number"
              placeholder="Đến acc số"
              value={endNumber}
              onChange={(e) => setEndNumber(e.target.value)}
            ></Input>
          </div>
        </Modal>
      )}

      {openModalProxy && (
        <Modal
          style={{ top: 10 }}
          width={"50%"}
          title="List Proxy"
          open={openModalProxy}
          onOk={() => setOpenModalProxy(false)}
          onCancel={() => setOpenModalProxy(false)}
          footer={[
            <Button key="back" onClick={() => setOpenModalProxy(false)}>
              Đóng
            </Button>,
          ]}
        >
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: 20 }}>
              Nhập Profile từ số:
              <Input
                type="number"
                value={profileStart}
                onChange={(e) => setProfileStart(e.target.value)}
              ></Input>
            </div>
            <div>
              Đến Profile số:
              <Input
                type="number"
                value={profileEnd}
                onChange={(e) => setProfileEnd(e.target.value)}
              ></Input>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: 20 }}>
              Nhập Proxy từ số:
              <Input
                type="number"
                value={proxyStart}
                onChange={(e) => setProxyStart(e.target.value)}
              ></Input>
            </div>
            <div>
              Đến Proxy số:
              <Input
                type="number"
                value={proxyEnd}
                onChange={(e) => setProxyEnd(e.target.value)}
              ></Input>
            </div>
          </div>
          <div style={{ padding: 10, display: "flex" }}>
            <Button type="primary" onClick={() => handleUpdateProxy()}>
              Update proxy
            </Button>
          </div>
          <Table
            rowKey={"proxy"}
            style={{ width: "90%" }}
            dataSource={listProxyTable}
            columns={columnsProxy}
          />
        </Modal>
      )}
    </Wrapper>
  );
};
