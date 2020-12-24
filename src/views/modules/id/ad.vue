<template>
  <div class="mod-ad">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-select v-model="searchForm.adPositionId" class="filter-item" clearable placeholder="广告位置">
        <el-option
            v-for="adPosition in adPositionList"
            :key="adPosition.id"
            :label="adPosition.name"
            :value="adPosition.id">
          </el-option>
      </el-select>
      <el-select v-model="searchForm.mediaType" class="filter-item" clearable placeholder="媒体类型">
        <el-option
          v-for="item in mediaTypeList"
          :key="item.value"
          :label="item.name"
          :value="item.value"/>
      </el-select>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('id:ad:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('id:ad:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="positionName"
        header-align="center"
        align="center"
        label="广告位置">
      </el-table-column>
      <el-table-column
        prop="mediaType"
        header-align="center"
        align="center"
        label="媒体类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.mediaType === 1">轮播</el-tag>
          <el-tag v-else-if="scope.row.mediaType === 2" >滑动</el-tag>
          <el-tag v-else-if="scope.row.mediaType === 3" >滚动</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="link"
        header-align="center"
        align="center"
        label="链接">
      </el-table-column>
      <el-table-column
        prop="imageUrl"
        header-align="center"
        align="center"
        label="显示图片">
        <template slot-scope="scope">
          <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" min-width="60" height="60" @click="handleImgView(scope.$index, scope.row.imageUrl)"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="展示内容">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        label="结束时间">
      </el-table-column>
      <el-table-column
        prop="enabled"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enabled === 1">启用</el-tag>
          <el-tag v-else-if="scope.row.enabled === 0" type="danger">禁用</el-tag>
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
          <el-button v-if="isAuth('id:ad:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('id:ad:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  import AddOrUpdate from './ad-add-or-update'

  export default {
    data () {
      return {
        searchForm: {
          page: 1,
          limit: 10,
          name: '',
          adPositionId: null,
          mediaType: null
        },
        dataList: [],
        totalPage: 0,
        dataListSelections: [],
        addOrUpdateVisible: false,
        adPositionList: [],
        mediaTypeList: [{value: 1, name: '轮播'}, {value: 2, name: '滑动'}, {value: 3, name: '滚动'}],
        dialogImgVisible: false,
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
        this.getAdPositionList()
        this.$http({
          url: '/id/ad/list',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'name': this.searchForm.name,
            'adPositionId': this.searchForm.adPositionId,
            'mediaType': this.searchForm.mediaType
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
            url: `/id/ad/${ids}`,
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
      getAdPositionList () {
        this.$http({
          url: `/id/adposition/list`,
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.adPositionList = data.page.records
          }
        })
      },
      handleImgView (index, discernPhoto) {
        this.imageView = discernPhoto
        this.dialogImgVisible = true
      }
    }
  }
</script>
