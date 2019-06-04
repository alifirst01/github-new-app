import Vue from 'vue'

Vue.component('todoitem', {
	props: ['task', 'alltrue'],
  template: `<li >
  						<label>
             		<input type="checkbox" 
                	v-bind:checked=task.done
                  v-on:change="$emit('change', $event.target.checked)">									 
                  {{task.text}}
                  - Price: $ {{task.price}}
                	<button v-if="alltrue == false" v-on:click="$emit('checktasks')">Check All Tasks</button>
                <button v-else v-on:click="$emit('unchecktasks')">Uncheck All Tasks</button>
                <button v-on:click="$emit('remove')">Remove Task</button>
              </label>
             </li>`
});