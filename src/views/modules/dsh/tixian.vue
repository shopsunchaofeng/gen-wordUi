<template>
  <div class="mod-tixian">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="提现人昵称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('dsh:tixian:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('dsh:tixian:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
            <el-table-column
        prop="nicename"
        header-align="center"
        align="center"
        label="提现人昵称">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="提现类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '1'">余额提现</el-tag>
          <el-tag v-if="scope.row.type === '2'">积分兑换提现</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="fangshi"
        header-align="center"
        align="center"
        label="提现方式">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.fangshi === 1">支付宝</el-tag>
          <el-tag v-if="scope.row.fangshi === 2">银行卡</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="account"
        header-align="center"
        align="center"
        label="账户余额">
      </el-table-column>
      <el-table-column
        prop="yujifen"
        header-align="center"
        align="center"
        label="账户剩余积分">
      </el-table-column>
      <el-table-column
        prop="jifen"
        header-align="center"
        align="center"
        label="提现兑换积分">
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="申请提现金额">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" style="color: blue">待审核</el-tag>
          <el-tag v-if="scope.row.status === '2'" style="color: green">审核成功</el-tag>
          <el-tag v-if="scope.row.status === '3'" style="color: red">审核失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="reason"
        header-align="center"
        align="center"
        label="提现驳回原因">
      </el-table-column>
      <el-table-column
        prop="zhifubao"
        header-align="center"
        align="center"
        label="支付宝账号">
      </el-table-column>
      <el-table-column
        prop="zfbname"
        header-align="center"
        align="center"
        label="支付宝姓名">
      </el-table-column>
      <el-table-column
        prop="bankname"
        header-align="center"
        align="center"
        label="银行卡姓名">
      </el-table-column>
      <el-table-column
        prop="bankno"
        header-align="center"
        align="center"
        label="银行卡号">
      </el-table-column>
      <el-table-column
        prop="bank"
        header-align="center"
        align="center"
        label="开户行">
      </el-table-column>
      <el-table-column
        prop="creattime"
        header-align="center"
        align="center"
        label="申请提现时间">
      </el-table-column>
      <el-table-column
        prop="shenhetime"
        header-align="center"
        align="center"
        label="审核时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('dsh:tixian:update') && scope.row.status === '1'" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">审核</el-button>
          <el-span v-if="scope.row.status !== '1'" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">无操作</el-span>
          <el-button v-if="isAuth('dsh:tixian:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  import AddOrUpdate from './tixian-add-or-update'

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
          url: '/dsh/tixian/list1',
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
            url: `/dsh/tixian/${ids}`,
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
