import { join } from "path";
import express from "express";
import logger from "morgan";
import socketIO from "socket.io";
import events from "./events";
import socketController from "./socketController";

const PORT = process.env.PORT || 4000;

const app = express();

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.static(join(__dirname, "static")));

app.use("/static", express.static("static"));

app.get("/", (req, res) =>
  res.render("home", { events: JSON.stringify(events) })
);

const server = app.listen(PORT, console.log("💚server is running💚"));

const io = socketIO(server);

io.on("connection", (socket) => socketController(io, socket));
