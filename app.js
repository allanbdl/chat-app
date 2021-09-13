require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const mogoose = require('mongoose')
const cookieParser = require("cookie-parser")
const socketIO = require('socket.io')
const fun = require('./functions')
const fs = require('fs')
const msgDB = process.env.MSG_DB


mogoose.connect(process.env.URL_MONGO, (err, db) => {
    if (err) console.log(err)
    else console.log(db.name)
})

app.set('view engine', 'ejs')
app.set('views', (__dirname + '/public'))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
app.use("*", (req, res, next) => {
    if (req.headers['x-forwarded-proto'] == 'https') next()
    else res.redirect('https://' + req.headers.host + req.originalUrl)
})


app.use('/', express.json(), express.urlencoded())

app.get('/login', fun.login)
app.get('/logout', fun.logout)
app.post('/login', fun.loginPost)
app.get('/', fun.verifyLog, fun.index)
app.get('/admin', fun.verifyLog, fun.verifyAdmin, fun.admin)
app.get('/register', fun.verifyLog, fun.verifyAdmin, fun.allUser)
app.post('/register', fun.verifyLog, fun.verifyAdmin, fun.registerPost)
app.get('/deleteuser/:id', fun.verifyLog, fun.verifyAdmin, fun.delete)



const server = app.listen(PORT, () => console.log('Server Running', PORT))
const io = socketIO(server)

let msg = []

fs.readFile('messegeDB.txt', 'UTF8', function (err, data) {
    if (err) { throw err }
    data == "" ? msg = [] : msg = JSON.parse(data)
})

io.on('connection', (socket) => {
    // console.log('new connection')
    socket.emit('update', msg)

    socket.on('new', data => {
        msg.push(data)
        io.emit('update', msg)
        let msgJson = JSON.stringify(msg)
        fs.writeFile(msgDB, `${msgJson}`, function (err) {
            if (err) { throw err }
            return
        })
    })
    socket.on('erase', data => {
        msg = data
        io.emit('update', msg)
        let msgJson = JSON.stringify(msg)
        fs.writeFile(msgDB, `${msgJson}`, function (err) {
            if (err) { throw err }
            return
        })
    })
})



