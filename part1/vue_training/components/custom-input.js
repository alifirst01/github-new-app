import Vue from 'vue'

Vue.component('custom-input', {
	props: ['value'],
  data: function(){
  	return{
    	inputText: "abc"
    }
  },
  template: `<input type="text" 
               	v-bind:value="value"
               	v-on:input="$emit('input', $event.target.value)">`,
});