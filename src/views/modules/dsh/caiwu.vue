<template>
  <div class="mod-caiwu">
    <el-form label-width="60px">
      <el-form-item label="总收入:" prop="countShouyi">
        <el-input v-model="countShouyi" :disabled="true" placeholder="总收入" style="width:117px"></el-input>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <!--<el-form-item>
        <el-input v-model="searchForm.name" placeholder="参数名" clearable></el-input>
      </el-form-item>-->
      <el-date-picker v-model="searchForm.starttime" class="filter-item" style="width: 130px;"
                     type="datetime"
                     placeholder="开始日期" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
     </el-date-picker>~
     <el-date-picker v-model="searchForm.endtime" class="filter-item" style="width: 130px;"
                     type="datetime"
                     placeholder="截止日期" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
     </el-date-picker>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('clb:caiwu:excelOut')" type="primary" @click="addOrUpdateHandle()">导出</el-button>
        <el-button v-if="isAuth('clb:zorder:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="creattime"
        header-align="center"
        align="center"
        label="交易时间">
      </el-table-column>
      <el-table-column
        prop="zprice"
        header-align="center"
        align="center"
        label="金额">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="业务">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1">销售商品</el-tag>
          <el-tag v-else-if="scope.row.type === 3">发帖置顶</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="nicename"
        header-align="center"
        align="center"
        label="购买人">
      </el-table-column>
      <el-table-column
        prop="shopname"
        header-align="center"
        align="center"
        label="商家">
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
    <!-- 商品列表弹框 -->
    <ordergoods v-if="ordergoodsVisible" ref="ordergoods" @refreshDataList="getDataList"></ordergoods>
  </div>
</template>

<script>
  import AddOrUpdate from './order-add-or-update'

  export default {
    data () {
      return {
        visible: false,
        searchForm: {
          page: 1,
          limit: 10,
          starttime: '',
          endtime: ''
        },
        dataList: [],
        countShouyi: 0,
        totalPage: 0,
        dataListSelections: [],
        addOrUpdateVisible: false,
        ordergoodsVisible: true
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
          url: '/dsh/caiwu/list',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'starttime': this.searchForm.starttime,
            'endtime': this.searchForm.endtime
          }
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.page.records
            this.countShouyi = data.countShouyi
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
      // 导出
      addOrUpdateHandle () {
        window.location.href = this.$http.BASE_URL + `/clb/caiwu/excelOut?token=${this.$cookie.get('token')}&starttime=${this.searchForm.starttime}&endtime=${this.searchForm.endtime}`
        // window.open(this.$http.BASE_URL + `/clb/caiwu/excelOut?token=${this.$cookie.get('token')}&starttime=${this.searchForm.starttime}&endtime=${this.searchForm.endtime}`)
      },
      // 商品列表
      detailHandle (id) {
        this.ordergoodsVisible = true
        this.$nextTick(() => {
          this.$refs.ordergoods.getDataList(id)
        })
      },
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/clb/goodszorder/${ids}`,
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
