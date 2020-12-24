<template>
  <el-dialog
    title="积分记录"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div class="mod-order">
      <el-table
        :data="dataList"
        border
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          prop="creattime"
          header-align="center"
          align="center"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="zjifen"
          header-align="center"
          align="center"
          label="总积分">
        </el-table-column>
        <el-table-column
          prop="jifen"
          header-align="center"
          align="center"
          label="积分">
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
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        searchForm: {
          page: 1,
          limit: 10,
          orderno: '',
          nicename: '',
          name: ''
        },
        dataList: [],
        memberid: '',
        totalPage: 0,
        shouhuoVisible: false,
        shangpinVisible: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    methods: {
      // 获取数据列表
      getDataList (memberid) {
        this.memberid = memberid
        this.visible = true
        this.$http({
          url: '/dsh/member/jshouyilist',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'memberid': memberid
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
      // 商品详情
      shangpinHandle (id, guigeid) {
        this.shangpinVisible = true
        this.$nextTick(() => {
          this.$refs.shangpin.init(id, guigeid)
        })
      },
      // 导出
      daochuHandle () {
        window.location.href = this.$http.BASE_URL + `/dsh/order/daochu?token=${this.$cookie.get('token')}&starttime=${this.searchForm.starttime}&endtime=${this.searchForm.endtime}&type=2`
        // window.open(this.$http.BASE_URL + `/clb/caiwu/excelOut?token=${this.$cookie.get('token')}&starttime=${this.searchForm.starttime}&endtime=${this.searchForm.endtime}`)
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
