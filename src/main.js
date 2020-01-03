import './assets/index.css';
import './assets/index.less';
import Vue from 'vue';
import App from './app';


new Vue({
    render: h => h(App)
}).$mount('#app')
