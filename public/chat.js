const socket = io('')

socket.on('update', msg => {
    updateScreen(msg)
})

let form = document.querySelector('form')

form.addEventListener('submit', e => {
    e.preventDefault()
    let user = document.querySelector('#user').innerHTML
    let text = document.querySelector('#text').value
    let messege = `<li><b>${user}</b> diz: ${text}</li>`
    socket.emit('new', messege)

    document.querySelector('#text').value = ''
})

function updateScreen(msg) {
    let list = ''
    msg.forEach(element => list += element);
    document.querySelector('ul').innerHTML = list
}

function erase() {
    let confirmA = confirm("Ao clicar em ok todo o histórico será apagado")
    if (confirmA) {
        let messege = []
        socket.emit('erase', messege)
    }
    else return
}