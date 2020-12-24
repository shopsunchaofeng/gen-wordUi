<template>
  <div class="mod-version">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="版本号" clearable></el-input>
      </el-form-item>
      <el-select v-model="searchForm.type" class="filter-item" clearable placeholder="类型">
        <el-option
          v-for="item in dataSourcelist"
          :key="item.value"
          :label="item.name"
          :value="item.value"/>
      </el-select>
      <!--<el-date-picker v-model="searchForm.startTime" class="filter-item" style="width: 130px;"
                      type="date"
                      placeholder="有效开始日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
      </el-date-picker>~
      <el-date-picker v-model="searchForm.endTime" class="filter-item" style="width: 130px;"
                      type="date"
                      placeholder="有效截至日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
      </el-date-picker>-->
     <!-- <el-form-item label="">
        <el-checkbox v-model="searchForm.active">活跃用户</el-checkbox>
      </el-form-item>-->
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('clb:version:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('clb:version:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <!--<el-button v-if="isAuth('shop:desk:downqrcode')" type="" @click="downqrcodeHandle()" :disabled="dataListSelections.length <= 0">批量下载二维码</el-button>-->
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
        prop="versionno"
        header-align="center"
        align="center"
        label="版本号">
      </el-table-column>
      <el-table-column
        prop="version"
        header-align="center"
        align="center"
        label="版本">
      </el-table-column>
      <el-table-column
        prop="downurl"
        header-align="center"
        align="center"
        label="下载链接">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1">ios</el-tag>
          <el-tag v-else-if="scope.row.type === 2">android</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="content2"
        header-align="center"
        align="center"
        label="版本说明">
        <template slot-scope="scope">
          <el-button type="primary" @click="aommonShowFucontentHandle(scope.row.id,2)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="creattime"
        header-align="center"
        align="center"
        label="创建时间">
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
          <el-button v-if="isAuth('clb:version:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('clb:version:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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

<!--设置金额等的页面开始-->
 <!-- <div class="mod-businessrule">
    <el-form ref="form" :model="form" :rules="dataRule" @keyup.enter.native="onSubmit" label-width="100px" >
      <el-form-item label="金额" prop="price">
        <el-col :span="8">
          <el-input v-model="form.price" placeholder="消费多少金额得1积分" type="number" :min="0"></el-input>
          <el-tag >消费多少金额得1积分</el-tag>
        </el-col>
      </el-form-item>
      <el-form-item label="积分有效期">
        <el-switch v-model="validDateSwitchStatus" @change="validDateSwitch" inactive-text="非永久" active-text="永久"></el-switch>
      </el-form-item>
      <el-form-item label="有效天数" v-show="dayShowStatus" prop="expireDay">
        <el-col :span="8">
          <el-input type="number" @blur="expireDayBlureToZero" v-model="form.expireDay" placeholder="请输入积分有效天数"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="积分抵现">
        <el-switch v-model="pointCreditSwitchStatus" @change="pointCreditSwitch" inactive-text="不开启" active-text="开启"></el-switch>
      </el-form-item>
      <el-form-item label="积分设置" v-show="numShowStatus" prop="pointNum">
        <el-col :span="8">
          <el-input type="number" @blur="pointNumBlureToZero" v-model="form.pointNum" placeholder="多少积分抵1元"></el-input>
          <el-tag >多少积分抵1元</el-tag>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>-->
  <!--设置金额等的页面结束-->
</template>

<script>
  import AddOrUpdate from './version-add-or-update'
  import CommonShowFucontent from './common-show-fucontent'

  export default {
    data () {
      return {
        searchForm: {
          page: 1,
          limit: 10,
          type: 0,
          name: ''
        },
        dataList: [],
        dataSourcelist: [{value: 0, name: '全部'}, {value: 1, name: 'ios'}, {value: 2, name: 'android'}],
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
          url: '/clb/version/list',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'name': this.searchForm.name,
            'type': this.searchForm.type
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
      aommonShowFucontentHandle (id, i) {
        this.commonShowFucontentVisible = true
        this.$nextTick(() => {
          this.$refs.commonShowFucontent.init(id, '/clb/version/info', i)
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
            url: `/clb/version/${ids}`,
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
  // 设置设置金额的页面的js开始
  // export default {
  //   data () {
  //     return {
  //       form: {
  //         id: '',
  //         price: '',
  //         expireType: 1,
  //         expireDay: 1,
  //         pointCredit: 0,
  //         pointNum: 1
  //       },
  //       pointCreditSwitchStatus: false,
  //       validDateSwitchStatus: false,
  //       dayShowStatus: false,
  //       numShowStatus: false,
  //       dataRule: {
  //         price: [
  //           {required: true, message: '金额不能为空', trigger: 'blur'},
  //           {
  //             validator (rule, value, callback) {
  //               var reg = /^-?\d{1,9}(?:\.\d{1,2})?$/
  //               if (reg.test(value)) {
  //                 callback()
  //               } else {
  //                 callback(new Error('请输入正确的价格！'))
  //               }
  //             },
  //             trigger: 'blur'
  //           }
  //         ],
  //         expireDay: [
  //           {required: true, message: '天数不能为空', trigger: 'blur'},
  //           {
  //             validator (rule, value, callback) {
  //               if (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) < 999999999) {
  //                 callback()
  //               } else {
  //                 callback(new Error('请输入1-9位的正整数'))
  //               }
  //             },
  //             trigger: 'blur'
  //           }
  //         ],
  //         pointNum: [
  //           {required: true, message: '积分不能为空', trigger: 'blur'},
  //           {
  //             validator (rule, value, callback) {
  //               if (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) < 999999999) {
  //                 callback()
  //               } else {
  //                 callback(new Error('请输入1-9位的正整数'))
  //               }
  //             },
  //             trigger: 'blur'
  //           }
  //         ]
  //       }
  //     }
  //   },
  //   activated () {
  //     this.getData()
  //   },
  //   methods: {
  //     // 获取数据列表
  //     getData () {
  //       let that = this
  //       this.$http({
  //         url: '/id/businessrule/getDataByShop',
  //         method: 'get'
  //       }).then(({data}) => {
  //         if (data && data.code === 200) {
  //           if (data.data !== undefined) {
  //             that.form.id = data.data.id
  //             that.form.price = data.data.price
  //             that.form.expireType = data.data.expireType
  //             that.form.expireDay = data.data.expireDay
  //             that.form.pointCredit = data.data.pointCredit
  //             that.form.pointNum = data.data.pointNum
  //             if (that.form.expireType === 1) {
  //               that.dayShowStatus = false
  //               that.validDateSwitchStatus = true
  //             } else {
  //               that.dayShowStatus = true
  //             }
  //             if (that.form.pointCredit === 1) {
  //               that.numShowStatus = true
  //               that.pointCreditSwitchStatus = true
  //             } else {
  //               that.numShowStatus = false
  //             }
  //           }
  //         } else {
  //         }
  //       })
  //     },
  //     onSubmit () {
  //       let that = this
  //       this.$refs['form']
  //         .validate((valid) => {
  //           if (valid) {
  //             this.$http({
  //               url: `/id/businessrule`,
  //               method: `post`,
  //               data: that.form
  //             }).then(({data}) => {
  //               if (data && data.code === 200) {
  //                 this.$message({
  //                   message: '操作成功',
  //                   type: 'success',
  //                   duration: 1500
  //                 })
  //               } else {
  //               }
  //             })
  //           }
  //         })
  //     },
  //     validDateSwitch () {
  //       if (this.validDateSwitchStatus) {
  //         this.form.expireType = 1
  //         this.dayShowStatus = false
  //       } else {
  //         this.form.expireType = 0
  //         this.dayShowStatus = true
  //       }
  //     },
  //     pointCreditSwitch () {
  //       if (this.pointCreditSwitchStatus) {
  //         this.form.pointCredit = 1
  //         this.numShowStatus = true
  //       } else {
  //         this.form.pointCredit = 0
  //         this.numShowStatus = false
  //       }
  //     },
  //     pointNumBlureToZero () {
  //       if (this.form.pointNum === '') {
  //         this.form.pointNum = 1
  //       }
  //     },
  //     expireDayBlureToZero () {
  //       if (this.form.expireDay === '') {
  //         this.form.expireDay = 1
  //       }
  //     }
  //   }
  // }
// 设置金额等的页面js结束
</script>
