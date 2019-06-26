<template>
  <div class="app-container">
    <!-- 头部添加导出 -->
    <div class="filter-container" align="center">
      <el-input
        v-model="listQuery.title"
        placeholder="请输入搜索内容"
        style="width: 400px; margin-right: 20px;"
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
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="账号" prop="account" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" prop="pass" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pass }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="530" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,'deleted')"
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
    <!--添加信息的弹出框  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="temp.account" />
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="temp.pass" />
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
export default {
  name: 'ManageUserTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      editId: '',
      total: 0,
      addtemp: '',
      editemp: '',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      temp: {
        account: '',
        pass: ''
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
        account: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        pass: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
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
      // api.Login()
      //   .then(res => {
      //     console.log(res)
      //     // this.list = res.data
      //     // this.total = res.data.total
      //     // console.log(this.total)
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        status: 'published',
        type: ''
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
        account: this.temp.account,
        pass: this.temp.pass
      })
      api.addClass(this.addtemp)
        .then(res => {
          if (res.code === 20000) {
            // 更新列表
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
                // this.temp.author = 'vue-element-admin'
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
    handleUpdate(row) {
      this.editId = row.id
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.editemp = this.$qs.stringify({
        id: this.editId,
        account: this.temp.account,
        pass: this.temp.pass
      })
      api.editClass(this.editemp)
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
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
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
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['班级名称', '班级号']
        const filterVal = ['className', 'classNum']
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
    }
  }
}
</script>
