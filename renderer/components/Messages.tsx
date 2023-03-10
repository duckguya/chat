import { ipcRenderer } from "electron";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { roomTypeAtom } from "../atoms";
interface IProps {
  id: string;
  author: string;
  createdAt: string;
  rooms: [string[]];
  text: string;
}
interface IUser {
  uid: string;
  email: string;
  createdAt: number;
}
function Messages(data: IProps) {
  const [textTime, setTextTime] = useState("");
  const [loginInfo, setLoginInfo] = useState<IUser>();
  const scrollRef = useRef<HTMLInputElement>();
  const roomType = useRecoilValue(roomTypeAtom);

  useEffect(() => {
    ipcRenderer.send("PROFILE");
    ipcRenderer.on("PROFILE_UID", (event, userInfo) => {
      setLoginInfo(userInfo);
    });
    const date = new Date(data.createdAt).toISOString().split("T")[0];
    const time = new Date(data.createdAt).toTimeString().split(" ")[0];
    setTextTime(date + " " + time);
    // 스크롤 하단으로 내리기
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
    });
    // window.scrollTo(0, document.body.scrollHeight);
  }, []);

  return (
    <React.Fragment>
      <Container ref={scrollRef}>
        {data.author !== loginInfo?.email ? (
          <YourMessageWrapper>
            {roomType === "group" && <p>{data.author}</p>}
            <TextWrapper>
              <TheOtherPersonText>{data.text}</TheOtherPersonText>
              <TimeText>{textTime}</TimeText>
            </TextWrapper>
          </YourMessageWrapper>
        ) : (
          <MytextWrapper>
            <div />
            <TimeText>{textTime}</TimeText>
            <MyText>{data.text}</MyText>
          </MytextWrapper>
        )}
      </Container>
    </React.Fragment>
  );
}

const Container = styled.div`
  display: flex;
  align-items: flex-end;
  /* overflow: scroll; */
`;
const YourMessageWrapper = styled.div`
  padding-top: 10px;
  p {
    margin: 0;
    padding-bottom: 4px;
  }
`;
const TextWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;
const TextBox = styled.div`
  border: none;
  padding: 10px;
  border-radius: 5px;
`;
const TheOtherPersonText = styled(TextBox)`
  background-color: white;
`;
const MyText = styled(TextBox)`
  background-color: #ffe731;
`;
const TimeText = styled.div`
  color: gray;
  margin: 0 10px;
`;
const MytextWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;
export default Messages;
