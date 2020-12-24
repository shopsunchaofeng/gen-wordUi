<template>
  <div class="mod-personcoupon">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item >
        <el-input v-model="searchForm.couponName" placeholder="券卡名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.nickName" placeholder="昵称" clearable></el-input>
      </el-form-item>
      <el-date-picker v-model="searchForm.startTime" class="filter-item" style="width: 130px;"
		                type="date"
		                placeholder="有效开始日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
			</el-date-picker>~ 
			<el-date-picker v-model="searchForm.endTime" class="filter-item" style="width: 130px;"
		                type="date"
		                placeholder="有效截至日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
			</el-date-picker>
      <el-date-picker v-model="searchForm.useTime" class="filter-item" style="width: 130px;"
		                type="date"
		                placeholder="使用日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
			</el-date-picker>
      <el-select v-model="searchForm.isUse" class="filter-item" clearable placeholder="是否已使用">
        <el-option
          v-for="item in isuselist"
          :key="item.value"
          :label="item.name"
          :value="item.value"/>
      </el-select>

      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
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
        prop="couponName"
        header-align="center"
        align="center"
        label="优惠券名">
      </el-table-column>
      <el-table-column
        prop="nickName"
        header-align="center"
        align="center"
        label="用户昵称">
      </el-table-column>
            <!-- <el-table-column
        prop="couponId"
        header-align="center"
        align="center"
        label="优惠券ID">
      </el-table-column>
      <el-table-column
        prop="personId"
        header-align="center"
        align="center"
        label="用户ID">
      </el-table-column> -->
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        label="开始日期" >
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        label="截止日期">
      </el-table-column>
      <el-table-column
        prop="useTime"
        header-align="center"
        align="center"
        label="使用日期">
      </el-table-column>
      <el-table-column
        prop="isUse"
        header-align="center"
        align="center"
        label="是否使用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isUse === 0" type="danger">未使用</el-tag><!--未使用的可以加个邀请使用 TODO-->
          <el-tag v-else-if="scope.row.isUse === 1" type="info">已使用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="crtTime"
        header-align="center"
        align="center"
        label="领取时间">
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchForm: {
          page: 1,
          limit: 10,
          couponName: '',
          personName: '',
          startTime: undefined,
          endTime: undefined,
          useTime: undefined,
          isUse: ''
        },
        dataList: [],
        totalPage: 0,
        dataListSelections: [],
        isuselist: [{value: 0, name: '未使用'}, {value: 1, name: '已使用'}],
        storeList: JSON.parse(sessionStorage.getItem('storeList') || '[]')
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: '/id/personcoupon/list',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'couponName': this.searchForm.couponName,
            'personName': this.searchForm.personName,
            'startTime': this.searchForm.startTime,
            'endTime': this.searchForm.endTime,
            'useTime': this.searchForm.useTime,
            'isUse': this.searchForm.isUse
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
      }
    }
  }
</script>
