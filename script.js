document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const body = document.body;

    // Set initial theme from localStorage if available
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeIcon.src = './images/icon-sun.svg';
        } else {
            body.removeAttribute('data-theme');
            themeIcon.src = './images/icon-moon.svg';
        }
        localStorage.setItem('theme', theme);
    }

    // Todo app logic
    const todoInput = document.querySelector('.todo-input');
    const todoList = document.querySelector('.todo-list');
    const itemsLeft = document.querySelector('.items-left');
    const clearCompletedBtn = document.querySelector('.clear-completed');
    const filterButtons = document.querySelectorAll('.filter');

    let todos = [];

    function updateItemsLeft() {
        const activeCount = todos.filter(todo => !todo.completed).length;
        itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    }

    function renderTodos() {
        todoList.innerHTML = '';

        const activeFilter = document.querySelector('.filter.active').dataset.filter;

        todos
            .filter(todo => {
                if (activeFilter === 'active') return !todo.completed;
                if (activeFilter === 'completed') return todo.completed;
                return true;
            })
            .forEach((todo, index) => {
                const li = document.createElement('li');
                li.classList.add('todo-item');
                if (todo.completed) li.classList.add('completed');

                const checkbox = document.createElement('span');
                checkbox.classList.add('checkbox');
                if (todo.completed) checkbox.classList.add('checked');

                checkbox.addEventListener('click', () => {
                    todos[index].completed = !todos[index].completed;
                    renderTodos();
                    updateItemsLeft();
                });

                const text = document.createElement('span');
                text.classList.add('todo-text');
                text.textContent = todo.text;

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-btn');
                deleteBtn.innerHTML = `<img src="./images/icon-cross.svg" alt="Delete">`;

                deleteBtn.addEventListener('click', () => {
                    todos.splice(index, 1);
                    renderTodos();
                    updateItemsLeft();
                });

                li.appendChild(checkbox);
                li.appendChild(text);
                li.appendChild(deleteBtn);
                todoList.appendChild(li);
            });

        updateItemsLeft();
    }

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && todoInput.value.trim() !== '') {
            todos.push({
                text: todoInput.value.trim(),
                completed: false
            });
            todoInput.value = '';
            renderTodos();
            updateItemsLeft();
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        renderTodos();
        updateItemsLeft();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.filter.active').classList.remove('active');
            button.classList.add('active');
            renderTodos();
        });
    });

    // Initial render
    renderTodos();
});
