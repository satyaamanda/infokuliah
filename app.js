const express = require('express')
const session = require('express-session')
const Controller = require('./controllers/index')
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(session({
  secret: 'yang tau aja',
  resave: false, 
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}))


app.use("/", require("./routes/index"))
app.use("/home", require("./routes/home"))
app.use("/login", require("./routes/login"))
app.use("/logout", require("./routes/logout"))
app.use("/register", require("./routes/register"))
app.get('/logout', Controller.logOut)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})