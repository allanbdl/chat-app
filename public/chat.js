const socket = io('')

socket.on('update', msg => {
    updateScreen(msg)
})

let form = document.querySelector('form')
const ev = new Event('submit')

form.addEventListener('submit', e => {
    e.preventDefault()
    let user = document.querySelector('#user').innerHTML
    let text = document.querySelector('#text').value
    let messege = { user, text, date: Date.now() }
    socket.emit('new', JSON.stringify(messege))

    document.querySelector('#text').value = ''
})

function updateScreen(msg) {
    let user = document.querySelector('#user').innerHTML
    let screenChat = document.querySelector('#chatScreen')
    let list = ''
    msg.forEach(element => {
        if (element.user == user)
            list += `<div class="MychatMsg"><div onClick="del(event, '${element.user}')"  id="${element.date}" class="myMsg"><b>Você</b> diz: ${element.text}</div></div>`
        else list += `<div class=""><div onClick="del(event, '${element.user}')"  id="${element.date}"  class="msg"><b>${element.user}</b> diz: ${element.text}</div></div>`
    });
    document.querySelector('#chatScreen').innerHTML = list
    screenChat.scrollTo(0, screenChat.scrollHeight)

}

function erase() {
    let confirmA = confirm("Ao clicar em ok todo o histórico será apagado")
    if (confirmA) {
        let messege = []
        socket.emit('erase', messege)
    }
    else return
}

function enterTextArea(e) {
    if (e.which == 13) {
        e.preventDefault()
        form.dispatchEvent(ev)
    }
}

function del(e, user) {
    let thisUser = document.querySelector('#user').innerHTML
    let d = getDate(Number(e.target.id))
    if (thisUser == user) {
        let confirmA = confirm(`Data de Envio ${d} \n Deseja apagar essa msg?`)
        if (confirmA) socket.emit('ereaseOne', e.target.id)
    }
    else alert(`Data de Envio ${d}`)
}

function getDate(mili){
    let d = new Date(mili)
    let year = d.getFullYear()
    let month = d.getMonth()
    let day = d.getDay()
    let hour = d.getHours()
    let minute = d.getMinutes()
    return `${day}/${month}/${year} - ${hour}:${minute}`
}