import { createRouter, createWebHistory } from 'vue-router'
import Index  from '@/views/Index.vue'
import Create  from '@/views/Create.vue'
import Edit  from '@/views/Edit.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/create',
    name: 'create',
    component: Create
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: Edit
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL + 'task'),
  routes: routes
})
export { routes }
export default router
