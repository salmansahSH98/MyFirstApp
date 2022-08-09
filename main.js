
    // On app load, get all tasks from localStorage
    window.onload = loadTasks;
    // On form submit add task
    document.querySelector("form").addEventListener("submit", e => {
      e.preventDefault();
      addTask();
    });
    // let pointer = document.getElementById("input");
    //   pointer.focus();

    function loadTasks() {
       
      // check if localStorage has any tasks
      // if not then return
      if (localStorage.getItem("tasks") == null) return;
      
      // Get the tasks from localStorage and convert it to an array
      let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
      
      // Loop through the tasks and add them to the list
      tasks.forEach(task => {
        const list = document.querySelector("ul");
        const li = document.createElement("li");
        li.innerHTML = `
          <input type="text" value="${task.task}" 
          class="task ${task.completed ? 'completed' : ''}" readonly="readonly">
          <button class="done" onclick="taskComplete(this)" 
          ${task.completed ? 'checked' : ''}>Done</button>
          <button class="edit" onclick="getCurrentTask(this)">edit</button>
          <button class="delate" onclick="removeTask(this)">Delate</button>
          `;
        list.insertBefore(li, list.children[0]);
      });
    }

    function addTask() {
      const task = document.querySelector("form input");
      const list = document.querySelector("ul");
      // return if task is empty
      if (task.value === "") {
        alert("Please add some task!");
        return false;
      }
      // check is task already exist
      if (document.querySelector(`input[value="${task.value}"]`)) {
        alert("Task already exist!");
        return false;
      }

      // add task to local storage
      localStorage.setItem(
        "tasks", JSON.stringify
        ([...JSON.parse(localStorage.getItem("tasks") || "[]"), 
        { task: task.value, completed: false }]));

      // create list item, add innerHTML and append to ul
      const li = document.createElement("li");
      li.innerHTML = `
      <input type="text" value="${task.value}" class="task" readonly="readonly">
      <button class="done" onclick="taskComplete(this)">Done</button>
      <button class="edit" onclick="getCurrentTask(this)">edit</button>
      <button class="delate" onclick="removeTask(this)">Delate</button>
      `;
      list.insertBefore(li, list.children[0]);
      // clear input
      task.value = "";
    }

    //checked function
    function taskComplete(event) {
      let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
      tasks.forEach(task => {
        //console.log(task.task);
        if (task.task === event.previousElementSibling.value) {
          task.completed = !task.completed;
        }
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      event.previousElementSibling.classList.toggle("completed");
    }

    //delate function
    function removeTask(event) {
      let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
      tasks.forEach(task => {
        if (task.task === event.parentNode.children[0].value) {
          // delete task 
          tasks.splice(tasks.indexOf(task), 1);
        }
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      event.parentElement.remove();
    }

    // store current task to track changes
    var currentTask = null;

    // get current task
    function getCurrentTask(event) {
        let value1=event.parentNode.children[0];
     
      console.log(value1.value);
      console.log(currentTask);
      //////////////
      if (event.innerText.toLowerCase() == "edit") {
        currentTask = value1.value;
        event.innerText = "Save";
        event.style.color="rgb(204, 201, 17)";
        value1.removeAttribute("readonly");
        value1.focus();        
    } else {
        event.innerText = "Edit";
        value1.setAttribute("readonly", "readonly");
        
        editTask(value1);
        event.style.color="green";
    }
   
}

    // edit the task and update local storage
    function editTask(event) {
      let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
      // check if task is empty
      if (event.value === "") {
        alert("Task is empty!");
        event.value = currentTask;
        return;
      }
      // task already exist
      tasks.forEach(task => {
        if (task.task === event.value) {
          alert("Task already exist!");
          event.value = currentTask;
          return;
        }
      });
      // update task
      tasks.forEach(task => {
        if (task.task === currentTask) {
          task.task = event.value;
        }
      });
      
      event.classList.remove("completed");
      //console.log(tasks.task);
      // update local storage
      localStorage.setItem("tasks", JSON.stringify(tasks));
      
    }

    //clear all tasks or elements
    let clearTask=document.getElementById("clear");
    clearTask.addEventListener("click", function(){
      localStorage.clear();
      location.reload();
    })