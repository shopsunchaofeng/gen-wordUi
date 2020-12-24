<template>
<el-dialog customClass="customWidth"
    :title="'积分流水记录'"
    :close-on-click-modal="false"
    :visible.sync ="visible">
  <div class="mod-integralrecord">
    <el-form :inline="true" :model="searchForm1" @keyup.enter.native="getDataList1()">
      <el-select v-model="searchForm1.dataSource" class="filter-item" clearable placeholder="数据来源">
        <el-option
          v-for="item in dataSourcelist"
          :key="item.value"
          :label="item.name"
          :value="item.value"/>
      </el-select>
      <el-select v-model="searchForm1.type" class="filter-item" clearable placeholder="类型">
        <el-option
          v-for="item in typelist"
          :key="item.value"
          :label="item.name"
          :value="item.value"/>
      </el-select>
       <el-date-picker v-model="searchForm1.startTime" class="filter-item" style="width: 135px;"
		                type="date"
		                placeholder="创建开始日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
			</el-date-picker>~ 
			<el-date-picker v-model="searchForm1.endTime" class="filter-item" style="width: 135px;"
		                type="date"
		                placeholder="创建截至日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
			</el-date-picker>
    
      <el-form-item>
        <el-button @click="getDataList1()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        style="width: 100%;">
        <el-table-column
        prop="dataSource"
        header-align="center"
        align="center"
        label="数据来源">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.dataSource === 1">购买</el-tag>
          <el-tag v-else-if="scope.row.dataSource === 2">签到</el-tag>
          <el-tag v-else-if="scope.row.dataSource === 3">消费</el-tag>
        </template>
      </el-table-column>
            <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1">增加</el-tag>
          <el-tag v-else-if="scope.row.type === 2">减少</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="integralNum"
        header-align="center"
        align="center"
        label="积分数">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="积分状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1">有效</el-tag>
          <el-tag v-else-if="scope.row.status === 2">已扣除</el-tag>
          <el-tag v-else-if="scope.row.status === 3">已过期</el-tag>
          <el-tag v-else-if="scope.row.status === 4">冻结中</el-tag>
          <el-tag v-else-if="scope.row.status === 5">冻结返还</el-tag>
          <el-tag v-else-if="scope.row.status === 6">冻结扣减</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sourceId"
        header-align="center"
        align="center"
        label="积分来源ID">
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
        :current-page="searchForm1.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchForm1.limit"
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
        searchForm1: {
          page: 1,
          limit: 10,
          dataSource: '',
          startTime: undefined,
          endTime: undefined,
          type: ''
        },
        dataList: [],
        totalPage: 0,
        dataListSelections: [],
        dataSourcelist: [{value: 1, name: '购买'}, {value: 2, name: '签到'}, {value: 3, name: '消费'}],
        typelist: [{value: 1, name: '增加'}, {value: 2, name: '减少'}]
      }
    },
    activated () {
      this.getDataList1()
    },
    methods: {
      init (id) {
        this.searchForm1.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          // this.$refs['searchForm1'].resetFields()
          if (this.searchForm1.id) {
            this.$http({
              url: `/id/integralrecord/listByPersonId`,
              method: 'get',
              params: {
                'page': this.searchForm1.page,
                'limit': this.searchForm1.limit,
                'personId': this.searchForm1.id
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
      getDataList1 () {
        this.$http({
          url: '/id/integralrecord/listByPersonId',
          method: 'get',
          params: {
            'page': this.searchForm1.page,
            'limit': this.searchForm1.limit,
            'dataSource': this.searchForm1.dataSource,
            'startTime': this.searchForm1.startTime,
            'endTime': this.searchForm1.endTime,
            'type': this.searchForm1.type,
            'personId': this.searchForm1.id
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
        this.searchForm1.limit = val
        this.searchForm1.page = 1
        this.getDataList1()
      },
      // 当前页
      currentChangeHandle (val) {
        this.searchForm1.page = val
        this.getDataList1()
      }
    }
  }
  </script>
<style>
    .customWidth{
        width:60%;
    }
</style>