import Vue from 'vue'

Vue.component('custom-form', {
	data: function(){
  	return{
    	email: '',
      password: '',
      gender: '',
      countrySelected: '',
    	countries: [{'code': 1, "name": 'A'}, 
      						{'code': 2, "name": 'B'}, 
                  {'code': 3, "name": 'D'}, 
                  {'code': 4, "name": 'D'}, 
                  {'code': 5, "name": 'E'}],
      checkedNames: [],
      licenseAgreement: 'This is our agreement',
      pick: '',   
    }
  },
  template:	`<form action="">
              <p>
                <label for="email">Email</label>
                <input id="email" type="text" v-model.lazy="email" placeholder="Enter your email">
                <br>
                <span>email {{email}}</span>
              </p>
              <p>
                <label for="pass">Password</label>
                <input id="pass" type="password" v-model="password" placeholder="Enter password">
                <br>
                <span>password {{password}}</span>
              </p>
              <p>
                <label for="age">Age</label>
                <input id="age" type="number" v-model="age" placeholder="Enter your age">
                <br>
                <span>email {{email}}</span>
              </p>
              <p>
                <label for=""><strong>Gender:</strong></label>
                <input type="radio" id="male" value="M" v-model="gender">
                <label for="male">Male</label>
                <input type="radio" id="female" value="F" v-model="gender">
                <label for="female">Female</label>
                <input type="radio" id="na" value="Not Mentioned" v-model="gender">
                <label for="na">Not Mentioned</label>
                <br>
                <span>Selected Gender: {{gender}}</span>
              </p>
              <p>
                <select v-model="countrySelected">
                  <option v-for="country in countries" 
                          v-bind:value="country.code">
                            {{country.name}}
                  </option>
                </select>
                <br>
                <span>Selected Country: {{countrySelected}}</span>
              </p>
              <p>
                <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
                <label for="jack">Jack</label>
                <input type="checkbox" id="john" value="John" v-model="checkedNames">
                <label for="john">John</label>
                <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
                <label for="mike">Mike</label>
                <br>
                <span>Checked names: {{ checkedNames }}</span>
              </p>
              <p>
                <input id="agreement" type="checkbox" v-model="pick" v-bind:value="licenseAgreement">
                <label for="agreement">Check to agree to the license agreement</label>
                <br>
                <span>Picked Value: {{ pick }}</span>
              </p>
            </form>`
})