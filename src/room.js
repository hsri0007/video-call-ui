import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import Peer from "peerjs";

const Room = (props) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userRef = useRef();
  const partnerRef = useRef();
  const userStream = useRef();
  const partnerStream = useRef();

  const MyPeer = new Peer();
  const socket = useRef();
  const [userId, setUserId] = useState("");
  const roomId = props.match.params.id;

  useEffect(() => {
    MyPeer.on("open", (id) => {
      setUserId(id);

      socket.current.emit("joined", roomId, id);
      socket.current.on("message", (item) => {
        setMessages((messages) => [...messages, item]);
      });
    });
  }, []);

  useEffect(() => {
    socket.current = io("http://localhost:4000/");

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    const constrains = { audio: true, video: true };
    navigator.mediaDevices.getUserMedia(constrains).then((stream) => {
      userRef.current.srcObject = stream;
      userStream.current = stream;

      MyPeer.on("call", (call) => {
        call.answer(stream);
        call.on("stream", (userVideoStream) => {
          partnerStream.current = userVideoStream;
          partnerRef.current.srcObject = userVideoStream;
        });
      });
      socket.current.on("user-connected", (id) => {
        const call = MyPeer.call(id, stream);

        call.on("stream", (userVideoStream) => {
          partnerRef.current.srcObject = userVideoStream;
        });
      });
    });
  }, [setMessages]);

  const handlemesssagesubmit = (e) => {
    const rid = props.match.params.id;
    e.preventDefault();
    const body = {
      text: message,
      id: userId,
    };
    socket.current.emit("sendmessages", body, rid);
  };

  return (
    <div>
      <h1>room id is {`${props.match.params.id}`}</h1>

      {!partnerRef.current && (
        <h2>be patience while connecting to your partner</h2>
      )}
      <div className="main__container">
        <div className="video__grid">
          <video
            className="video__box"
            height="auto"
            width="700px"
            autoPlay
            ref={partnerRef}
          ></video>
          <video
            className="video__box partner"
            height="auto"
            width="auto"
            autoPlay
            muted
            ref={userRef}
          ></video>
        </div>
        <div>
          <h1>chat area........</h1>
          <form onSubmit={handlemesssagesubmit}>
            <input type="text" onChange={(e) => setMessage(e.target.value)} />
            <button type="submit">submit</button>
          </form>

          {messages.map((user, i) =>
            user.id === userId ? (
              <div style={{ background: "skyblue", marginRight: "20px" }}>
                <h1 key={i}>
                  <span style={{ fontSize: "1rem" }}>you</span> {user.text}
                </h1>
              </div>
            ) : (
              <h1 key={i} style={{ color: "red" }}>
                <span style={{ fontSize: "1rem", marginRight: "20px" }}>
                  partner
                </span>
                {user.text}
              </h1>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
