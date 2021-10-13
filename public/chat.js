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
        let name = element.user.charAt(0).toUpperCase() + element.user.slice(1);
        if (name == user) list += `<div class="MychatMsg">
                                        <div class="myMsg">
                                        <b>Você</b> <span id="${element.date}" onClick="modal(event, '${name}')" class="pointer">diz: ${element.text}</span>
                                    </div></div>`
        else list += `<div class="">
                        <div class="msg">
                        <b>${name}</b> <span id="${element.date}" onClick="modal(event, '${name}')" class="pointer">diz: ${element.text}</span>
                    </div></div>`
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

function modal(e, user) {
    document.querySelector('.modal').classList.remove('hide')
    let thisUser = document.querySelector('#user').innerHTML
    let modalContainer = document.querySelector('.modalContainer')
    let d = getDate(Number(e.target.id))
    if (thisUser == user) {
        modalContainer.innerHTML =
            `<div>Data de Envio ${d}</div>
            <div><button onClick="del(${e.target.id})">Deletar Mensagem</button></div>`
    }
    else modalContainer.innerHTML = `<div>Data de Envio ${d}</div>`
}

function getDate(mili) {
    let d = new Date(mili)
    let year = d.getFullYear()
    let month = d.getMonth()+1 <10 ? '0' + d.getMonth()+1  : d.getMonth() +1
    let day = d.getDate() <10 ? "0" + d.getDate() : d.getDate()
    let hour = d.getHours()
    let minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
    return `${day}/${month}/${year} - ${hour}:${minute}`
}

function del(e) {
    let confirmA = confirm(`Deseja apagar essa msg?`)
    if (confirmA) {
        socket.emit('ereaseOne', e)
        document.querySelector('.modal').classList.add('hide')
        document.querySelector('.modalContainer').innerHTML = ''
    }
}

function hideModal(e) {
    if (e.target.classList == 'modal') {
        document.querySelector('.modal').classList.add('hide')
        document.querySelector('.modalContainer').innerHTML = ''
    }
}