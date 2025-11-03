import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ToolView from '../views/ToolView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tools/:toolId',
    name: 'Tool',
    component: ToolView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router