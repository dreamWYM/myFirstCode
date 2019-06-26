<template>
  <div class="app-container">
    <div class="filter-container" align="center">
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
      <el-table-column label="轮播图ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <span>{{ scope.row.imagePath }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="超链接地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否展现" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.showBanner}}</span>
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
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="temp.content" />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-input v-model="temp.imagePath" />
          <!--<div></div>-->
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" />
        </el-form-item>
        <el-form-item label="超链接地址" prop="url">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item label="是否展现" prop="showBanner">
          <el-switch v-model="temp.showBanner" />
          <!--<el-input v-model="temp.showBanner" />-->
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
  name: 'ManageParentTable',
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
        sort: '+id'
      },
      temp: {
        id: undefined,
        title: '',
        content: '',
        sort: null,
        url: null,
        show: '',
        imagePath: null
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
        // pname: [{ required: true, message: '家长名字不能为空', trigger: 'blur' }],
        // workAddr: [{ required: true, message: '工作地址不能为空', trigger: 'blur' }],
        // phone: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }]
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
      api.getBanner(params)
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
        title: '',
        content: '',
        sort: null,
        url: null,
        showBanner: false,
        imagePath: null
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
        title: this.temp.title,
        content: this.temp.content,
        sort: this.temp.sort,
        url: this.temp.url,
        showBanner: this.temp.showBanner,
        imagePath: this.temp.imagePath
      })
      api.addBanner(this.addtemp)
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
        title: this.temp.title,
        content: this.temp.content,
        sort: this.temp.sort,
        url: this.temp.url,
        showBanner: this.temp.showBanner,
        imagePath: this.temp.imagePath
      })
      api.editBanner(this.editemp)
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
      api.delectBanner(this.removeid)
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
        const tHeader = ['家长姓名', '工作地址', '联系方式']
        const filterVal = ['pname', 'workAddr', 'phone']
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
