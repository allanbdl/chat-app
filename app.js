require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const mogoose = require('mongoose')
const cookieParser = require("cookie-parser")
const socketIO = require('socket.io')
const fun = require('./functions')
const Msg = require('./models/Msg')


mogoose.connect(process.env.URL_MONGO, (err, db) => {
    if (err) console.log(err)
    else console.log(db.name)
})

app.set('view engine', 'ejs')
app.set('views', (__dirname + '/public'))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())

if (process.env.AMB != 'dev') {
    app.use("*", (req, res, next) => {
        if (req.headers['x-forwarded-proto'] == 'https') next()
        else res.redirect('https://' + req.headers.host + req.originalUrl)
    })
}

app.use('/', express.json(), express.urlencoded())

app.get('/login', fun.login)
app.get('/logout', fun.logout)
app.post('/login', fun.loginPost)
app.get('/', fun.verifyLog, fun.index)
app.get('/register', fun.verifyLog, fun.verifyAdmin, fun.allUser)
app.post('/register', fun.verifyLog, fun.verifyAdmin, fun.registerPost)
app.get('/deleteuser/:id', fun.verifyLog, fun.verifyAdmin, fun.delete)

const server = app.listen(PORT, () => console.log('Server Running', PORT))
const io = socketIO(server)

io.on('connection', async (socket) => {

    let msgDB = await Msg.findOne({})
    let msg = msgDB.msg

    socket.emit('update', msg)

    socket.on('new', data => {
        msg.push(JSON.parse(data))
        Msg.findOneAndUpdate({}, { msg }).then(()=>{return})
        io.emit('update', msg)

    })
    socket.on('erase', data => {
        msg = data
        Msg.findOneAndUpdate({}, { msg }).then((data) => console.log(data, msg))
        io.emit('update', msg)
    })

    socket.on('ereaseOne',data=>{
        // console.log(msg,data)
        msg =msg.filter(doc=>{return doc.date!=data})
        Msg.findOneAndUpdate({}, { msg }).then((data) => console.log(data, msg))
        io.emit('update', msg)
    })
})


