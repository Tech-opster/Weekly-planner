const $form = document.querySelectorAll('.form');
const $inputText = document.querySelectorAll('.task');
const $ulList = document.querySelectorAll('.list');

$form.forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

 //CREATE

        const inputText = $inputText[index];
        const ulList = $ulList[index];

        if (inputText.value !== '') {
            const liElement = document.createElement('li');
            liElement.classList.add('li');

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

            liElement.appendChild(checkBox);
            liElement.append(inputText.value);
            divButtons.appendChild(editButton);
            divButtons.appendChild(deleteButton);
            liElement.append(divButtons)
            ulList.appendChild(liElement);

            inputText.value = '';
        }

//READ

        document.querySelectorAll('.list').forEach((list) => {
            list.addEventListener('click', (event) => {
                if (event.target.matches('.checkBox')) {
                    
                    const liElement = event.target.parentElement;

                    if (event.target.checked) {
                        liElement.style.textDecoration = 'line-through';
                        liElement.style.textDecorationColor = '#1d1d1d';
                        liElement.style.color = '#828282';
                    } else {
                        liElement.style.textDecoration = 'none';
                        liElement.style.color = '#1d1d1d';
                    }
                }
            });
        });

//UPDATE

//DELETE


    });
});