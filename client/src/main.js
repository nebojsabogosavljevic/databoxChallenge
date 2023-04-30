import { createApp } from 'vue'
import App from './App.vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import Toast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'


createApp(App)
.use(VueAxios, axios, Toast)
.mount('#app')
