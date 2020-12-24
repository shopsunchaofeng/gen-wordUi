<template>
  <div class="mod-channel">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('id:channel:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('id:channel:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="name"
        header-align="center"
        align="center"
        label="名称">
      </el-table-column>
            <el-table-column
        prop="displayType"
        header-align="center"
        align="center"
        label="显示区域">
        <template slot-scope="scope">
         <el-tag v-if="scope.row.displayType === 1">首页</el-tag>
          <el-tag v-else>其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="channelType"
        header-align="center"
        align="center"
        label="轮播类型">
        <template slot-scope="scope">
         <el-tag v-if="scope.row.channelType === 1">图片</el-tag>
         <el-tag v-else-if="scope.row.channelType === 2">视频</el-tag>
         <el-tag v-else-if="scope.row.channelType === 3">文字</el-tag>
         <el-tag v-else>其他</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="跳转地址">
      </el-table-column>
      <el-table-column
        prop="imageUrl"
        header-align="center"
        align="center"
        label="图片">
        <template slot-scope="scope">
          <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" min-width="60" height="60" @click="handleImgView(scope.$index, scope.row.imageUrl)"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="isShow"
        header-align="center"
        align="center"
        label="是否显示">
        <template slot-scope="scope">
         <el-tag v-if="scope.row.isShow === 1">显示</el-tag>
         <el-tag v-else-if="scope.row.isShow === 0">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="crtTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('id:channel:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('id:channel:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <el-dialog :visible.sync="dialogImgVisible">
      <img width="100%" :src="imageView" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import AddOrUpdate from './channel-add-or-update'

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
        addOrUpdateVisible: false,
        imageView: ''
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
          url: '/id/channel/list',
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
            url: `/id/channel/${ids}`,
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
      },
      handleImgView (index, discernPhoto) {
        this.imageView = discernPhoto
        this.dialogImgVisible = true
      }
    }
  }
</script>
