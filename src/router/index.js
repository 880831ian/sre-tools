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
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（例如使用瀏覽器的前進/後退按鈕），則返回該位置
    if (savedPosition) {
      return savedPosition
    }
    // 否則滾動到頁面頂部，使用 Promise 確保在 DOM 更新後執行
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ top: 0, behavior: 'instant' })
      }, 0)
    })
  }
})

export default router