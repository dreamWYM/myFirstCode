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
  roles: ['admin', 'teacher'],
  children: [
    {
      path: 'school',
      component: () => import('@/views/table/manage-school-table'),
      name: '学校',
      meta: { title: '学校管理', noCache: true },
      roles: ['admin', 'teacher']
    },
    {
      path: 'student',
      component: () => import('@/views/table/manage-student-table'),
      name: '学生',
      meta: { title: '学生管理', noCache: true },
      roles: ['admin', 'teacher']
    },
    {
      path: 'user',
      component: () => import('@/views/table/manage-user-table'),
      name: '用户',
      meta: { title: '用户管理', noCache: true },
      roles: ['admin', 'teacher']
    },
    {
      path: 'class',
      component: () => import('@/views/table/manage-class-table'),
      name: '班级',
      meta: { title: '班级管理', noCache: true },
      roles: ['admin', 'teacher']
    },
    {
      path: 'teacher',
      component: () => import('@/views/table/manage-teacher-table'),
      name: '老师',
      meta: { title: '老师管理', noCache: true },
      roles: ['admin', 'teacher']
    },
    {
      path: 'grade',
      component: () => import('@/views/table/manage-grade-table'),
      name: '年级',
      meta: { title: '年级管理', noCache: true },
      roles: ['admin', 'teacher']
    },
    {
      path: 'course',
      component: () => import('@/views/table/manage-course-table'),
      name: '课程',
      meta: { title: '课程管理', noCache: true },
      roles: ['admin', 'teacher']
    },
    {
      path: 'parent',
      component: () => import('@/views/table/manage-parent-table'),
      name: '家长',
      meta: { title: '家长管理', noCache: true },
      roles: ['admin', 'teacher']
    },
    {
      path: 'lunbo',
      component: () => import('@/views/table/manage-lunbo-table'),
      name: '轮播图',
      meta: { title: '轮播图管理', noCache: true },
      roles: ['admin', 'teacher']
    }

  ]
}

export default tableRouter
