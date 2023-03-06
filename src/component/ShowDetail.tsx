import { Button, Input, Modal, Select, Table, Tag } from "antd";
import React from "react";
import styled from "styled-components";
import axios from "axios";
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

const filterKey = "nguyenngocduyby96akldjfklajdflk"
export const ShowDetail: React.FC<Props> = ({ data, apiUrl }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [startNumber, setStartNumber] = React.useState("");
  const [endNumber, setEndNumber] = React.useState("");
  const [filterGroup, setFilterGroup] = React.useState("nguyenngocduyby96akldjfklajdflk");

  const [currentData, setCurrentData] = React.useState<DataType[]>([]);

  React.useEffect(() => {
    if (data) {
      setCurrentData(data);
    }
  }, [data]);

  React.useEffect(() => {
    if (filterGroup !== "nguyenngocduyby96akldjfklajdflk") {
      setCurrentData(data.filter((item) => item.group_name === filterGroup));
    }
    else{
      setCurrentData(data)
    }
  }, [filterGroup]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Group Name",
      dataIndex: "group_name",
      key: "group_name",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
  ];

  const callOpenProfile = async (id: string) => {
    try {
      const response = await axios.get(`${apiUrl}/v2/start?profile_id=${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOk = () => {
    const list = currentData.slice(Number(startNumber) - 1, Number(endNumber));
    list.forEach((element, index) => {
      callOpenProfile(element.id);
    });
  };

  let optionSelectGroup: string[] = [];
  data.forEach((element, index) => {
    if (!optionSelectGroup.includes(element.group_name)) {
      optionSelectGroup.push(element.group_name);
    }
  });

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
    </Wrapper>
  );
};
