<template>
<el-dialog customClass="customWidth"
    :title="'钱包流水记录'"
    :close-on-click-modal="false"
    :visible.sync ="visible">
  <div class="mod-walletlog">
    <el-form :inline="true" :model="searchForm2" @keyup.enter.native="getDataList2()">
      <el-form-item label="选择店铺" prop="storeIds">
        <el-select v-model="searchForm2.storeIds" multiple filterable remote reserve-keyword placeholder="请选择" >
          <el-option
            v-for="store in storeList"
            :key="store.id"
            :label="store.storeName"
            :value="store.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-select v-model="searchForm2.transactionType" class="filter-item" clearable placeholder="交易类型">
        <el-option
          v-for="item in transactionTypelist"
          :key="item.value"
          :label="item.name"
          :value="item.value"/>
      </el-select>
      <el-date-picker v-model="searchForm2.startTime" class="filter-item" style="width: 130px;"
		                type="date"
		                placeholder="创建开始日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
			</el-date-picker>~ 
			<el-date-picker v-model="searchForm2.endTime" class="filter-item" style="width: 130px;"
		                type="date"
		                placeholder="创建截至日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
			</el-date-picker>
      <el-form-item>
        <el-button @click="getDataList2()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        style="width: 100%;">
      <el-table-column
        prop="storeName"
        header-align="center"
        align="center"
        label="店铺名称">
      </el-table-column>
      <el-table-column
        prop="transactionType"
        header-align="center"
        align="center"
        label="交易类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.transactionType === 1">充值</el-tag>
          <el-tag v-else-if="scope.row.transactionType === 2">提现</el-tag>
          <el-tag v-else-if="scope.row.transactionType === 3">消费</el-tag>
          <el-tag v-else-if="scope.row.transactionType === 4">积分兑换</el-tag>
          <el-tag v-else-if="scope.row.transactionType === 5">红包</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="changeMoney"
        header-align="center"
        align="center"
        label="变动金额">
      </el-table-column>
      <el-table-column
        prop="money"
        header-align="center"
        align="center"
        label="变动后的金额">
      </el-table-column>
      <el-table-column
        prop="crtTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="searchForm2.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchForm2.limit"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
        <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        searchForm2: {
          page: 1,
          limit: 10,
          storeIds: [],
          transactionType: '',
          startTime: undefined,
          endTime: undefined
        },
        dataList: [],
        totalPage: 0,
        dataListSelections: [],
        addOrUpdateVisible: false,
        storeList: JSON.parse(sessionStorage.getItem('storeList') || '[]'),
        transactionTypelist: [{value: 1, name: '充值'}, {value: 2, name: '提现'}, {value: 3, name: '消费'}, {value: 4, name: '积分兑换'}, {value: 5, name: '红包'}]
      }
    },
    activated () {
      this.getDataList2()
    },
    methods: {
      init (id) {
        this.searchForm2.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          if (this.searchForm2.id) {
            this.$http({
              url: `/id/walletlog/listByPersonId`,
              method: 'get',
              params: {
                'page': this.searchForm2.page,
                'limit': this.searchForm2.limit,
                'personId': this.searchForm2.id
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
          }
        })
      },
      // 获取数据列表
      getDataList2 () {
        this.$http({
          url: '/id/walletlog/listByPersonId',
          method: 'get',
          params: {
            'page': this.searchForm2.page,
            'limit': this.searchForm2.limit,
            'storeIds': this.searchForm2.storeIds,
            'transactionType': this.searchForm2.transactionType,
            'startTime': this.searchForm2.startTime,
            'endTime': this.searchForm2.endTime,
            'personId': this.searchForm2.id
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
        this.searchForm2.limit = val
        this.searchForm2.page = 1
        this.getDataList2()
      },
      // 当前页
      currentChangeHandle (val) {
        this.searchForm2.page = val
        this.getDataList2()
      }
    }
  }
</script>
<style>
    .customWidth{
        width:60%;
    }
</style>