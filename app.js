// Adquirimos los elementos del DOM donde vamos a ingresar los datos de usuario:
const form = document.getElementById('formRegister');
const nameinput = document.getElementById('nameinput');
const idinput = document.getElementById('idinput');

// Donde vamos a pintar los datos de Usuario:
const tablebody = document.getElementById('tablebody');

// Para almacenar estos datos en el localStorage, al actualizar, no se borre la info:
let data = JSON.parse(localStorage.getItem('formData')) || []; 

// Creamos funcion para que al evento "submit" click al boton (agregar), almacene la información en memoria
form.addEventListener('submit', function(event){

    // Elimina comportamientos por defecto del formulario
    event.preventDefault();
    
    const name = nameinput.value;
    const id = idinput.value;

    if(name && id){
        const date = new Date().toLocaleString();
        const newData = {name, id, date};
        data.push(newData);
        saveDataToLocalStorage();
        renderTable();
        form.reset();
    } else {
        alert('Favor llenar todos los campos');
    }
});

// Función para guardar los datos del formulario
function saveDataToLocalStorage(){
    localStorage.setItem('formData', JSON.stringify(data));
}

// Función para renderizar o actualizar el formulario, limpia el contenido de la tabla para nuevo registro
function renderTable(){
    tablebody.innerHTML = '';

    // Para generar todos los registros del formulario en una tabla necesitamos iterar el "data"
    data.forEach(function(item, index){
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const idCell = document.createElement('td');
        const dateCell = document.createElement('td');
        const actionCell = document.createElement('td');

        // Creamos botones para editar y eliminar
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        // Agregamos el contenido de las celdas
        nameCell.textContent = item.name;
        idCell.textContent = item.id;
        dateCell.textContent = item.date;

        // Asignamos clases a los botones
        editButton.textContent = 'Editar';
        editButton.classList.add('button', 'button--secundary','action_button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('button', 'button--terciary','action_button');

        // Evento de escucha para el botón editar
        editButton.addEventListener('click', function(){
            editData(index);
        });

        // Evento de escucha para el botón eliminar
        deleteButton.addEventListener('click', function(){
            deleteData(index);
        });

        // Agregamos los botones a la celda de acciones
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        // Agregamos las celdas a la fila
        row.appendChild(nameCell);
        row.appendChild(idCell);
        row.appendChild(dateCell);
        row.appendChild(actionCell);

        // Agregamos la fila a la tabla
        tablebody.appendChild(row);
    });
}

// Función para editar datos
function editData(index){
    const item = data[index];
    nameinput.value = item.name;
    idinput.value = item.id;

    // Ocultar el botón agregar y mostrar el botón aceptar
    document.getElementById('submitbutton').style.display = 'none';
    document.getElementById('acceptbutton').style.display = 'block';

    // Remover cualquier event listener previamente asociado al botón "Aceptar"
    document.getElementById('acceptbutton').removeEventListener('click', acceptEdit);

    // Agregar un event listener al botón "Aceptar"
    document.getElementById('acceptbutton').addEventListener('click', function(){
        acceptEdit(index);
    });
}

// Función para aceptar la edición
function acceptEdit(index){
    const newName = nameinput.value;
    const newId = idinput.value;

    // Validar que al menos uno de los campos esté lleno
    if(newName || newId){
        // Mantener la fecha original
        const originalDate = data[index].date;

        // Actualizar solo el nombre y el ID si los campos no están vacíos
        if(newName) {
            data[index].name = newName;
        }
        if(newId) {
            data[index].id = newId;
        }

        // Guardar los cambios en el localStorage y renderizar la tabla
        saveDataToLocalStorage();
        renderTable();

        // Restaurar el formulario y cambiar los botones de nuevo
        form.reset();
        document.getElementById('submitbutton').style.display = 'block';
        document.getElementById('acceptbutton').style.display = 'none';
    } else {
        alert('Favor llenar al menos uno de los campos');
    }
}

// Función para eliminar datos
function deleteData(index){
    data.splice(index, 1);
    saveDataToLocalStorage();
    renderTable();
}

// Renderizar la tabla al cargar la página
renderTable();
