<template>
  <div class="app-container">
    <!-- 头部搜索过滤 -->
    <div class="filter-container" align="center">
      <el-input
        v-model="listQuery.teachNum"
        placeholder="请输入搜索的老师编号"
        style="width: 500px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
    </div>
    <!--列表数据  -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="老师ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老师编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teachNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老师名称">
        <template slot-scope="scope">
          <span>{{ scope.row.teachName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老师手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teachPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老师生日" align="center">
        <template slot-scope="scope">
          <span>{{ timestampToTime13(scope.row.teachBirth) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老师地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teachAddr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老师身份证" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teachCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teachNation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学历" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teachEdu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毕业院校" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teachGraduate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row,'deleted')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <pagination
      v-show="total>0"
      align="center"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!--弹出框  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:40px;"
      >
        <el-form-item label="老师编号" prop="teachNum">
          <el-input v-model="temp.teachNum" />
        </el-form-item>
        <el-form-item label="老师名称" prop="teachName">
          <el-input v-model="temp.teachName" />
        </el-form-item>
        <el-form-item label="老师手机号" prop="teachPhone">
          <el-input v-model="temp.teachPhone" />
        </el-form-item>
        <el-form-item label="老师生日" prop="teachBirth">
          <el-date-picker v-model="temp.teachBirth" type="datetime" placeholder="请选择老师生日" />
        </el-form-item>
        <el-form-item label="老师地址" prop="teachAddr">
          <el-input v-model="temp.teachAddr" />
        </el-form-item>
        <el-form-item label="老师身份证" prop="teachCard">
          <el-input v-model="temp.teachCard" />
        </el-form-item>
        <el-form-item label="民族" prop="teachNation">
          <el-input v-model="temp.teachNation" />
        </el-form-item>
        <el-form-item label="学历" prop="teachEdu">
          <el-input v-model="temp.teachEdu" />
        </el-form-item>
        <el-form-item label="毕业院校" prop="teachGraduate">
          <el-input v-model="temp.teachGraduate" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 后台接口数据
import { fetchPv, createArticle, updateArticle } from '@/api/article'
import api from '@/api/api'
// 点击波浪效果
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// arr to obj, such as { CN : "China", US : "USA" }
export default {
  name: 'ManageTeacherTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      removeid: '',
      editId: '',
      addtemp: '',
      editemp: '',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        teachNum: undefined
      },
      temp: {
        id: undefined,
        teachNum: null,
        teachName: '',
        teachPhone: null,
        teachAddr: '',
        teachCard: null,
        teachNation: '',
        teachEdu: '',
        teachGraduate: '',
        teachBirth: new Date()
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        teachNum: [{ required: true, message: '老师编号不能为空', trigger: 'blur' }],
        teachName: [{ required: true, message: '老师名称不能为空', trigger: 'blur' }],
        teachPhone: [{ required: true, message: '老师手机号不能为空', trigger: 'blur' }],
        teachCard: [{ required: true, message: '老师身份证不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var params = {
        params: {
          page: this.listQuery.page,
          size: this.listQuery.limit
        }
      }
      api.getTeacher(params)
        .then(res => {
          console.log(res)
          this.list = res.data.list
          this.total = res.data.total
          this.listQuery.page = res.data.pageNum
          this.listQuery.limit = res.data.pageSize
          this.listLoading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // 添加数据
    resetTemp() {
      this.temp = {
        id: undefined,
        teachNum: null,
        teachName: '',
        teachPhone: null,
        teachAddr: '',
        teachCard: null,
        teachNation: '',
        teachEdu: '',
        teachGraduate: '',
        teachBirth: new Date()
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log(Number(this.temp.teachBirth))
      this.addtemp = this.$qs.stringify({
        teachNum: this.temp.teachNum,
        teachName: this.temp.teachName,
        teachPhone: this.temp.teachPhone,
        teachAddr: this.temp.teachAddr,
        teachCard: this.temp.teachCard,
        teachNation: this.temp.teachNation,
        teachEdu: this.temp.teachEdu,
        teachGraduate: this.temp.teachGraduate,
        teachBirth: Number(this.temp.teachBirth)
      })
      api.addTeacher(this.addtemp)
        .then(res => {
          if (res.code === 20000) {
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
                createArticle(this.temp).then(() => {
                  this.list.unshift(this.temp)
                  this.dialogFormVisible = false
                  this.$notify({
                    title: 'Success',
                    message: '添加成功',
                    type: 'success',
                    duration: 2000
                  })
                })
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 修改数据
    handleUpdate(row) {
      this.editId = row.id
      this.temp = Object.assign({}, row) // copy obj
      this.temp.teachBirth = new Date(this.temp.teachBirth)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.editemp = this.$qs.stringify({
        id: this.editId,
        teachNum: this.temp.teachNum,
        teachName: this.temp.teachName,
        teachPhone: this.temp.teachPhone,
        teachAddr: this.temp.teachAddr,
        teachCard: this.temp.teachCard,
        teachNation: this.temp.teachNation,
        teachEdu: this.temp.teachEdu,
        teachGraduate: this.temp.teachGraduate,
        teachBirth: Number(this.temp.teachBirth)
      })
      api.editTeacher(this.editemp)
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.entrytime = +new Date(tempData.entrytime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
          })
        }
      })
    },
    // 删除数据
    handleDelete(row) {
      this.removeid = this.$qs.stringify({
        id: row.id
      })
      api.delectStudent(this.removeid)
        .then(res => {
          if (res.code === 20000) {
            // 更新列表
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    // excel表格导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['老师编号', '老师名称', '老师手机号', '老师生日（时间戳）', '老师地址', '老师身份证', '民族', '学历', '毕业院校']
        const filterVal = ['teachNum', 'teachName', 'teachPhone', 'teachBirth', 'teachAddr', 'teachCard', 'teachNation', 'teachEdu', 'teachGraduate']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    timestampToTime13(timestamp) {
      var date = new Date(timestamp)
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth()) + '-'
      const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
      const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return Y + M + D + h + m + s
    }
  }
}
</script>
