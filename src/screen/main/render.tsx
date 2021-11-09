import Vue, { CreateElement, VNode } from 'vue'
// Material-UI
import {
  MdField,
  MdButton
} from '@material'
Vue.use(MdField)
Vue.use(MdButton)
// Validation
import Vuelidate from 'vuelidate'
import { 
  required, 
  email,
} from 'vuelidate/lib/validators'
Vue.use(Vuelidate)
// Stores
import Vuex from 'vuex'
Vue.use(Vuex)
import userStore from '@/store/user.store'
// IPC
import {remote} from 'electron'
import {userAction} from '@/actions/action-type'
import IpcService, {IpcChannelInterface} from '@/lib/ipc/ipc-service'

var vm = new Vue({
  store: userStore,
  data: {
    // IPC communicate
    channel: remote.getGlobal('channel') as IpcChannelInterface,
    ipc: new IpcService(),
    // form data
    form: {
      user: null,
      password: null,
    }
  },
  validations: {
    form: {
      user: { 
        required,
        email 
      },
      password: { 
        required,
      }
    }
  },
  computed: {
    ...Vuex.mapState(['count'])
  },
  methods: {
    ...Vuex.mapActions(['increment', "decrement"]),
    validateUser (e: Event) {
      // check all requirements
      this.$v.$touch()
      if (!this.$v.$invalid) {
        // request API
      }
      e.preventDefault()
    },
    // Vuex
    test() {
      this.increment()
    },
    // Remote
    test1() {
      this.ipc.send(this.channel, userAction.login)
    }
  },
  render (h: CreateElement): VNode {
    return (
      <div id='container'>
        <form id='form' onSubmit={this.validateUser}>
          {/* Logo */}
          <img src='app://resource/images/ainesha_logo.png'/>
          {/* ID */}
          <md-field class={{'md-invalid': this.$v.form.user!.$invalid && this.$v.form.user!.$dirty}}>
            <label>Account</label>
            <md-input vModel_trim={this.form.user} autocomplete={true}/>
            {/* <span class="md-helper-text">Email or ID</span> */}
            {!this.$v.form.user!.required && <span class="md-error">User ID is required</span>}
            {!this.$v.form.user!.email && <span class="md-error">ID is an email</span>}
          </md-field>
          {/* Password */}
          <md-field class={{'md-invalid': this.$v.form.password!.$invalid && this.$v.form.password!.$dirty}}>
            <label>Password</label>
            <md-input type="password" vModel_trim={this.form.password}/>
            {!this.$v.form.password!.required && <span class="md-error">Password is required</span>}
          </md-field>
          {/* Button */}
          <md-button type='submit' class="md-raised md-primary">Login</md-button>
        </form>
        <md-button class="md-raised md-primary" onClick={this.test}>Test Vuex</md-button>
        <md-button class="md-raised md-primary" onClick={this.test1}>Test Remote</md-button>
        <div>{this.count}</div>
      </div>
    )
  }
})

vm.$mount('#app')