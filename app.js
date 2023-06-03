const express = require("express")

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views')
app.get("/", (req, res) => {
    res.render("Home")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("Register")
})
app.listen(8000, () => {
    console.log("app is running...");
})