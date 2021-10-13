const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Msg = require('./models/Msg')


module.exports.index = (req, res) => {
    let str = req.user.name
    let name = str.charAt(0).toUpperCase() + str.slice(1);
    res.render('index', { name: name, admin: req.user.admin })
}

module.exports.loginPost = (req, res) => {
    User.findOne({ name: req.body.name }).then(doc => {
        if (!doc) res.render('login', { err: "User Name or Password incorrect" })
        else {
            let verify = bcrypt.compareSync(req.body.password, doc.password)
            if (!verify) res.render('login', { err: "User Name or Password incorrect" })
            else {
                const token = jwt.sign({ _id: doc._id, admin: doc.admin, name: doc.name }, process.env.TOKEN_SECRET)
                res.cookie('secureCookie', JSON.stringify(token), { secure: true, httpOnly: true, maxAge: 31536000 })
                res.redirect('/')
            }
        }
    })
}

module.exports.login = (req, res) => {
    try {
        const token = JSON.parse(req.cookies.secureCookie)
        req.user = jwt.verify(token, process.env.TOKEN_SECRET)
        res.redirect('/')
    } catch (error) {
        res.render('login', { err: false })
    }
}

module.exports.verifyLog = (req, res, next) => {
    try {
        const token = JSON.parse(req.cookies.secureCookie)
        req.user = jwt.verify(token, process.env.TOKEN_SECRET)
        next()
    } catch (error) {
        res.redirect('/login')
    }
}

module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin)
        next()
    else res.status(401).send('Not Admin: access denied <br><a href="/">Return</a>')
}

module.exports.logout = (req, res) => {
    res.cookie('secureCookie', '')
    res.redirect('/login')
}

module.exports.allUser = async (req, res) => {
    let user = await User.find({ admin: false })
    res.render('register', { user, err: false })
}

module.exports.registerPost = async (req, res) => {
    userName = await User.findOne({ name: req.body.name })
    userEmail = await User.findOne({ name: req.body.email })
    if (userName || userEmail) {
        let user = await User.find({ admin: false })
        res.render('register', { user, err: true })
    }
    else {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
        })
        user.save().then(() => res.redirect('/register'))
            .catch(err => res.render('register', { err }))
    }
}

module.exports.delete = (req, res) => {
    User.findByIdAndDelete(req.params.id).then(res.redirect('/'))
}


