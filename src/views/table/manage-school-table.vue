<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="学校名称" prop="schoolName">
      <el-input v-model="ruleForm.schoolName" class="common-wd" />
    </el-form-item>
    <el-form-item label="联系方式" prop="schoolPhone">
      <el-input v-model="ruleForm.schoolPhone" class="common-wd" />
    </el-form-item>
    <el-form-item label="学校地址" prop="schoolAddr">
      <el-input v-model="ruleForm.schoolAddr" class="common-wd" />
    </el-form-item>
    <el-form-item label="邮编" prop="shcoolPostCode">
      <el-input v-model="ruleForm.schoolPostCode" class="common-wd" />
    </el-form-item>
    <el-form-item label="邮箱" prop="schoolEmail">
      <el-input v-model="ruleForm.schoolEmail" class="common-wd" />
    </el-form-item>
    <el-form-item label="学校简介" prop="schoolProfile">
      <el-input v-model="ruleForm.schoolProfile" type="textarea" class="common-wd" />
    </el-form-item>
    <el-form-item label="学校负责人" prop="schoolLead">
      <el-input v-model="ruleForm.schoolLead" class="common-wd" />
    </el-form-item>
    <el-form-item label="校长" prop="schoolMaster">
      <el-input v-model="ruleForm.schoolMaster" class="common-wd" />
    </el-form-item>
    <el-form-item label="学校官网" prop="schoolWebsiteAddr">
      <el-input v-model="ruleForm.schoolWebsiteAddr" class="common-wd" />
    </el-form-item>
    <el-form-item label="公众号" prop="schoolPublicNum">
      <el-input v-model="ruleForm.schoolPublicNum" class="common-wd" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="updateData()">修改</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<style>
.demo-ruleForm {
  margin: 70px 500px;
}
.common-wd {
  width: 600px;
}
</style>
<script>
// 后台接口数据
import api from '@/api/api'
export default {
  name: 'ManageSchoolTable',
  data() {
    return {
      ruleForm: {},
      rules: {
        schoolName: [{ required: true, message: '请输入学校名', trigger: 'blur' }],
        schoolPhone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        schoolAddr: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        schoolPostCode: [{ required: true, message: '邮编不能为空', trigger: 'blur' }],
        schoolEmail: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        schoolProfile: [{ required: true, message: '学校简介不能为空', trigger: 'blur' }],
        schoolLead: [{ required: true, message: '学校负责人不能为空', trigger: 'blur' }],
        schoolMaster: [{ required: true, message: '校长不能为空', trigger: 'blur' }],
        schoolWebsiteAddr: [{ required: true, message: '网站不能为空', trigger: 'blur' }],
        schoolPublicNum: [{ required: true, message: '公众号不能为空', trigger: 'blur' }]
      }
    }
  },
  // 获取数据
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      api.getSchool()
        .then(res => {
          console.log(res.data)
          this.ruleForm = res.data
          this.listLoading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 修改数据
    updateData() {
      this.editemp = this.$qs.stringify({
        schoolName: this.ruleForm.schoolName,
        schoolPhone: this.ruleForm.schoolPhone,
        schoolAddr: this.ruleForm.schoolAddr,
        schoolPostCode: this.ruleForm.schoolPostCode,
        schoolEmail: this.ruleForm.schoolEmail,
        schoolProfile: this.ruleForm.schoolProfile,
        schoolLead: this.ruleForm.schoolLead,
        schoolMaster: this.ruleForm.schoolMaster,
        schoolWebsiteAddr: this.ruleForm.schoolWebsiteAddr,
        schoolPublicNum: this.ruleForm.schoolPublicNum
      })
      api.editSchool(this.editemp)
        .then(res => {
          if (res.code === 20000) {
            this.$notify({
              title: 'Success',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
