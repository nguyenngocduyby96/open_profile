import React from "react";
import { Button, Input } from "antd";
import styled from "styled-components";
import { DataType, ShowDetail } from "./ShowDetail";
import axios from "axios";
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Home: React.FC = () => {
  const [apiUrl, setApiUrl] = React.useState("");
  const [isShowDetail, setIsShowDetail] = React.useState(false);
  const [listData, setListData] = React.useState<DataType[]>([])

  async function callGetListProfile() {
    try {
      const response = await axios.get(`${apiUrl}/v2/profiles`);
      setListData(response.data)
    } catch (error) {
      console.error(error);
    }
    setIsShowDetail(true);
  }

  return (
    <Container>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
          maxWidth: 200,
        }}
      >
        <Input
          type="text"
          placeholder="Input API URL here..."
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        <Button
          type="primary"
          disabled={!apiUrl}
          onClick={() => callGetListProfile()}
        >
          Lấy ra list Profile
        </Button>
      </div>
      {isShowDetail && <ShowDetail data={listData} apiUrl={apiUrl} />}
    </Container>
  );
};
