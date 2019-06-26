<template>
  <div class="app-container">
    <!-- 头部搜索过滤 -->
    <div class="filter-container" align="center">
      <el-input
        v-model="listQuery.sname"
        placeholder="请输入搜索的学生名字"
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
      <el-table-column label="学生ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生名">
        <template slot-scope="scope">
          <span>{{ scope.row.sname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入学日期" align="center">
        <template slot-scope="scope">
          <span>{{ timestampToTime13(scope.row.entrytime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" align="center">
        <template slot-scope="scope">
          <span>{{ timestampToTime13(scope.row.sbirth) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家庭住址" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.saddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="健康状况" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.healthStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.snation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="250px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.scard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="530" class-name="small-padding fixed-width">
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
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="学生号" prop="sNum">
          <el-input v-model="temp.sNum" />
        </el-form-item>
        <el-form-item label="学生名" prop="sname">
          <el-input v-model="temp.sname" />
        </el-form-item>
        <el-form-item label="生日" prop="sbirth">
          <el-date-picker v-model="temp.sbirth" type="datetime" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="saddress">
          <el-input v-model="temp.saddress" />
        </el-form-item>
        <el-form-item label="健康状况" prop="healthStatus">
          <el-input v-model="temp.healthStatus" />
        </el-form-item>
        <el-form-item label="民族" prop="snation">
          <el-input v-model="temp.snation" />
        </el-form-item>
        <el-form-item label="身份证号" prop="scard">
          <el-input v-model="temp.scard" />
        </el-form-item>
        <el-form-item label="入学日期" prop="entrytime">
          <el-date-picker v-model="temp.entrytime" type="datetime" placeholder="请选择入学时间" />
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
  name: 'ManageStudentTable',
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
        sname: undefined
      },
      temp: {
        id: undefined,
        sNum: null,
        sname: '',
        sbirth: new Date(),
        saddress: '',
        snation: '',
        scard: null,
        healthStatus: '',
        entrytime: new Date()
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
        sNum: [{ required: true, message: '学号不能为空', trigger: 'blur' }],
        sname: [{ required: true, message: '学生名不能为空', trigger: 'blur' }],
        saddress: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        snation: [{ required: true, message: '民族不能为空', trigger: 'blur' }],
        scard: [{ required: true, message: '身份证号不能为空', trigger: 'blur' }],
        entrytime: [{ type: 'date', required: true, message: '时间不能为空', trigger: 'blur' }]
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
      api.getStudent(params)
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
        sNum: null,
        sname: '',
        sbirth: new Date(),
        saddress: '',
        snation: '',
        scard: null,
        healthStatus: '',
        entrytime: new Date()
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
      this.addtemp = this.$qs.stringify({
        sNum: this.temp.sNum,
        sname: this.temp.sname,
        entrytime: Number(this.temp.entrytime),
        sbirth: Number(this.temp.sbirth),
        saddress: this.temp.saddress,
        snation: this.temp.snation,
        healthStatus: this.temp.healthStatus,
        scard: this.temp.scard
      })
      api.addStudent(this.addtemp)
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
      this.temp.entrytime = new Date(this.temp.entrytime)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.editemp = this.$qs.stringify({
        id: this.editId,
        sNum: this.temp.sNum,
        sname: this.temp.sname,
        sbirth: Number(this.temp.sbirth),
        entrytime: Number(this.temp.entrytime),
        saddress: this.temp.saddress,
        snation: this.temp.snation,
        healthStatus: this.temp.healthStatus,
        scard: this.temp.scard
      })
      api.editStudent(this.editemp)
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
        const tHeader = ['学号', '学生名', '生日', '入学时间', '健康状况', '地址', '民族', '身份证号']
        const filterVal = ['sNum', 'sname', 'sbirth', 'entrytime', 'healthStatus', 'saddress', 'snation', 'scard']
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
      var date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
