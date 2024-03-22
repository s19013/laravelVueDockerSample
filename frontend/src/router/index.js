import { createRouter, createWebHistory } from 'vue-router'
import Index  from '@/views/Index.vue'
import Create  from '@/views/Create.vue'
import Edit  from '@/views/Edit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL + 'task'),
  routes: [
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
})

export default router
