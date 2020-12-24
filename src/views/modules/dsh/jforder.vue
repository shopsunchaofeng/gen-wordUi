<template>
  <div class="mod-order">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.orderno" placeholder="订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.nicename" placeholder="下单人" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-date-picker v-model="searchForm.starttime" class="filter-item" style="width: 130px;"
                      type="datetime"
                      placeholder="开始日期" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>~
      <el-date-picker v-model="searchForm.endtime" class="filter-item" style="width: 130px;"
                      type="datetime"
                      placeholder="截止日期" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
      <el-form-item>
        <el-button v-if="isAuth('dsh:order:daochu')" type="primary" @click="daochuHandle()">导出财务报表</el-button>
        <el-button v-if="isAuth('dsh:order:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('dsh:order:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
     <!-- <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>-->
            <el-table-column
        prop="nicename"
        header-align="center"
        align="center"
        label="下单人">
      </el-table-column>
      <el-table-column
        prop="orderno"
        header-align="center"
        align="center"
        label="订单号">
      </el-table-column>
      <!--<el-table-column
        prop="category"
        header-align="center"
        align="center"
        label="订单类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.category === '1'" >积分商品订单</el-tag>
          <el-tag v-if="scope.row.category === '2'" >购买商品订单</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="支付类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '1'" >积分兑换</el-tag>
          <el-tag v-if="scope.row.type === '2'" >支付宝支付</el-tag>
          <el-tag v-if="scope.row.type === '3'" >微信支付</el-tag>
          <el-tag v-if="scope.row.type === '4'" >钱包支付</el-tag>
          <el-tag v-if="scope.row.type === '5'" >钱包和支付宝混合支付</el-tag>
          <el-tag v-if="scope.row.type === '6'" >钱包和微信混合支付</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="支付金额">
      </el-table-column>-->
     <!-- <el-table-column
        prop="walletprice"
        header-align="center"
        align="center"
        label="钱包支付金额">
      </el-table-column>-->
      <!--<el-table-column
        prop="totalprice"
        header-align="center"
        align="center"
        label="订单总价">
      </el-table-column>-->
      <el-table-column
        prop="jifen"
        header-align="center"
        align="center"
        label="兑换积分">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="订单状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" >待付款</el-tag>
          <el-tag v-if="scope.row.status === 2" >待发货</el-tag>
          <el-tag v-if="scope.row.status === 3" >待收货</el-tag>
          <el-tag v-if="scope.row.status === 4" >待评价</el-tag>
          <el-tag v-if="scope.row.status === 5" >已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="addressid"
        header-align="center"
        align="center"
        label="收货地址">
        <template slot-scope="scope">
          <el-button type="primary" @click="shouhuoHandle(scope.row.addressid)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsid"
        header-align="center"
        align="center"
        label="订单商品">
        <template slot-scope="scope">
          <el-button type="primary" @click="shangpinHandle(scope.row.goodsid, scope.row.guigeid)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="guigename"
        header-align="center"
        align="center"
        label="规格">
      </el-table-column>
      <el-table-column
        prop="goodsnum"
        header-align="center"
        align="center"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="beizhu"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="creattime"
        header-align="center"
        align="center"
        label="下单时间">
      </el-table-column>
      <el-table-column
        prop="kuaidi"
        header-align="center"
        align="center"
        label="快递公司名称">
      </el-table-column>
      <el-table-column
        prop="kuaidino"
        header-align="center"
        align="center"
        label="快递单号">
      </el-table-column>
     <!-- <el-table-column
        prop="fukuantime"
        header-align="center"
        align="center"
        label="付款时间">
      </el-table-column>-->
      <el-table-column
        prop="fahuotime"
        header-align="center"
        align="center"
        label="发货时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('dsh:order:fahuo') && scope.row.status === 2" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">发货</el-button>
          <el-span v-if="scope.row.status !== 2" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">无操作</el-span>
          <el-button v-if="isAuth('dsh:order:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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

    <!--收货地址 -->
    <shouhuo v-if="shouhuoVisible" ref="shouhuo" @refreshDataList="getDataList"></shouhuo>
    <!--商品详情 -->
    <shangpin v-if="shangpinVisible" ref="shangpin" @refreshDataList="getDataList"></shangpin>

  </div>
</template>

<script>
  import AddOrUpdate from './order-add-or-update'
  import Shouhuo from './address-add-or-update'
  import Shangpin from './goods-info'

  export default {
    data () {
      return {
        searchForm: {
          page: 1,
          limit: 10,
          orderno: '',
          nicename: '',
          name: ''
        },
        dataList: [],
        totalPage: 0,
        shouhuoVisible: false,
        shangpinVisible: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate, Shouhuo, Shangpin
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: '/dsh/order/list1',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'orderno': this.searchForm.orderno,
            'nicename': this.searchForm.nicename,
            'category': 1,
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
      // 收货地址详情
      shouhuoHandle (id) {
        this.shouhuoVisible = true
        this.$nextTick(() => {
          this.$refs.shouhuo.init(id)
        })
      },
      // 导出
      daochuHandle () {
        window.location.href = this.$http.BASE_URL + `/dsh/order/daochu?token=${this.$cookie.get('token')}&starttime=${this.searchForm.starttime}&endtime=${this.searchForm.endtime}&type=1`
        // window.open(this.$http.BASE_URL + `/clb/caiwu/excelOut?token=${this.$cookie.get('token')}&starttime=${this.searchForm.starttime}&endtime=${this.searchForm.endtime}`)
      },
      // 商品详情
      shangpinHandle (id, guigeid) {
        this.shangpinVisible = true
        this.$nextTick(() => {
          this.$refs.shangpin.init(id, guigeid)
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
            url: `/dsh/order/${ids}`,
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
