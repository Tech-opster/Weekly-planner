const $form = document.querySelectorAll('.form');
const $inputText = document.querySelectorAll('.task');
const $ulList = document.querySelectorAll('.list');

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_task')) ?? [];
const setLocalStorage = (dbTask) => localStorage.setItem('db_task', JSON.stringify(dbTask));

const createLocalStorage = (task) => {
    const dbTask = getLocalStorage();
    dbTask.push(task);
    setLocalStorage(dbTask);
}

const readTask = () => getLocalStorage();

const updateTask = (index, task) => {
    const dbTask = readTask();
        dbTask[index] = task;
        setLocalStorage(dbTask);
}

const deleteTask = (index) => {
    const dbTask = readTask();
        dbTask.splice(index, 1);
        setLocalStorage(dbTask);
}

$form.forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const inputText = $inputText[index];
        const ulList = $ulList[index];

        const trimmedValue = inputText.value.trim(); 

        const createRow = () => {
            const dbTask = readTask();
            const lastTask = dbTask[dbTask.length - 1];

            const liElement = document.createElement('li');
            liElement.setAttribute('data-storage', readTask().length - 1);
            liElement.classList.add('li');

            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.title = 'Concluir';
            checkBox.classList.add('checkBox');

            const formEdit = document.createElement('form');
            formEdit.classList.add('formEdit');

            const spanText = document.createElement('span');
            spanText.textContent = lastTask;
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
        };

        if (trimmedValue !== '') {
            createLocalStorage(trimmedValue);
            createRow();

            inputText.value = '';
        }
    });
});

document.addEventListener('click', (event) => {
    const target = event.target;
    const liElement = target.closest('.li');
    const formEdit = target.closest('.formEdit');
    
    if (!liElement) {
        return;
    }

    const checkBox = liElement.querySelector('.checkBox');
    const spanText = liElement.querySelector('.spanText');

    if (target.classList.contains('checkBox')) {
        if (target.checked) {
            spanText.style.textDecoration = 'line-through';
            spanText.style.textDecorationColor = '#1d1d1d';
            spanText.style.color = '#828282';
        } else {
            spanText.style.textDecoration = 'none';
            spanText.style.color = '#1d1d1d';
        }
    }

    if (target.classList.contains('editButton')) {
        event.preventDefault();

        const input = document.createElement('input');
        input.type = 'text';
        input.title = 'Reescrever tarefa';
        input.classList.add('task');
        input.setAttribute('data-editable', 'true');

        const editableElement = formEdit.querySelector('[data-editable="true"]');

        if (!editableElement) {
            input.value = spanText.textContent;
            formEdit.replaceChild(input, spanText);
            checkBox.style.display = 'none';

            target.style.backgroundImage = 'url(Media/done_FILL0_wght400_GRAD0_opsz24.svg)';
            target.title = 'Confirmar';
            target.classList.add('editButtonConfirm');
        } else {
            const spanText = document.createElement('span');
            spanText.textContent = editableElement.value;
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

    if (target.classList.contains('deleteButton')) {
        const editableElement = formEdit.querySelector('[data-editable="true"]');

        if (editableElement) {
            let deleteConfirm = confirm(`Você deseja excluir a tarefa ${editableElement.value}?`);

            if (deleteConfirm) {
                liElement.remove();
        
                deleteTask();
            }
        } else {
            let deleteConfirm = confirm(`Você deseja excluir a tarefa ${spanText.innerText}?`);

            if (deleteConfirm) {
                liElement.remove();
        
                deleteTask();
            }
        }
    }
});