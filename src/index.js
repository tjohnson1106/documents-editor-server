const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");

let value = {
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "A line of text in a paragraph."
              }
            ]
          }
        ]
      }
    ]
  }
};

io.on("connection", function(socket) {
  socket.on("send-value", () => {
    io.emit("init-value", value);
  });

  socket.on("new-operations", function(data) {
    value = data.value;
    io.emit("new-remote-operations", data);
    console.log(value);
  });
});

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

app.get("/groups/:id", (_req, res) => {
  res.send(value);
});

http.listen(4000, function() {
  console.log("listening on *:4000");
});
