const $form = document.querySelectorAll('.form');
const $inputText = document.querySelectorAll('.task');
const $ulList = document.querySelectorAll('.list');

// LOCAL STORAGE
const setLocalStorage = (dbTask) => localStorage.setItem('db_task', JSON.stringify(dbTask));
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_task')) ?? [];

// CRIAR LOCAL STORAGE
const createLocalStorage = (task, index) => {
    const dbTask = getLocalStorage();
    dbTask.push({ value: task, index });
    setLocalStorage(dbTask);
};

// LER LOCAL STORAGE
const readTask = () => getLocalStorage();

// MODIFICAR LOCAL STORAGE
const updateTask = (task, index) => {
    const dbTask = readTask();
    dbTask[index] = task;
    setLocalStorage(dbTask);
};

// DELETAR LOCAL STORAGE
const deleteTask = (index) => {
    const dbTask = readTask();
    dbTask.splice(index, 1);
    setLocalStorage(dbTask);
};

// ELEMENTOS DINÂMICOS
const createElement = (ulList, task) => {
    const liElement = document.createElement('li');
    liElement.classList.add('li');

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.title = 'Concluir';
    checkBox.classList.add('checkBox');

    const formEdit = document.createElement('form');
    formEdit.classList.add('formEdit');

    const spanText = document.createElement('span');
    spanText.textContent = task;
    spanText.classList.add('spanText');

    const divButtons = document.createElement('div');
    divButtons.classList.add('divButtons');

    const editButton = document.createElement('button');
    editButton.type = 'submit';
    editButton.title = 'Editar';
    editButton.classList.add('editButton');

    const deleteButton = document.createElement('button');
    deleteButton.title = 'Excluir';
    deleteButton.classList.add('deleteButton');

    liElement.appendChild(checkBox);
    divButtons.appendChild(editButton);
    divButtons.appendChild(deleteButton);
    formEdit.append(spanText);
    formEdit.appendChild(divButtons);
    liElement.append(formEdit);
    ulList.appendChild(liElement);

    return liElement;
}

// CARREGAR DOM
document.addEventListener('DOMContentLoaded', () => {
    const dbTask = readTask();

    $ulList.forEach((ulList, index) => {
        const tasksForList = dbTask.filter(task => task.index === index);
        tasksForList.forEach(task => {
            createElement(ulList, task.value);
        });
    });
});

// EVENTO CRIAR ELEMENTOS DINÂMICOS
$form.forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const inputText = $inputText[index];
        const ulList = $ulList[index];
        const trimmedValue = inputText.value.trim();
        
        if (trimmedValue) {
            createLocalStorage(trimmedValue, index);
            createElement(ulList, trimmedValue);

            inputText.value = '';
        }
    });
});

// EVENTOS MODIFICAR ELEMENTOS DINÂMICOS
document.addEventListener('click', (event) => {
    const target = event.target;
    const liElement = target.closest('.li');
    const formEdit = target.closest('.formEdit');

    if (formEdit) var editableElement = formEdit.querySelector('[data-editable="true"]');

    if (!liElement) return;

    const checkBox = liElement.querySelector('.checkBox');
    const spanText = liElement.querySelector('.spanText');
    
// EVENTO CHECKBOX
    if (target.classList.contains('checkBox')) {
        if (target.checked) {
            spanText.classList.add('checkedStyle');
        } else {
            spanText.classList.remove('checkedStyle');
        }
    }

// EVENTO BOTÃO EDITAR
    if (target.classList.contains('editButton')) {
        event.preventDefault();

        // CRIAR INPUT TEXT
        const input = document.createElement('input');
        input.type = 'text';
        input.title = 'Reescrever tarefa';
        input.classList.add('task');
        input.setAttribute('data-editable', 'true');

        // SUBSTITUIR SPAN POR INPUT TEXT 
        if (!editableElement) {
            input.value = spanText.textContent;
            formEdit.replaceChild(input, spanText);
            checkBox.style.display = 'none';

            target.style.backgroundImage = 'url(Media/done_FILL0_wght400_GRAD0_opsz24.svg)';
            target.title = 'Confirmar';
            target.classList.add('editButtonConfirm');
            
        // SUBSTITUIR INPUT TEXT POR SPAN
        } else {
            let trimmedValue = editableElement.value.trim();

            if (trimmedValue) {
                const spanText = document.createElement('span');
                spanText.textContent = trimmedValue;
                spanText.classList.add('spanText');

                formEdit.replaceChild(spanText, editableElement);
                checkBox.checked = false;
                checkBox.style.display = 'block';

                target.style.backgroundImage = 'url(Media/edit_FILL0_wght400_GRAD0_opsz24.svg)';
                target.title = 'Editar';
                target.classList.remove('editButtonConfirm');

                updateTask();
            }
        }
    }

// EVENTO BOTÃO DELETAR
    if (target.classList.contains('deleteButton')) {
        if (editableElement) {
            let deleteConfirm = confirm(`Você deseja excluir a tarefa ${editableElement.value}?`);

            deleteConfirm && (liElement.remove(), deleteTask());
        } else {
            let deleteConfirm = confirm(`Você deseja excluir a tarefa ${spanText.innerText}?`);

            deleteConfirm && (liElement.remove(), deleteTask());
        }
    }
});