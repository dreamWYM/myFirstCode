import axios from 'axios'

var url = 'http://192.168.0.123:8080/'

// axios 配置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = url

export function Post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        if (response.data.code === 20000 || response.data.code === 500 || response.data.code === 501) {
          resolve(response.data)
        } else if (response.data.code === 403) {
          /* Toast({
            message: '您在已经在其他地方登录，请重新登录',
            position: 'bottom',
            duration: 2000
          })*/
        } else {
          /* Toast({
            message: response.data.msg
          })*/
        }
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function Get(url, params) {
  return new Promise((resolve, reject) => {
    console.log(params)
    axios.get(url, params)
      .then(response => {
        if (response.data.code === 20000 || response.data.code === 500 || response.data.code === 501) {
          resolve(response.data)
        } else if (response.data.code === 403) {
          /* Toast({
            message: '您在已经在其他地方登录，请重新登录',
            position: 'bottom',
            duration: 2000
          })*/
        } else {
          /* Toast({
            message: response.data.msg
          })*/
        }
      }, err => {
        reject(err)
        /* Toast({
           message: '网络延时，请稍后重试'
         })*/
      })
      .catch((error) => {
        reject(error)
        /* Toast({
           message: '网络延时，请稍后重试'
         })*/
      })
  })
}

export default {
  // 对用户进行增删改查
  Login(params) {
    return Post(`/user/login`, params)
  },
  // 对学校进行增改查
  getSchool() {
    return Get(`/school`)
  },
  editSchool(params) {
    return Post(`/school/save`, params)
  },
  // 对年级进行增改查的接口
  getGrade(params) {
    return Get(`/grade`, params)
  },
  addGrade(params) {
    return Post(`/grade/insert`, params)
  },
  editGrade(params) {
    return Post(`/grade/update`, params)
  },
  // 对班级进行增删改查的接口
  getClass(params) {
    return Get(`/class`, params)
  },
  addClass(params) {
    return Post(`/class/insert`, params)
  },
  editClass(params) {
    return Post(`/class/update`, params)
  },
  // 对学生进行增删改查的接口
  getStudent(params) {
    return Get(`/student/getStudents`, params)
  },
  addStudent(params) {
    return Post(`/student/saveStudent`, params)
  },
  editStudent(params) {
    return Post(`/student/updateStudentById`, params)
  },
  delectStudent(params) {
    return Post(`/student/softDeleStudentById`, params)
  },
  // 对老师进行增删改查的接口
  getTeacher(params) {
    return Get(`/teacher`, params)
  },
  addTeacher(params) {
    return Post(`/teacher/insert`, params)
  },
  editTeacher(params) {
    return Post(`/teacher/update`, params)
  },
  // 对课程进行增删改查的接口
  getCourse(params) {
    return Get(`/course`, params)
  },
  addCourse(params) {
    return Post(`/course/insert`, params)
  },
  editCourse(params) {
    return Post(`/course/update`, params)
  },
  // 对家长进行增删改查的接口
  getParent(params) {
    return Get(`/parents/getParents`, params)
  },
  addParent(params) {
    return Post(`/parents/saveParents`, params)
  },
  editParent(params) {
    return Post(`/parents/updateParentsById`, params)
  },
  delectParent(params) {
    return Post(`/parents/deleParentsById`, params)
  },
  // 对轮播图进行增删改查的接口
  getBanner(params) {
    return Get(`/banner`, params)
  },
  addBanner(params) {
    return Post(`/banner/insert`, params)
  },
  editBanner(params) {
    return Post(`/banner/update`, params)
  },
  delectBanner(params) {
    return Post(`/banner/delete/3`, params)
  }
}
