// VARIÁVEIS GLOBAIS HTML
const $form = document.querySelectorAll('.form');
const $inputText = document.querySelectorAll('.task');
const $ulList = document.querySelectorAll('.list');

// LOCAL STORAGE
const setLocalStorage = (dbTask) => localStorage.setItem('db_task', JSON.stringify(dbTask));
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_task')) ?? [];

// LER LOCAL STORAGE
const readTask = () => getLocalStorage();
const dbTask = readTask();

// CRIAR LOCAL STORAGE
const createLocalStorage = (trimmedValue, index, liIndex) => {
    dbTask.push({ value: trimmedValue, index, liIndex });
    setLocalStorage(dbTask);
};

// MODIFICAR LOCAL STORAGE
const updateTask = (task, index) => {
    dbTask[index] = task;
    setLocalStorage(dbTask);
};

// DELETAR LOCAL STORAGE
const deleteTask = (index) => {
    dbTask.splice(index, 1);
    setLocalStorage(dbTask);
};

// ELEMENTOS DINÂMICOS
const createElement = (ulList, trimmedValue, liIndex) => {
    const liElement = document.createElement('li');
    liElement.classList.add('li');
    liElement.setAttribute('data-index', liIndex);

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.title = 'Concluir';
    checkBox.classList.add('checkBox');

    const formEdit = document.createElement('form');
    formEdit.classList.add('formEdit');

    const spanText = document.createElement('span');
    spanText.textContent = trimmedValue;
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
    $ulList.forEach((ulList, index) => {
        const tasksIndex = dbTask.filter(task => task.index === index);

        tasksIndex.forEach(task => {
            createElement(ulList, task.value, task.liIndex);
        });
    });
});

// EVENTO CRIAR ELEMENTOS DINÂMICOS
$form.forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const inputText = $inputText[index];
        const trimmedValue = inputText.value.trim();
        const ulList = $ulList[index];
        const liIndex = ulList.childNodes.length;

        if (trimmedValue) {
            createLocalStorage(trimmedValue, index, liIndex);
            createElement(ulList, trimmedValue, liIndex);

            inputText.value = '';
        }
    });
});

// EVENTOS MODIFICAR ELEMENTOS DINÂMICOS
document.addEventListener('click', (event) => {
    const target = event.target;
    const notePad = target.closest('.notePad');
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
        event.preventDefault();

        const notePadAttribute = notePad.getAttribute('data-index');
        const liAttribute = liElement.getAttribute('data-index');

        dbTask.forEach((task, index) => {
            console.log(task.index, task.liIndex);
            if (notePadAttribute == task.index && liAttribute == task.liIndex) {
                if (editableElement) {
                    let deleteConfirm = confirm(`Você deseja excluir a tarefa ${editableElement.value}?`);

                    deleteConfirm && (deleteTask(index), liElement.remove());
                } else {
                    let deleteConfirm = confirm(`Você deseja excluir a tarefa ${spanText.innerText}?`);

                    deleteConfirm && (deleteTask(index), liElement.remove());
                }
            }
        }) 
        console.log(notePadAttribute, liAttribute);
    }
});