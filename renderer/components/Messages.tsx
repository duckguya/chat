import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase";
interface IProps {
  id: string;
  author: string;
  createdAt: string;
  rooms: [string[]];
  text: string;
}
function Messages(data: IProps) {
  const [textTime, setTextTime] = useState("");

  useEffect(() => {
    const date = new Date(data.createdAt).toISOString().split("T")[0];
    const time = new Date(data.createdAt).toTimeString().split(" ")[0];
    setTextTime(date + " " + time);
  }, []);

  return (
    <React.Fragment>
      <Container>
        {data.author !== auth.currentUser.uid ? (
          <>
            <TheOtherPersonText>{data.text}</TheOtherPersonText>
            <TimeText>{textTime}</TimeText>
          </>
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