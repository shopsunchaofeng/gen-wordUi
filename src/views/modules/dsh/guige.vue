<template>
  <div class="mod-guige">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
            <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="规格名称">
      </el-table-column>
      <el-table-column
        prop="kucun"
        header-align="center"
        align="center"
        label="库存">
      </el-table-column>
      <el-table-column
        prop="xuhao"
        header-align="center"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('dsh:guige:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.$index,scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="searchForm.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchForm.limit"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './guige-add-or-update'

  export default {
    data () {
      return {
        searchForm: {
          page: 1,
          limit: 10,
          name: ''
        },
        dataList: [],
        totalPage: 0,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    methods: {
      // 获取数据列表
      getDataList (data) {
        let obj = Object.assign({}, data)
        this.dataList.push(obj)
      },
      // 每页数
      sizeChangeHandle (val) {
        this.searchForm.limit = val
        this.searchForm.page = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.searchForm.page = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (index, id) {
        if (id) {
          this.$confirm(`确定删除操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: `/dsh/guige/${id}`,
              method: 'DELETE'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.dataList.splice(index, 1)
              }
            })
          }).catch(() => {
          })
        } else {
          this.$confirm(`确定删除操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dataList.splice(index, 1)
          })
        }
      }
    }
  }
</script>
