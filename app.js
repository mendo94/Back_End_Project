const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

const VIEWS_PATH = path.join(__dirname, "/views");
global.models = require("./models");



const PORT = 8080;
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));

app.use(
  session({
    secret: "somesecret",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded());

app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.use(express.static("static"));
app.use("/js", express.static("static"));
app.use("/css", express.static("static"));
app.use("/img", express.static("static"));

///////////////////////////////////////////////////////////////
//              Setup route for client side access
///////////////////////////////////////////////////////////////
const clientRoutes = require("./routes/clientInteraction");

app.use("/client", clientRoutes);

const objectRoutes = require("./routes/boxItemHandling");

app.use("/object-handling", objectRoutes);

const userRouter = require("./routes/loginRegistration");

app.use("/users", userRouter);
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
//              DASHBOARD
///////////////////////////////////////////////////////////////

// app.get("/homepage", async (req, res) => {
//   const containers = await models.Container.findAll({});

//   res.render("homepage", { containers: containers });
// });



app.get("/homepage", async (req, res) => {
  // res.json(item);
  res.render("room-dashboard-display");
});

app.get("/room-view/:roomId", async (req, res) => {
  const room = await models.Room.findByPk(req.params.roomId);
  console.log(room);
  res.render(`homepage`, {currentRoom: room.name, roomId: room.id});
})

app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect("/registration");
});

app.get("/", (req, res) => {
  res.redirect("/users/registration");
});

///////////////////////////////////////////////////////////////

// table for household
app.get('/household-members', (req, res) => {
  res.render('household-members')
})

app.get('/create-room', (req, res) => {
  
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
