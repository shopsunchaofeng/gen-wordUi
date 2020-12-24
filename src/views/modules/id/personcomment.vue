<template>
  <div class="mod-personcomment">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('id:personcomment:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('id:personcomment:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
            <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="数据类型，1商品，2团购，3店铺，4文章">
      </el-table-column>
      <el-table-column
        prop="firstSourceId"
        header-align="center"
        align="center"
        label="第一个数据源ID">
      </el-table-column>
      <el-table-column
        prop="secondSourceId"
        header-align="center"
        align="center"
        label="第二个数据源ID">
      </el-table-column>
      <el-table-column
        prop="thirdSourceId"
        header-align="center"
        align="center"
        label="第三个数据源ID">
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="评论内容">
      </el-table-column>
      <el-table-column
        prop="evaluateStar"
        header-align="center"
        align="center"
        label="评价星级1-5">
      </el-table-column>
      <el-table-column
        prop="deliveryStar"
        header-align="center"
        align="center"
        label="配送星级1-5">
      </el-table-column>
      <el-table-column
        prop="qualityStar"
        header-align="center"
        align="center"
        label="质量星级">
      </el-table-column>
      <el-table-column
        prop="afterStar"
        header-align="center"
        align="center"
        label="售后星级">
      </el-table-column>
      <el-table-column
        prop="serviceStar"
        header-align="center"
        align="center"
        label="服务星级">
      </el-table-column>
      <el-table-column
        prop="storeStar"
        header-align="center"
        align="center"
        label="商店星级">
      </el-table-column>
      <el-table-column
        prop="source"
        header-align="center"
        align="center"
        label="数据来源，1小程序">
      </el-table-column>
      <el-table-column
        prop="isCheck"
        header-align="center"
        align="center"
        label="1已审核，0未审核">
      </el-table-column>
      <el-table-column
        prop="systemId"
        header-align="center"
        align="center"
        label="系统编号">
      </el-table-column>
      <el-table-column
        prop="clentId"
        header-align="center"
        align="center"
        label="客户代码">
      </el-table-column>
      <el-table-column
        prop="appId"
        header-align="center"
        align="center"
        label="小程序ID">
      </el-table-column>
      <el-table-column
        prop="crtTime"
        header-align="center"
        align="center"
        label="">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('id:personcomment:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('id:personcomment:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  import AddOrUpdate from './personcomment-add-or-update'

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
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: '/id/personcomment/list',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'name': this.searchForm.name
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
            url: `/id/personcomment/${ids}`,
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
