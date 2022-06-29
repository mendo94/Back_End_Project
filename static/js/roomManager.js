const boxOrganizer = document.getElementById('box-position-holder')

let currentRooms = []
let roomsAvailable = []
let boxesAvailable = []

async function getCurrentBoxes() {
    await fetch("../client/space/boxes")
    .then(raw => {
        return raw.json()
    })
    .then(info => {
        boxesAvailable = info
    })
    .catch (error => {return error})
    
}

async function getCurrentStorage() {
    await fetch("../client/space/rooms")
    .then(raw => {
        return raw.json()
    })
    .then(info => {
        currentRooms = info
        
        roomsAvailable = info
        console.log(roomsAvailable)
    })
    .catch (error => {return error})
}

async function setupDashboard () {
    await getCurrentStorage()
    await getCurrentBoxes()

    let storageRooms = roomsAvailable
    let storageBoxes = boxesAvailable
    for (let index = 0; index < storageRooms.length; index++) {
        const element = storageRooms[index];
        storageRooms[index].boxes = storageBoxes.filter(item => {
            return item.roomId == storageRooms[index].id
        })
    }
    console.log(storageRooms)
    currentRooms = storageRooms
    createTable()

}

function createTable () {
    let roomElements = currentRooms.map(container => {
        let boxElements = container.boxes.map(box => {
            return `<div class="card dragBox boxItem" ondragstart="dragStart(event)" draggable="true" id="box-${box.id}">
            <div class="card-body">
              <h4 class="card-title">${box.box}</h4>
              <a href="/object-handling/delete/box/room/${box.id}" class="card-link">Delete Box</a>
            </div>
          </div>`
        })
        return `<div class="card box-storage" id="container-${container.id}">
        <h1>${container.name}</h1>
        <a href="/room-view/${container.id}">Modify Room</a>
        <a href="/object-handling/delete/room/${container.id}">Delete Room</a>
        <div class="box-drag-position" id="drag${container.id}" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="drop(event)">
            ${boxElements.join('')}
          Drag Item Here
        </div>
        
      </div>`
    })
    console.log(roomElements)

    boxOrganizer.innerHTML = roomElements.join('')
}

function drop(ev) {
    if(ev.target.id.match('drag')) {
        ev.preventDefault();
        ev.target.classList.remove('drag-over')
        let data = ev.dataTransfer.getData("text");
        let containerElementId = ev.target.parentElement.id.split('-')[1]
        console.log(data.split('-')[1])
        console.log(containerElementId)
        
        fetch(`../client/boxes/${data.split('-')[1]}/${containerElementId}`, {
            method: 'POST'
        })
        .then(message => {
            debug.log('storage change successful!')
        })
        document.getElementById(data).classList.remove('hide');
        setupDashboard()
    }
    
}

setupDashboard()