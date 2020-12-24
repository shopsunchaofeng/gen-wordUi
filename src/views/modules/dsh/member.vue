<template>
  <div class="mod-member">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="昵称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('dsh:member:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('dsh:member:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
          <!--  <el-table-column
        prop="uid"
        header-align="center"
        align="center"
        label="微信uid">
      </el-table-column>-->
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="nicename"
        header-align="center"
        align="center"
        label="昵称">
      </el-table-column>
      <el-table-column
        prop="image"
        header-align="center"
        align="center"
        label="头像">
        <template slot-scope="scope">
          <img v-if="scope.row.image" :src="scope.row.image" min-width="60" height="60" @click="handleImgView(scope.$index, scope.row.image)"/>
        </template>
      </el-table-column>
     <!-- <el-table-column
        prop="sid"
        header-align="center"
        align="center"
        label="上级id">
      </el-table-column>
      <el-table-column
        prop="ssid"
        header-align="center"
        align="center"
        label="上上级id">
      </el-table-column>-->
      <el-table-column
        prop="identity"
        header-align="center"
        align="center"
        label="身份">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.identity === '1'">消费者</el-tag>
          <el-tag v-if="scope.row.identity === '2'">产销商</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isfordden"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isfordden === '1'">启用状态</el-tag>
          <el-tag v-if="scope.row.isfordden === '2'">禁用状态</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="account"
        header-align="center"
        align="center"
        label="账户余额">
      </el-table-column>
      <el-table-column
        prop="jifen"
        header-align="center"
        align="center"
        label="积分值">
      </el-table-column>
      <el-table-column
        prop="zfbname"
        header-align="center"
        align="center"
        label="支付宝姓名">
      </el-table-column>
      <el-table-column
        prop="zhifubao"
        header-align="center"
        align="center"
        label="支付宝账号">
      </el-table-column>
      <el-table-column
        prop="idcardname"
        header-align="center"
        align="center"
        label="身份证名字">
      </el-table-column>
      <el-table-column
        prop="idcard"
        header-align="center"
        align="center"
        label="身份证号">
      </el-table-column>
      <el-table-column
        prop="idcardz"
        header-align="center"
        align="center"
        label="身份证正面照片">
        <template slot-scope="scope">
          <img v-if="scope.row.idcardz" :src="scope.row.idcardz" min-width="60" height="60" @click="handleImgView(scope.$index, scope.row.idcardz)"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="idcardf"
        header-align="center"
        align="center"
        label="身份证反面照片">
        <template slot-scope="scope">
          <img v-if="scope.row.idcardf" :src="scope.row.idcardf" min-width="60" height="60" @click="handleImgView(scope.$index, scope.row.idcardf)"/>
        </template>
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
      <!--<el-table-column
        prop="times"
        header-align="center"
        align="center"
        label="提现次数">
      </el-table-column>-->
      <el-table-column
        prop="creattime"
        header-align="center"
        align="center"
        label="注册时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('dsh:member:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改用户信息</el-button>
          <el-button v-if="isAuth('dsh:member:xiaofei')" type="text" size="small" @click="xiaofeiHandle(scope.row.id)">消费记录</el-button>
          <el-button v-if="isAuth('dsh:member:jifen')" type="text" size="small" @click="jifenHandle(scope.row.id)">积分收益记录</el-button>
          <el-button v-if="isAuth('dsh:member:yongjin')" type="text" size="small" @click="yongjinHandle(scope.row.id)">佣金收益记录</el-button>
          <el-button v-if="isAuth('dsh:member:jinyong') && scope.row.isfordden === '1'" type="text" size="small" @click="isjinyongHandle(scope.row.id, 2)">禁用</el-button>
          <el-button v-if="isAuth('dsh:member:qiyong') && scope.row.isfordden === '2'" type="text" size="small" @click="isjinyongHandle(scope.row.id, 1)">启用</el-button>
          <el-button v-if="isAuth('dsh:member:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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

    <!-- 消费记录 -->
    <xiaofeijilu v-if="xiaofeiVisible" ref="xiaofeijilu" @refreshDataList="getDataList"></xiaofeijilu>
    <!-- 积分收益记录 -->
    <jifenjilu v-if="jifenVisible" ref="jifenjilu" @refreshDataList="getDataList"></jifenjilu>
    <!-- 佣金收益记录 -->
    <yongjinjilu v-if="yongjinVisible" ref="yongjinjilu" @refreshDataList="getDataList"></yongjinjilu>

    <el-dialog :visible.sync="dialogImgVisible">
      <img width="100%" :src="imageView" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import AddOrUpdate from './member-add-or-update'
  import Jifenjilu from './jifenjilu'
  import Yongjinjilu from './yongjinjilu'
  import Xiaofeijilu from './xiaofeijilu'

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
        dialogImgVisible: false,
        xiaofeiVisible: false,
        yongjinVisible: false,
        jifenVisible: false,
        imageView: '',
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate, Xiaofeijilu, Jifenjilu, Yongjinjilu
    },
    activated () {
      this.getDataList()
    },
    methods: {
      handleImgView (index, discernPhoto) {
        this.imageView = discernPhoto
        this.dialogImgVisible = true
      },
      // 获取数据列表
      getDataList () {
        this.$http({
          url: '/dsh/member/list',
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
      // 积分收益记录
      jifenHandle (id) {
        this.jifenVisible = true
        this.$nextTick(() => {
          this.$refs.jifenjilu.getDataList(id)
        })
      },
      // 积分收益记录
      yongjinHandle (id) {
        this.yongjinVisible = true
        this.$nextTick(() => {
          this.$refs.yongjinjilu.getDataList(id)
        })
      },

      // 消费记录
      xiaofeiHandle (id) {
        this.xiaofeiVisible = true
        this.$nextTick(() => {
          this.$refs.xiaofeijilu.getDataList(id)
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 是否禁用
      isjinyongHandle (id, isfordden) {
        this.$http({
          url: `/dsh/member/jinyong`,
          method: `post`,
          data: {
            id: id,
            isfordden: isfordden
          }
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
            url: `/dsh/member/${ids}`,
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
