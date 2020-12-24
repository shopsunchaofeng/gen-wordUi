<template>
  <div class="mod-women">
    <!--<el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="参数名" clearable></el-input>
      </el-form-item>
      &lt;!&ndash;<el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('clb:women:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('clb:women:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>&ndash;&gt;
    </el-form>-->
    <el-table
        :data="dataList"
        border
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
      <!--<el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>-->
            <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="图文详情">
              <template slot-scope="scope">
                <el-button type="primary" @click="aommonShowFucontentHandle(scope.row.id)">查看</el-button>
              </template>
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '1'">关于我们</el-tag>
          <el-tag v-if="scope.row.type === '2'">用户协议</el-tag>
          <el-tag v-if="scope.row.type === '3'">隐私政策</el-tag>
          <el-tag v-if="scope.row.type === '4'">提现规则</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatetime"
        header-align="center"
        align="center"
        label="更新时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('clb:women:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('clb:women:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <!-- 弹窗,-->
    <common-show-fucontent v-if="commonShowFucontentVisible" ref="commonShowFucontent" @refreshDataList="getDataList"></common-show-fucontent>
  </div>
</template>

<script>
  import AddOrUpdate from './women-add-or-update'
  import CommonShowFucontent from './common-show-fucontent'

  export default {
    data () {
      return {
        searchForm: {
          page: 1,
          limit: 10
        },
        dataList: [],
        totalPage: 0,
        dataListSelections: [],
        commonShowFucontentVisible: true,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate, CommonShowFucontent
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: '/clb/women/list',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit
          }
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.page.records
            this.totalPage = data.page.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
        })
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
      // 弹框
      aommonShowFucontentHandle (id) {
        this.commonShowFucontentVisible = true
        this.$nextTick(() => {
          this.$refs.commonShowFucontent.init(id, '/clb/women/info', 0)
        })
      },
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/clb/women/${ids}`,
            method: 'DELETE'
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList()
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
