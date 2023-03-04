import { Button, Input, Modal, Table, Tag } from "antd";
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
  index: number;
};
type Props = {
  data: DataType[];
  apiUrl:string;
};
export const ShowDetail: React.FC<Props> = ({ data,apiUrl }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [startNumber, setStartNumber] = React.useState("");
  const [endNumber, setEndNumber] = React.useState("")

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
    },
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


  const callOpenProfile = async (id:string) =>{
    try {
      const response = await axios.get(`${apiUrl}/v2/start?profile_id=${id}`);
    } catch (error) {
      console.error(error);
    }
    
  }

  const handleOk = () => {
    const list = data.slice(Number(startNumber)-1,Number(endNumber));
    list.forEach((element, index) =>{
        callOpenProfile(element.id)
    })
    setOpenModal(false);
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
        <div>Total Profile: {data.length} Kenh</div>
        <div>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Open Profile
          </Button>
        </div>
      </div>
      <Table
        rowKey={"id"}
        style={{ width: "90%" }}
        dataSource={data}
        columns={columns}
      />
      {openModal && (
        <Modal
          title="Basic Modal"
          open={openModal}
          onOk={handleOk}
          onCancel={() => setOpenModal(false)}
        >
          <div style={{ margin: "2rem" }}>
            <Input type="number" placeholder="Nhap tu acc so" value={startNumber} onChange={(e) => setStartNumber(e.target.value)}></Input>
          </div>
          <div style={{ margin: "2rem" }}>
            <Input type="number" placeholder="Nhap tu acc so" value={endNumber} onChange={(e) => setEndNumber(e.target.value)}></Input>
          </div>
        </Modal>
      )}
    </Wrapper>
  );
};
