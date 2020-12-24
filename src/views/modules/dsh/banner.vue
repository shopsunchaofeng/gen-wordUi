<template>
  <div class="mod-banner">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="isAuth('dsh:banner:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('dsh:banner:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="imageurl"
        header-align="center"
        align="center"
        label="banner图片">
            <template slot-scope="scope">
              <img v-if="scope.row.imageurl" :src="scope.row.imageurl" min-width="60" height="60" @click="handleImgView(scope.$index, scope.row.imageurl)"/>
            </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="跳转类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '1'">不跳转</el-tag>
          <el-tag v-if="scope.row.type === '2'">跳转到图文详情</el-tag>
          <el-tag v-if="scope.row.type === '3'">跳转到指定商品</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsid"
        header-align="center"
        align="center"
        label="跳转商品对应的商品id">
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="图片对应的富文本内容">
        <template slot-scope="scope">
          <el-button type="primary" @click="aommonShowFucontentHandle(scope.row.id)">查看</el-button>
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
          <el-button v-if="isAuth('dsh:banner:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('dsh:banner:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <el-dialog :visible.sync="dialogImgVisible">
      <img width="100%" :src="imageView" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import AddOrUpdate from './banner-add-or-update'
  import CommonShowFucontent from '../clb/common-show-fucontent'

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
        imageView: '',
        dialogImgVisible: false,
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
          url: '/dsh/banner/list',
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
      handleImgView (index, discernPhoto) {
        this.imageView = discernPhoto
        this.dialogImgVisible = true
      },
      // 弹框
      aommonShowFucontentHandle (id) {
        this.commonShowFucontentVisible = true
        this.$nextTick(() => {
          this.$refs.commonShowFucontent.init(id, '/dsh/banner/info', 0)
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
            url: `/dsh/banner/${ids}`,
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
