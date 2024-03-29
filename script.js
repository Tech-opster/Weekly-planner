const $form = document.querySelectorAll('.form');
const $inputText = document.querySelectorAll('.task');
const $ulList = document.querySelectorAll('.list');
const $textArea = document.querySelector('textArea');

// LOCAL STORAGE
const setLocalStorage = (dbTask) => localStorage.setItem('db_task', JSON.stringify(dbTask));
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_task')) ?? [];

const setLocalStorageTextArea = () => localStorage.setItem('db_textArea', $textArea.value);
const getLocalStorageTextArea = () => localStorage.getItem('db_textArea') ?? '';

// LER LOCAL STORAGE
const readTask = () => getLocalStorage();
const dbTask = readTask();

// CRIAR LOCAL STORAGE
const createLocalStorage = (value, index, liIndex, checked) => {
    dbTask.push({ value, index, liIndex, checked:false });
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
const createElement = (ulList, value, liIndex, checked) => {
    const liElement = document.createElement('li');
    liElement.classList.add('li');
    liElement.setAttribute('data-index', liIndex);

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.title = 'Concluir';
    checkBox.classList.add('checkBox');

    const formEdit = document.createElement('form');
    formEdit.classList.add('formEdit');

    const divText = document.createElement('div');
    divText.textContent = value;
    divText.classList.add('divText');

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
    formEdit.append(divText);
    formEdit.appendChild(divButtons);
    liElement.append(formEdit);
    ulList.appendChild(liElement);

    if (checked) {
        divText.classList.add('checkedStyle');
        checkBox.checked = true;
    }

    return liElement;
}

// VALORES DE ENTRADA TEXT AREA
$textArea.addEventListener('input', setLocalStorageTextArea);

// CARREGAR DOM
document.addEventListener('DOMContentLoaded', () => {
    $ulList.forEach((ulList, index) => {
        const tasksIndex = dbTask.filter(task => task.index === index);

        tasksIndex.forEach(task => {
            createElement(ulList, task.value, task.liIndex, task.checked);
        });
    });

    $textArea.value = getLocalStorageTextArea();
});

// EVENTO CRIAR ELEMENTOS DINÂMICOS
$form.forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const inputText = $inputText[index];
        const value = inputText.value.trim();
        const ulList = $ulList[index];
        const liIndex = ulList.childNodes.length;

        if (value) {
            createLocalStorage(value, index, liIndex);
            createElement(ulList, value, liIndex);

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

    const notePadAttribute = notePad.getAttribute('data-index');
    const liAttribute = liElement.getAttribute('data-index');

    const checkBox = liElement.querySelector('.checkBox');
    const divText = liElement.querySelector('.divText');

    // EVENTO CHECKBOX
    if (target.classList.contains('checkBox')) {
        if (target.checked) {
            divText.classList.add('checkedStyle');

            dbTask.forEach((task, index) => {
                if (notePadAttribute == task.index && liAttribute == task.liIndex) {
                    task.checked = true;
                    updateTask(task, index);
                }
            });
        } else {
            divText.classList.remove('checkedStyle');

            dbTask.forEach((task, index) => {
                if (notePadAttribute == task.index && liAttribute == task.liIndex) {
                    task.checked = false;
                    updateTask(task, index);
                }
            });
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

        // SUBSTITUIR DIV POR INPUT TEXT 
        if (!editableElement) {
            input.value = divText.textContent;
            formEdit.replaceChild(input, divText);
            checkBox.style.display = 'none';

            target.style.backgroundImage = 'url(Media/done_FILL0_wght400_GRAD0_opsz24.svg)';
            target.title = 'Confirmar';
            target.classList.add('editButtonConfirm');

            setTimeout(() => {
                input.focus();
            }, 1);

            // SUBSTITUIR INPUT TEXT POR DIV
        } else {
            let value = editableElement.value.trim();

            if (value) {
                const divText = document.createElement('div');
                divText.textContent = value;
                divText.classList.add('divText');

                formEdit.replaceChild(divText, editableElement);
                checkBox.checked = false;
                checkBox.style.display = 'block';

                target.style.backgroundImage = 'url(Media/edit_FILL0_wght400_GRAD0_opsz24.svg)';
                target.title = 'Editar';
                target.classList.remove('editButtonConfirm');

                dbTask.forEach((task, index) => {
                    if (notePadAttribute == task.index && liAttribute == task.liIndex) {
                        task.value = value;
                        task.checked = false;
                        updateTask(task, index);
                    }
                });
            }
        }
    };

    // EVENTO BOTÃO DELETAR
    if (target.classList.contains('deleteButton')) {
        event.preventDefault();

        dbTask.forEach((task, index) => {
            if (notePadAttribute == task.index && liAttribute == task.liIndex) {
                if (editableElement) {
                    let deleteConfirm = confirm(`Você deseja excluir a tarefa ${editableElement.value}?`);

                    deleteConfirm && (deleteTask(index), liElement.remove());
                } else {
                    let deleteConfirm = confirm(`Você deseja excluir a tarefa ${divText.innerText}?`);

                    deleteConfirm && (deleteTask(index), liElement.remove());
                }
            }
        });
    };
});