import Vue from 'vue'

var newAppVue = new Vue({
	el: "#newapp",
  data: {
  	searchText: "message",
    allTrue: true,
  	todos: [
    	{ id: 1, text: "Learn JavaScript", done: false },
      { id: 2, text: "Learn Vue", done: false },
      { id: 3, text: "Play around in JSFiddle", done: true },
      { id: 4, text: "Build something awesome", done: true }
    ],
    styleObject: {
    	fontSize: "15px",
      color: "red",
    }
  },
  methods:{
  	checkAllTasks: function(){
    	this.todos.forEach((todo, i) => {
      	this.todos[i].done = true;
      });
      this.allTrue = true;
    },
    checkAllTrue: function(){
    	for(var todo in this.todos){
      	if(todo.done === false)
        	return false;
      return true;
      }
    },
    unCheckAllTasks: function(){
    	this.todos.forEach((todo, i) => {
      	this.todos[i].done = false;
      });
      this.allTrue = false;
    },
    addNewProperty: function(){
    	this.todos.forEach((todo, i) => {
      	this.todos[i] = Object.assign({}, this.todos[i], {
        	price: 2 * i
        });
      });
    	this.allTrue = false;
      this.allTrue = true;
			console.log(this.todos);
    }
  }
});