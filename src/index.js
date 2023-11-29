document.addEventListener('DOMContentLoaded', () => {

const url = "http://localhost:3000/dogs"
let editForm = false
let dogInEdit = 0
const tableBody = document.getElementById("table-body")
const dogFormElement = document.getElementById("dog-form")
const dogFormInputs = document.getElementsByTagName("input")

fetch(url)
.then(res => res.json())
.then(dogData => {
    dogData.forEach(dog => {
        addRow(dog)
    });
})

function addRow(dog){
    let row = document.createElement("tr")
    row.id = `dog-${dog.id}`

    const tableStructure = [["name",dog.name],["breed",dog.breed,],["sex",dog.sex]]

    tableStructure.forEach(column => {
        const cell = document.createElement("td")
        cell.name = column[0]
        const cellContent = document.createTextNode(column[1])
        cell.appendChild(cellContent)
        row.append(cell)
    })

    const buttonCell = document.createElement("td")
    const editButton = document.createElement("button")
    editButton.innerHTML = "Edit Dog"
    buttonCell.appendChild(editButton)
    row.appendChild(buttonCell)
    tableBody.appendChild(row)

    editButton.addEventListener("click", () => {
        editForm = true
        dogInEdit = row.id.split('-')[1]
        dogFormInputs[0].value = dog.name
        dogFormInputs[1].value = dog.breed
        dogFormInputs[2].value = dog.sex
    })
}

function updateRow(dog){
    rowToUpdate = document.getElementById(`dog-${dog.id}`)
    cellsToUpdate = rowToUpdate.getElementsByTagName("td")

    const tableStructure = [["name",dog.name],["breed",dog.breed,],["sex",dog.sex]]
    let i = 0

    tableStructure.forEach(column => {
        const cell = cellsToUpdate[i]
        cell.innerHTML = ""
        cell.name = column[0]
        const cellContent = document.createTextNode(column[1])
        cell.appendChild(cellContent)
        i++
    })
}


dogFormElement.addEventListener("submit", (event) => { 
    event.preventDefault()

    let dogData = {
        "name": dogFormInputs[0].value,
        "breed": dogFormInputs[1].value,
        "sex": dogFormInputs[2].value
    }

    if (editForm){
        patchRequest(dogData,dogInEdit)
        editForm = false
        dogInEdit = 0
    } else {
        postRequest(dogData)
    }

    dogFormElement.reset()
})

function patchRequest(dogData, index){
    fetch(`${url}/${index}`, {
        "method" : "PATCH",
        "headers" : {"Content-Type" : "application/json"},
        "body" : JSON.stringify(dogData)    
    }) .then(res => res.json())
    .then(dog => {
        updateRow(dog)
    })
}

function postRequest(dogData){
    fetch(url, {
        "method" : "POST",
        "headers" : {"Content-Type" : "application/json"},
        "body" : JSON.stringify(dogData)
    }) .then(res => res.json())
    .then(dog => {
        addRow(dog)
    })
}


//DOM content loaded end
})