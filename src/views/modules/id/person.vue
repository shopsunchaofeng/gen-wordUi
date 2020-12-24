<template>
  <div class="mod-person">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.userName" placeholder="昵称" clearable></el-input>
      </el-form-item>
      <!--
      <el-form-item>
        <el-input v-model="searchForm.realName" placeholder="真实名" clearable></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-input v-model="searchForm.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>
        <!-- <el-input v-model="dataForm.isCheck" placeholder="是否支持自提核销，0否，1是"></el-input> -->
        <el-form-item label="">
        <el-checkbox v-model="searchForm.active">活跃用户</el-checkbox>
        </el-form-item>
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
        prop="nickName"
        header-align="center"
        align="center"
        label="昵称">
      </el-table-column>
      <!-- <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号" width="120px">
      </el-table-column> -->
      <el-table-column
        prop="gender"
        header-align="center"
        align="center"
        label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.gender === 1">男</el-tag>
          <el-tag v-else-if="scope.row.gender === 2">女</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="birthday"
        header-align="center"
        align="center"
        label="出生日期">
      </el-table-column> -->
      <el-table-column
        prop="avatar"
        header-align="center"
        align="center"
        label="头像">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar" :src="scope.row.avatar" min-width="60" height="60" @click="handleImgView(scope.$index, scope.row.avatar)"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="areaname"
        header-align="center"
        align="center"
        label="所在地">
      </el-table-column>
      <el-table-column
        prop="levelName"
        header-align="center"
        align="center"
        label="用户级别">
      </el-table-column>
      <el-table-column
        prop="encryptMoney"
        header-align="center"
        align="center"
        label="账户余额">
      </el-table-column>
      <!-- <el-table-column
        prop="encryptMoney"
        header-align="center"
        align="center"
        label="账户加密金额"> 
      </el-table-column>-->
      <el-table-column
        prop="integral"
        header-align="center"
        align="center"
        label="积分">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="用户状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1">正常</el-tag>
          <el-tag v-else-if="scope.row.status === 2">禁用</el-tag>
          <el-tag v-else-if="scope.row.status === 3">注销</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="shareNum"
        header-align="center"
        align="center"
        label="分享次数">
      </el-table-column>
      <el-table-column
        prop="inviterPersonId"
        header-align="center"
        align="center"
        label="邀请人">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete === -1">自主注册</span>
          <span>{{scope.row.inviterPersonId}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="dataSource"
        header-align="center"
        align="center"
        label="数据来源">
         <el-tag v-if="scope.row.dataSource === 1">小程序</el-tag>
          <el-tag v-else-if="scope.row.dataSource === 2">其他</el-tag>
      </el-table-column> -->
      <el-table-column
        prop="crtTime"
        header-align="center"
        align="center"
        label="注册时间">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        header-align="center"
        align="center"
        label="最近来访">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button v-if="isAuth('id:person:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('id:person:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button> -->
          <el-button v-if="isAuth('id:integralrecord:listByPersonId')" type="text" @click="integralRecordHandle(scope.row.id)">积分流水</el-button>
          <el-button v-if="isAuth('id:walletlog:listByPersonId')" type="text"  @click="walletRecordHandle(scope.row.id)">钱包流水</el-button>
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
    <!-- 弹窗, 积分流水 -->
    <queryIntegralRecord v-if="integralRecordVisible" ref="queryIntegralRecord" ></queryIntegralRecord>
    <!-- 弹窗, 钱包流水 -->
    <queryWalletLog v-if="walletLogVisible" ref="queryWalletLog" ></queryWalletLog>
    <el-dialog :visible.sync="dialogImgVisible" width="310px" height="270px">
      <img width="100%" :src="avatar" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import QueryIntegralRecord from './person-integralrecord'
  import QueryWalletLog from './person-walletlog'
  export default {
    data () {
      return {
        searchForm: {
          page: 1,
          limit: 10,
          userName: '',
          realName: '',
          phone: '',
          active: ''
        },
        checked: false,
        avatar: '',
        dataList: [],
        totalPage: 0,
        dataListSelections: [],
        integralRecordVisible: false,
        walletLogVisible: false,
        dialogImgVisible: false
      }
    },
    components: {
      QueryIntegralRecord,
      QueryWalletLog
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: '/id/person/list',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'userName': this.searchForm.userName,
            'realName': this.searchForm.realName,
            'phone': this.searchForm.phone,
            'active': this.searchForm.active
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
      // 积分流水
      integralRecordHandle (id) {
        this.integralRecordVisible = true
        this.$nextTick(() => {
          this.$refs.queryIntegralRecord.init(id)
        })
      },
      // 钱包流水
      walletRecordHandle (id) {
        this.walletLogVisible = true
        this.$nextTick(() => {
          this.$refs.queryWalletLog.init(id)
        })
      },
      handleImgView (index, avatar) {
        this.avatar = avatar
        this.dialogImgVisible = true
      }
    }
  }
</script>
