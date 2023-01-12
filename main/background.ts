import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { Server } from "socket.io";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
// const isProd: boolean = process.env.NODE_ENV === "development";
const isProd: boolean = process.env.NODE_ENV === "production";

// socket io
const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", function (socket) {
  // 접속한 클라이언트의 정보가 수신되면
  socket.on("joinRoom", function (data) {
    const roomId = data;
    console.log("roomid", roomId);
    // if (io.sockets.adapter.rooms.get(roomId))
    socket.join(roomId);
  });
  socket.on("message", function (data) {
    // 전체에 메시지 전송
    if (data.clickedId === "group") socket.emit("message", data);
    // 특정 클라이언트에게 메시지 전송
    else socket.to(data.clickedId).emit("message", data);
  });
});

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 750,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

ipcMain.on("SIGN_UP", (evt, payload) => {
  console.log(payload);
});

ipcMain.on(
  "SIGN_IN",
  async (event, payload: { email: string; password: string }) => {
    if (payload) {
      const userInfo = await signInWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
      userInfo.user.getIdToken().then(function (idToken) {
        event.reply("TOKEN", {
          accessToken: idToken,
          refreshToken: userInfo.user.refreshToken,
        });
      });
    }
  }
);

// ipcMain.on("FIRST_CONNECTION", (evt, payload) => {
//   const isLogin = jwtToken.verify(payload.token.accessToken).ok;

//   evt.reply("FIRST_CONNECTION", { isLogin });
// });

app.on("window-all-closed", () => {
  app.quit();
});
