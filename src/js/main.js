import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'

let url = 'http://localhost:3000/categories'

const tbody = document.querySelector('tbody')
const form = document.querySelector("form")
const name = document.querySelector("#name")
const image = document.querySelector("#url-image")

let idCache

index()

form.addEventListener('submit', async (event) => {
    //ACA DEBEMOS LLAMAR A LA FUNCION QUE SE ENCARGA DE GUARDAR
    event.preventDefault()
    if (idCache === undefined) {
        await create(name, image)
        form.reset()
    }else{
        await update(idCache, name, image)
        form.reset()
        idCache = undefined
    }
    
    await index()
})

tbody.addEventListener('click', async function (event) {
    // ACA DEBEMOS LOCALIZAR A LOS ESCUCHADORES DE EVENTOS
    if (event.target.classList.contains('btn-danger')){
        let categoryId = event.target.getAttribute('data-id')
        await deleteItem(categoryId)
        await index()
    }
    if (event.target.classList.contains('btn-warning')){
        idCache = event.target.getAttribute('data-id')
        let categoryFound = await find(idCache)
        console.log(categoryFound)

        name.value = categoryFound.name
        image.value = categoryFound.image
    }
})

async function index() {
    const response = await fetch(url)
    const data = await response.json()

    tbody.innerHTML = ""
    data.forEach(element => {
        tbody.innerHTML += `
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>
                <img width="100px" src=${element.image} alt=${element.name}>
            </td>
            <td>${element.creationAt}</td>
            <td>${element.updatedAt}</td>
            <td>
                <button type="button" data-id=${element.id} class="btn btn-warning">Edit</button>
                <button type="button" data-id=${element.id} class="btn btn-danger">Delete</button>
            </td>
        `
    })
}



async function create(name, image) {
    //ACA DEBEMOS PROGRAMAR LA PETICION PARA CREAR UNA CATEGORIA
    console.log(name.value)
    console.log(name.value)

    let newCategory ={
        name: name.value,
        image: image.value
    }

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
    })

}

async function find(categoryId) {
    //ACA DEBEMOS PROGRAMAR LA PETICION PARA BUSCAR UNA CATEGORIA
    let response = await fetch(`${url}/${categoryId}`)
    let data = await response.json()
    return data
}

async function update(idCache, name, image) {
    //ACA DEBEMOS PROGRAMAR LA PETICION PARA ACTUALIZAR UNA CATEGORIA
    let updateCategory = {
        name: name.value,
        image: image.value
    }

    await fetch(`${url}/${idCache}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateCategory)
    })
}

async function deleteItem(categoryId) {
    //ACA DEBEMOS PROGRAMAR LA PETICION PARA ELIMINAR UNA CATEGORIA
    await fetch(` ${url}/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}