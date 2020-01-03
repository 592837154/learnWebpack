import './assets/index.css';
import './assets/index.less';
import Vue from 'vue';
import App from './app';
import echarts from 'echarts';
console.log(echarts, 1);


new Vue({
    render: h => h(App)
}).$mount('#app')
