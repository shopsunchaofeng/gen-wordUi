<template>
  <el-dialog :title="'系统列表'+(!dataForm.id ? '' : '')" :close-on-click-modal="false" :visible.sync="visible">
    <span class="dialog-footer" v-if="dataList.length<systemNum">
      <el-button type="primary" @click="addSystem()">新增系统</el-button>
    </span>
    <el-table :data="dataList" border @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column prop="system" header-align="center" align="center" label="系统名称"></el-table-column>
      <!--  <el-table-column prop="tourudate" header-align="center" align="center" label="投入运行日期"></el-table-column>
      <el-table-column prop="kaifadanwei" header-align="center" align="center" label="开发单位"></el-table-column>
      <el-table-column prop="yewugaishu" header-align="center" align="center" label="业务概述"></el-table-column>
      <el-table-column prop="creattime" header-align="center" align="center" label="创建时间"></el-table-column>-->
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="changeSystem(scope.row.id)">修改</el-button>
          <el-button type="text" size="mini" @click="exportWord(scope.row.id,1)">导出备案表</el-button>
          <el-button type="text" size="mini" @click="exportWord(scope.row.id,2)">导出定级报告</el-button>
          <el-button type="text" size="mini" @click="yulanWord(scope.row.id, 2)">预览备案表</el-button>
          <el-button type="text" size="mini" @click="yulanWord(scope.row.id, 1)">预览定级报告</el-button>
          <el-button v-if="isAuth('gen:system:remove')" type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataList: [],
      systemNum: 0,
      hytype: "",//行业类型
      dataForm: {
        id: 0,
        gensystem: "",
        gencompany: "",
        dagou: "",
        tuse: "",
        updatetime: "",
        creattime: "",
      },
      dataRule: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    yulanWord(id, type) {
      this.$http({
        url: `/gen/system/getPath/${id}?type=${type}`,
        method: "GET",
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$emit("openYLWord", data.msg);
        }
      });
    },
    // 导出备案表
    exportWord(id, type) {
      console.log(
        this.$http.BASE_URL +
        `/gen/system/export?id=${id}&type=${type}&token=${this.$cookie.get(
          "token"
        )}`
      );
      // return false;
      window.location.href =
        this.$http.BASE_URL +
        `/gen/system/export?id=${id}&type=${type}&token=${this.$cookie.get(
          "token"
        )}`;
      //    window.location.href =
      // this.$http.BASE_URL + `/gen/system/export?id=${id}&type=${type}`;
    },
    addSystem(ind) {
      console.log(this.hytype);
      if (this.hytype == '37d' || this.hytype == '30d' || this.hytype == '44d' || this.hytype == '33d') {
        this.$nextTick(() => {
          this.$emit("openSystempath12", this.dataForm.id, '', this.hytype);
        });
      } else {
        this.$nextTick(() => {
          this.$emit("openSystempath1", this.dataForm.id, '', this.hytype);
        });
      }
    },
    // 每页数
    sizeChangeHandle(val) {
      this.searchForm.limit = val;
      this.searchForm.page = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.searchForm.page = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addUpdate.init(id);
      });
    },
    changeSystem(id) {
      console.log("iiiiiii1d", id);
      if (this.hytype == '37d' || this.hytype == '30d' || this.hytype == '44d' || this.hytype == '33d') {
      this.$nextTick(() => {
        this.$emit("openSystempath12", this.dataForm.id, id, this.hytype);
      });
      } else {
      this.$nextTick(() => {
        this.$emit("openSystempath1", this.dataForm.id, id, this.hytype);
      });
      }
    },
    init(id, num, hytype) {
      console.log("nu", num);
      var id = id || "";
      this.dataForm.id = id;
      this.visible = true;
      this.$nextTick(() => {
        if (id != "") {
          this.$http({
            url: `/gen/system/list`,
            params: {
              danweiid: id,
            },
            method: "get",
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.dataList = data.page.records;
              if (num) {
                this.systemNum = num;
              }
              if (num) {
                this.hytype = hytype;
              }
              this.$forceUpdate();
            }
          });
        }
      });
    },
    // 删除
    deleteHandle(id) {
      let ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
          return item.id;
        });
      this.$confirm(`确定对[id=${ids.join(",")}]进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: `/gen/system/${ids}`,
            method: "DELETE",
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });
              this.init(this.dataForm.id);
            }
          });
        })
        .catch(() => { });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: `/gen/content`,
            method: `${!this.dataForm.id || 0 ? "post" : "put"}`,
            data: this.dataForm,
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });
              this.visible = false;
              this.$emit("refreshDataList");
            }
          });
        }
      });
    },
  },
};
</script>
