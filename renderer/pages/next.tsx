import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout, Result } from "antd";

const { Header, Content } = Layout;

function Next() {
  return (
    <React.Fragment>
      <Content style={{ padding: 48 }}>
        <Result status="success" title="Nextron" subTitle="with Ant Design" />
      </Content>
    </React.Fragment>
  );
}

export default Next;
