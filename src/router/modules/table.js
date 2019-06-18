/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  name: 'Table',
  meta: {
    title: '信息管理',
    icon: 'table'
  },
  children: [
    /*  {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamic-table/index'),
      name: 'DynamicTable',
      meta: { title: 'Dynamic Table' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/table/drag-table'),
      name: 'DragTable',
      meta: { title: 'Drag Table' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: 'Inline Edit' }
    },*/
    {
      path: 'school',
      component: () => import('@/views/table/inline-edit-table'),
      name: '学校',
      meta: { title: '学校管理', noCache: true }
    },
    {
      path: 'student',
      component: () => import('@/views/table/drag-table'),
      name: '学生',
      meta: { title: '学生管理', noCache: true }
    },
    {
      path: 'user',
      component: () => import('@/views/table/complex-table'),
      name: '用户',
      meta: { title: '用户管理', noCache: true }
    },
    {
      path: 'class',
      component: () => import('@/views/table/complex-table'),
      name: '班级',
      meta: { title: '班级管理', noCache: true }
    },
    {
      path: 'teacher',
      component: () => import('@/views/table/complex-table'),
      name: '老师',
      meta: { title: '老师管理', noCache: true }
    },
    {
      path: 'grade',
      component: () => import('@/views/table/manage-grade-table'),
      name: '年级',
      meta: { title: '年级管理', noCache: true }
    },
    {
      path: 'course',
      component: () => import('@/views/table/complex-table'),
      name: '课程',
      meta: { title: '课程管理', noCache: true }
    },
    {
      path: 'parent',
      component: () => import('@/views/table/manage-grade-table'),
      name: '家长',
      meta: { title: '家长管理', noCache: true }
    }

  ]
}

export default tableRouter
