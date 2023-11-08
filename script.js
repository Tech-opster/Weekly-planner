const $form = document.querySelectorAll('.form');
const $inputText = document.querySelectorAll('.task');
const $ulList = document.querySelectorAll('.list');

$form.forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const inputText = $inputText[index];
        const ulList = $ulList[index];

        if (inputText.value !== '') {
        const liElements = document.createElement('li');
        liElements.classList.add('li');

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.title = 'Concluído';
        checkBox.classList.add('checkBox');

        const divButtons = document.createElement('div');
        divButtons.classList.add('divButtons');

        const editButton = document.createElement('button');
        editButton.title = 'Editar';
        editButton.classList.add('editButton');

        const deleteButton = document.createElement('button');
        deleteButton.title = 'Excluir'; 
        deleteButton.classList.add('deleteButton');

        liElements.appendChild(checkBox);
        liElements.append(inputText.value);
        divButtons.appendChild(editButton);
        divButtons.appendChild(deleteButton);
        liElements.append(divButtons)
        
        ulList.appendChild(liElements);
        inputText.value = '';
        }
    });
});