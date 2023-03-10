import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { ipcRenderer } from "electron";
import styled from "styled-components";

const Sign = dynamic(() => import("../components/Sign"), { ssr: false });
interface IFormData {
  email: string;
  password: string;
  passwordConfirm?: string;
}

function Home() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // ipcRenderer.send("PING");
    // ipcRenderer.on("PONG", (event, payload) => {
    //   console.log(payload);
    // });
    ipcRenderer.send("CONNECTION");
    ipcRenderer.on("CONNECTION", (evnet, payload) => {
      if (payload.length > 0) router.push("/room");
    });
  }, []);

  const handleModalClick = (type: boolean) => {
    setIsSignUp(type);
  };

  const handleSubmit = async (values: IFormData) => {
    try {
      ipcRenderer.send("SIGN_UP", values);
      ipcRenderer.on("TOKEN", (evnet, payload) => {
        if (payload) {
          router.push("/room");
        }
      });
    } catch (error) {
      alert("이미 존재하는 이메일입니다.");
      console.log("error: ", error.message);
    }
  };
  return (
    <React.Fragment>
      <Container>
        {!isSignUp ? (
          <SignWrapper>
            <Sign isSignIn={true} />
            <a onClick={() => handleModalClick(true)}>회원가입</a>
          </SignWrapper>
        ) : (
          <SignWrapper>
            <Sign isSignIn={false} handleSubmit={handleSubmit} />
            <a onClick={() => handleModalClick(false)}>로그인</a>
          </SignWrapper>
        )}
      </Container>
    </React.Fragment>
  );
}
const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;
const SignWrapper = styled.div`
  margin: 40px;
`;

export default Home;
