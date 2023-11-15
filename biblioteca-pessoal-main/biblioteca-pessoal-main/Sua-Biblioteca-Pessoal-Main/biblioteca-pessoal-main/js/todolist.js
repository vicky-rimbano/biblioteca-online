;(function(){
    'use strict'

    //armazenar dados no DOM

    const itemInput = document.getElementById("item-input")
    const todoAddForm = document.getElementById("todo-add")
    const ul = document.getElementById("todo-list")
    const lis = ul.getElementsByTagName("li")
    
    //estrututa de dados, é uma array que contem um objeto, e vai acrescentando novos objetos
    let arrTasks = getSavedData()


    function getSavedData(){
        let livrosData = localStorage.getItem("livros")
        livrosData = JSON.parse(livrosData)

        return livrosData && livrosData.length ? livrosData : [{
                                                    name: "livro 01", 
                                                    createAt: Date.now(), 
                                                    completed: false
                                                }]
        // return [{
        //     name: "livro 01", 
        //     createAt: Date.now(), 
        //     completed: false
        // }]
    }

    function setNewData(){
        localStorage.setItem("livros", JSON.stringify(arrTasks))
    }

    setNewData()
    //funcao gera novas linhas a partir de um objeto
    function generateLiTask(obj){
        const li = document.createElement("li")
        const p = document.createElement("p")
        const checkButton = document.createElement("button")
        const editButton = document.createElement("i")
        const deleteButton = document.createElement("i")


        
        
        li.className = "todo-item"
        
        checkButton.className = "button-check"
        checkButton.innerHTML = `<i class="fas fa-check ${obj.completed ? "": "displayNone"}" data-action="checkButton"></i>`
        checkButton.setAttribute("data-action", "checkButton")

        li.appendChild(checkButton)


        p.className = "task-name"
        p.textContent = obj.name
        li.appendChild(p)

        editButton.className = "fas fa-edit"
        editButton.setAttribute("data-action", "editButton")
        li.appendChild(editButton)

        deleteButton.className = "fas fa-trash-alt"
        deleteButton.setAttribute("data-action", "deleteButton")
        li.appendChild(deleteButton)


        //container de edicao de um livro
        const containerEdit = document.createElement("div")
        containerEdit.className = "editContainer"
        

        //input dentro do container
        const inputEdit = document.createElement("input")
        inputEdit.setAttribute("type", "text")
        inputEdit.className = "editInput"
        inputEdit.value = obj.name
        containerEdit.appendChild(inputEdit)
        
        //botoes com acoes dentro do container edit
        const containerEditButton = document.createElement("button")
        containerEditButton.className = "editButton"
        containerEditButton.textContent = "Salvar"
        containerEditButton.setAttribute("data-action", "containerEditButton")
        containerEdit.appendChild(containerEditButton)

        const containerCancelButton = document.createElement("button")
        containerCancelButton.className = "cancelButton"
        containerCancelButton.textContent = "Cancelar"
        containerCancelButton.setAttribute("data-action", "containerCancelButton")
        containerEdit.appendChild(containerCancelButton)

        li.appendChild(containerEdit)




        // addEventLi(li)

        return li
    }

    //funcao de construcao das linhas, primeiro ela limpa a lista e escreve as novas linhas
    //ela percorre com um for todos os objetos da array
    function renderTasks(){
        ul.innerHTML = ""
        arrTasks.forEach(taskObj => {
            ul.appendChild(generateLiTask(taskObj))
        });  
    }



    //funcao insere novas linhas na lista
    function addTask(task){
        arrTasks.push({
            name: task,
            createAt: Date.now(),
            completed: false
        });
        setNewData()
    }

    //indentificando qual botao foi clicado e executando sua respectiva funcao
    function clickedUl(e){
        //console.log(e.target.getAttribute("data-action"))
        const dataAction = e.target.getAttribute("data-action")
        //se não existe uma acao definida retorna
        if(!dataAction) return

        //capturando a li clicada
        let currentLi = e.target
        while(currentLi.nodeName !== 'LI'){
            currentLi = currentLi.parentElement
        }

        //capturando o indice
        const currentLiIndex = [...lis].indexOf(currentLi)
        

        //objeto com as funcoes por nome do atributo
        const actions = {
            editButton: function(){
                // pega o container da linha clicada
                const editContainer = currentLi.querySelector(".editContainer");

                //antes de abrir o container, desabilita os demais containers para nao termos varios edtis abertos
                [...ul.querySelectorAll(".editContainer")].forEach(container => {
                    container.removeAttribute("style")
                });

                //altera o display none para flex para mostrar o container
                editContainer.style.display = "flex";

              


            },
            deleteButton: function(){
                //apaga o objeto pelo indice atual
                arrTasks.splice(currentLiIndex, 1)
                renderTasks()
                setNewData()
                //currentLi.remove()
            },

            containerEditButton: function(){
                //pega os valores do input edit e salva na lista de objetos
                const val = currentLi.querySelector(".editInput").value
                arrTasks[currentLiIndex].name = val
                renderTasks()
                setNewData()
            },

            containerCancelButton:function(){
                //fecha o container sem fazer alteracoes nos dados
                currentLi.querySelector(".editContainer").removeAttribute("style")
                currentLi.querySelector(".editInput").value = arrTasks[currentLiIndex].name
            },

            checkButton: function(){
                arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed

                if (arrTasks[currentLiIndex].completed){
                    currentLi.querySelector(".fa-check").classList.remove("displayNone")
                }else{
                    currentLi.querySelector(".fa-check").classList.add("displayNone")
                }
                renderTasks()
                setNewData()
            }
        }

        if (actions[dataAction]){
            actions[dataAction]()
        }

    }


    //adiciona eventos a cada linha adcionada
    todoAddForm.addEventListener("submit", function(e){
        e.preventDefault()
        console.log(itemInput.value)
        addTask(itemInput.value)
        renderTasks()
        itemInput.value = ""
        itemInput.focus()
        });


    ul.addEventListener("click", clickedUl)



    renderTasks()

})()



//baseado nas aulas de Daniel Tapias Morales