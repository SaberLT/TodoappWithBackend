$(()=>{
    const ELEMENTS_PER_PAGE = 10;

    let sendModel = () => {
        let xhr = new XMLHttpRequest();

        let result = "";

        xhr.onreadystatechange = () => {
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                //finished query
                
            }
        }

        xhr.open('POST', `http://localhost:50670/api/todo/updateModel`);
        xhr.setRequestHeader("Content-type", "application/json");

        let objToSend = {
            todos: model.todos,
            alreadyDone: model.alreadyDone,
            focusedId: model.focusedId
        }
        let str =JSON.stringify(objToSend); 
        xhr.send(str);
    }

    let headerMessageBlock = $("#todosHeaderMessage");
    let todosBlock = $("#todos");
    let alreadyDoneBlock = $("#alreadyDone");
    let newTodoText = $("#newTodoText");
    let todoAddButton = $("#addTodoButton");

    let todosPagination = $("#todosPagination");
    let alreadyDonePagination = $("#alreadyDonePagination");

    let removeEverythingButton = $("#removeEverythingButton");
    let removeTodosButton = $("#removeTodosButton");
    let removeDoneTodosButton = $("#removeDoneTodosButton");

    let doneEverythingButton = $("#doneEverythingButton");
    let unDoneEverythingButton = $("#undoneEverythingButton");

    let saveModel = $("#saveModel");
    let loadModel = $("#loadModel");

    let model = {
        todos: [],
        alreadyDone: [],

        focusedId: {
            todos: 0,
            alreadyDone: 0
        },

        updateTodos : (newTodos) => {
            if(newTodos===null) throw "newTodos are empty!";
            this.todos = newTodos;
            render();
        },

        updateAlreadyDone : (newAlreadyDone) => {
            if(newAlreadyDone===null) throw "newAlreadyDone are empty!";
            this.alreadyDone = newAlreadyDone;
            render();
        },

        updateTodoFocusedId : (newId) => {
            if(newId > this.todos.length-1 ) newId = this.todos.length-1;
            if(newId < 0) newId = 0;

            model.focusedId.todos = newId;

            render();
        },

        updateAlreadyDoneFocusedId : (newId) => {
            if(newId > this.alreadyDone.length-1 ) newId = this.alreadyDone.length-1;
            if(newId < 0) newId = 0;

            model.focusedId.alreadyDone = newId;

            render();
        },
    };

    newTodoText.on('keypress', (e) => {
        if(e.which == 13) {
            let value = newTodoText.val();
            addTodo(value);           
        }
    });

    todoAddButton.click(()=>{
        let todoText = newTodoText.val();
        addTodo(todoText);
    });

    removeEverythingButton.click(()=>{
        model.focusedId = {
            todos: 0,
            alreadyDone: 0
        };
        model.todos = [];
        model.alreadyDone = [];
        render();
    });

    removeTodosButton.click(()=>{
        model.focusedId.todos = 0;
        model.todos = [];

        render();
    });

    removeDoneTodosButton.click(()=>{
        model.focusedId.alreadyDone = 0;
        model.alreadyDone = [];

        render();
    });

    doneEverythingButton.click(()=>{
        let todos = model.todos;
        model.focusedId.todos = 0;
        Array.prototype.push.apply(model.alreadyDone, todos);
        model.todos = [];

        render();
    });

    unDoneEverythingButton.click(()=>{
        let alreadyDone = model.alreadyDone;
        model.focusedId.alreadyDone = 0;
        Array.prototype.push.apply(model.todos, alreadyDone);
        model.alreadyDone = [];

        render();
    });

    loadModel.click(()=>{
        //loading model here
        let xhr = new XMLHttpRequest();

        xhr.open('GET', "http://localhost:50670/api/todo/getModel");

        xhr.send();

        xhr.onload = () => {
            if (xhr.status != 200) { 
                console.log(`Error ${xhr.status}: ${xhr.statusText}`);
            } else { 
                let resp = xhr.response;
                let resModel = JSON.parse(resp);
                console.log(resModel);
                // console.log("resp", resp);
                // console.log("res", res);
                // model = resModel
                // console.log(model);
                // render();
            }
        }

        xhr.onerror = () => {
            console.log('Request failed!')
        }
    });

    saveModel.click(()=>{
        sendModel();
    });

    const addTodo = (todoText) => {
        
        if(todoText!="") {
            newTodoText.val("");
            newTodoText.focus();

            let todos = model.todos;
            
            model.updateTodos(todos.push({
                text: todoText,
                isModifying : false
            }));

            model.updateTodoFocusedId(model.todos.length-1);
        }   
    };

    const render = () => {
        clearEverything();
        updateTopMessage();
        renderTodos();
        renderAlreadyDone();
        renderTodosPagination();
        renderAlreadyDonePagination();
    };

    const clearEverything = () => {
        todosBlock.empty();
        alreadyDoneBlock.empty();
        todosPagination.empty();
        alreadyDonePagination.empty();
    };

    const updateTopMessage = () => {
        let todosCount = model.todos.length;
        let alreadyDoneCount = model.alreadyDone.length;
        headerMessageBlock.text(`Here are all your todos.
            (${todosCount} to go,
            ${alreadyDoneCount} done,
            ${todosCount + alreadyDoneCount} total).`);
    };

    const renderTodos = () => {
        const todos = model.todos;

        let min = Math.floor(model.focusedId.todos / ELEMENTS_PER_PAGE) * ELEMENTS_PER_PAGE;
        let max = min + ELEMENTS_PER_PAGE;

        todos.forEach((item, id) => {
            if(id<min||id>max) return;

            todosBlock.append(createTodoItemHTML(item, id));

            let changeStateToStandard = () => {
                let todos = model.todos;
                todos[id].isModifying = false;
                model.updateTodos(todos);
            };
            
            if(!item.isModifying)
                $(`#todoItemBlock${id}`).click(()=>{
                    let todos = model.todos;
                    todos[id].isModifying = true;
                    todos[id].text = todoInput.val();
                    model.updateTodos(todos);
                    
                    todoInput.focus();
                });

            let todoInput = $(`#todoItemInput${id}`);

            if(item.isModifying) {
                let event = (e)=>{
                    let value = todoInput.val();
                    if(e.which == 13) {
                        let todos = model.todos;
                        todos[id].isModifying = false;
                        todos[id].text = value;
                        model.updateTodos(todos);

                        changeStateToStandard();
                    }
                };
                todoInput.on('keypress', event);
            }

            $(`#todoItemOKButton${id}`).click(() => {
                changeStateToStandard();
            });

            $(`#todoItemModifyButton${id}`).click(() => {
                let todos = model.todos;
                todos[id].isModifying = true;
                todos[id].text = todoInput.val();
                model.updateTodos(todos);
                
                todoInput.focus();
            });
            
            $(`#todoItemRemoveButton${id}`).click(() => {
                let todos = model.todos;
                todos.splice(id, 1);
                model.updateTodos(todos);

                model.updateTodoFocusedId(id);
            });

            $(`#todoItemDoneButton${id}`).click(() => {
                let todos = model.todos;
                let alreadyDone = model.alreadyDone;
                alreadyDone.push(todos[id]);
                todos.splice(id, 1);
                model.updateTodos(todos);
                model.updateAlreadyDone(alreadyDone);
                model.updateTodoFocusedId(model.todos.length-1);
                model.updateAlreadyDoneFocusedId(model.alreadyDone.length-1);
            });

            
        });
    };
    
    const renderAlreadyDone = () => {
        const alreadyDone = model.alreadyDone;

        let min = Math.floor(model.focusedId.alreadyDone / ELEMENTS_PER_PAGE) * ELEMENTS_PER_PAGE;
        let max = min + ELEMENTS_PER_PAGE;

        alreadyDone.forEach((item, id) => {
            if(id<min||id>max) return;

            alreadyDoneBlock.append(createAlreadyDoneTodoItemHTML(item, id));

            let changeStateToStandard = () => {
                let alreadyDone = model.alreadyDone;
                alreadyDone[id].isModifying = false;
                model.updateAlreadyDone(alreadyDone);
            };
            
            let todoInput = $(`#doneTodoItemInput${id}`);

            if(item.isModifying) {
                todoInput.on('keypress', (e)=>{
                    let value = todoInput.val();
                    if(e.which == 13) {
                        let alreadyDone = model.alreadyDone;
                        alreadyDone[id].isModifying = false;
                        alreadyDone[id].text = value;
                        model.updateAlreadyDone(alreadyDone);

                        changeStateToStandard();
                    }
                });
            }
                
            if(!item.isModifying)
                $(`#doneTodoItemBlock${id}`).click(()=>{
                    let alreadyDone = model.alreadyDone;
                    alreadyDone[id].isModifying = true;
                    alreadyDone[id].text = todoInput.val();
                    model.updateAlreadyDone(alreadyDone);
                    
                    todoInput.focus();
                });

            $(`#doneTodoItemOKButton${id}`).click(() => {
                changeStateToStandard();
            });

            $(`#doneTodoItemModifyButton${id}`).click(() => {
                let alreadyDone = model.alreadyDone;
                alreadyDone[id].isModifying = true;
                alreadyDone[id].text = todoInput.val();
                model.updateAlreadyDone(alreadyDone);
                
                todoInput.focus();
            });
            
            $(`#doneTodoItemRemoveButton${id}`).click(() => {
                let alreadyDone = model.alreadyDone;
                alreadyDone.splice(id, 1);
                model.updateTodos(alreadyDone);

                model.updateAlreadyDoneFocusedId(id);
            });

            $(`#doneTodoItemUndoneButton${id}`).click(() => {
                let todos = model.todos;
                let alreadyDone = model.alreadyDone;
                todos.push(alreadyDone[id]);
                alreadyDone.splice(id, 1);
                model.updateTodos(todos);
                model.updateAlreadyDone(alreadyDone);
                model.updateTodoFocusedId(model.todos.length-1);
                model.updateAlreadyDoneFocusedId(model.alreadyDone.length-1);
            });
        });
    };

    const renderTodosPagination = () => {
        if(model.todos.length <= ELEMENTS_PER_PAGE) return;

        let currentPage = Math.floor(model.focusedId.todos / ELEMENTS_PER_PAGE); 
        let totalPages = Math.floor(model.todos.length / ELEMENTS_PER_PAGE) + (model.todos.length % ELEMENTS_PER_PAGE === 0 ? 0 : 1);
        
        for(let i = 0; i < totalPages; ++i) {
            let buttonHTML = `<button 
                class="btn btn-square btn-context ${i===currentPage ? "btn-outline-success" : "btn-outline-info"}" 
                id="todoPaginationButton${i}">${i+1}</button>`;

            todosPagination.append(buttonHTML);

            let currentButton = $(`#todoPaginationButton${i}`);
            currentButton.click(() => {
                model.updateTodoFocusedId(i*ELEMENTS_PER_PAGE);
            })
        }
    };

    const renderAlreadyDonePagination = () => {
        if(model.alreadyDone.length <= ELEMENTS_PER_PAGE) return;

        let currentPage = Math.floor(model.focusedId.alreadyDone / ELEMENTS_PER_PAGE); 
        let totalPages = Math.floor(model.alreadyDone.length / ELEMENTS_PER_PAGE) + (model.alreadyDone.length % ELEMENTS_PER_PAGE === 0 ? 0 : 1);
        
        for(let i = 0; i < totalPages; ++i) {
            let buttonHTML = `<button 
                class="btn btn-square btn-context ${i===currentPage ? "btn-outline-success" : "btn-outline-info"}" 
                id="doneTodoPaginationButton${i}">${i+1}</button>`;
                
            alreadyDonePagination.append(buttonHTML);

            let currentButton = $(`#doneTodoPaginationButton${i}`);
            currentButton.click(() => {
                console.log(i);
                model.updateAlreadyDoneFocusedId(i*ELEMENTS_PER_PAGE);
            });
        }
    };

    const createTodoItemHTML = (todoItem, itemId) => {
        if(todoItem.isModifying) {
            return `
            <div class="row" id="todoItemBlock${itemId}">
                <div class="col">
                    <div class="border border-info">
                        <div class="input-group">
                            <div class="input-group flex-fill">
                                <input class="form-control input-modifying" id="todoItemInput${itemId}" value="${todoItem.text}"/>
                                <div class="input-group-append d-block d-sm-none d-md-none">
                                    <button class="btn btn-success btn-square btn-context" id="todoItemOKButton${itemId}">&#10003;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        } else {
            return `
            <div class="row" id="todoItemBlock${itemId}">
                <div class="col">
                    <div class="border border-info todo-item">
                        <div class="input-group">
                            <div class="input-group flex-fill">
                                <input class="form-control input-modifying" id="todoItemInput${itemId}" disabled value="${todoItem.text}"/>
                                <div class="input-group-append">
                                    <button class="btn btn-info btn-square btn-context" id="todoItemModifyButton${itemId}">&#128393;</button>
                                    <button class="btn btn-danger btn-square btn-context" id="todoItemRemoveButton${itemId}">&#9932;</button>
                                    <button class="btn btn-info btn-square btn-context" id="todoItemDoneButton${itemId}">&#8594;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }
    };

    const createAlreadyDoneTodoItemHTML = (todoItem, itemId) => {
        if(todoItem.isModifying) {
            return `
            <div class="row" id="doneTodoItemBlock${itemId}">
                <div class="col">
                    <div class="border border-info">
                        <div class="input-group">
                            <div class="input-group flex-fill">
                                <button class="btn btn-info btn-square btn-context" id="doneTodoItemUndoneButton${itemId}">&#8592;</button>
                                <input class="form-control" id="doneTodoItemInput${itemId}" value="${todoItem.text}"/>
                                <div class="input-group-append d-block d-sm-none d-md-none">
                                    <button class="btn btn-success btn-square btn-context" id="doneTodoItemOKButton${itemId}">&#10003;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        } else {
            return `
            <div class="row" id="doneTodoItemBlock${itemId}">
                <div class="col">
                    <div class="border border-info todo-item">
                        <div class="input-group">
                            <div class="input-group flex-fill">
                                <button class="btn btn-info btn-square btn-context" id="doneTodoItemUndoneButton${itemId}">&#8592;</button>
                                <input class="form-control input-modifying" id="doneTodoItemInput${itemId}" disabled value="${todoItem.text}"/>
                                <div class="input-group-append">
                                    <button class="btn btn-info btn-square btn-context" id="doneTodoItemModifyButton${itemId}">&#128393;</button>
                                    <button class="btn btn-danger btn-square btn-context" id="doneTodoItemRemoveButton${itemId}">&#9932;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }
    };
});