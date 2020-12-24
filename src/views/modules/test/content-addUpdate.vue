<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :close-on-press-escape="false"
    :fullscreen="true"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="160px"
      label-position="left"
      size="medium"
    >
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="定级单位" prop="danwei">
              <el-input v-model="dataForm.danwei" placeholder="请填写定级单位"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="单位地址" prop="danweiaddress">
              <el-cascader
                size="medium"
                :options="options"
                v-model="dataForm.danweiaddress"
                @change="handleChange"
                separator=" "
              ></el-cascader>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="单位负责人" prop="fuze">
              <el-input v-model="dataForm.fuze" placeholder="请填写单位负责人"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="职务/职称" prop="zhicheng">
              <el-input v-model="dataForm.zhicheng" placeholder="职务/职称"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="单位互联网IP地址段" prop="ipdizhi">
              <el-input v-model="dataForm.ipdizhi" placeholder="请填写单位互联网IP地址段（多个用逗号隔开）"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="系统总数量" prop="systemnumber">
              <el-select v-model="dataForm.systemnumber" placeholder="请选择系统总数量" size="medium ">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
                <el-option label="5" value="5"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="line"></div>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="单位负责人"></el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="请填写办公电话" prop="bangongphone">
              <el-input v-model="dataForm.bangongphone" placeholder="请填写办公电话"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="电子邮件" prop="bangongemail">
              <el-input v-model="dataForm.bangongemail" placeholder="电子邮件"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="责任部门" prop="zerenbumen">
              <el-input v-model="dataForm.zerenbumen" placeholder="请填写责任部门"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="职务/职称" prop="zhiwuname">
              <el-input v-model="dataForm.zhiwuname" placeholder="职务/职称"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="line"></div>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="责任部门联系人"></el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="负责人姓名" prop="fuzhename">
              <el-input v-model="dataForm.fuzhename" placeholder="负责人姓名"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="移动电话" prop="yiidongphone">
              <el-input v-model="dataForm.yiidongphone" placeholder="移动电话"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="办公电话" prop="fuzephone">
              <el-input v-model="dataForm.fuzephone" placeholder="办公电话"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="电子邮件" prop="fuzemail">
              <el-input v-model="dataForm.fuzemail" placeholder="电子邮件"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="line"></div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="隶属关系" prop="lsgx">
            <el-select v-model="dataForm.lsgx" placeholder="请选择隶属关系" size="medium">
              <el-option label="中央" value="01d"></el-option>
              <el-option label="省(自治区、直辖市)" value="02d"></el-option>
              <el-option label="地(区、市、州、盟)" value="03d"></el-option>
              <el-option label="县（区、市、旗）" value="04d"></el-option>
              <el-option label="其他" value="05d"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.lsgx=='05d'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="其他" prop="qita1">
              <el-input v-model="dataForm.qita1" placeholder="其他隶属关系"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="单位类型" prop="dwlx">
            <el-select v-model="dataForm.dwlx" placeholder="请选择单位类型" size="medium">
              <el-option label="党委机关" value="06d"></el-option>
              <el-option label="政府机关" value="07d"></el-option>
              <el-option label="事业单位" value="08d"></el-option>
              <el-option label="企业" value="09d"></el-option>
              <el-option label="其他" value="10d"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.dwlx=='10d'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="其他" prop="qita2">
              <el-input v-model="dataForm.qita2" placeholder="其他单位类型"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="行业类别" prop="hylb" class="hylb">
            <el-radio-group v-model="dataForm.hylb">
              <el-radio disabled label="11d">电信</el-radio>
              <el-radio disabled label="12d">广电</el-radio>
              <el-radio disabled label="13d">经营性公众互联网</el-radio>
              <el-radio disabled label="14d">铁路</el-radio>
              <el-radio disabled label="15d">银行</el-radio>
              <el-radio disabled label="16d">海关</el-radio>
              <el-radio disabled label="17d">税务</el-radio>
              <el-radio disabled label="18d">民航</el-radio>
              <el-radio disabled label="19d">电力</el-radio>
              <el-radio disabled label="20d">证券</el-radio>
              <el-radio disabled label="21d">保险</el-radio>
              <el-radio disabled label="22d">国防科技工业</el-radio>
              <el-radio disabled label="23d">公安</el-radio>
              <el-radio disabled label="24d">人事劳动和社会保障</el-radio>
              <el-radio disabled label="25d">财政</el-radio>
              <el-radio disabled label="26d">审计</el-radio>
              <el-radio disabled label="27d">商业贸易</el-radio>
              <el-radio disabled label="28d">国土资源</el-radio>
              <el-radio disabled label="29d">能源</el-radio>
              <el-radio disabled label="30d">交通</el-radio>
              <el-radio disabled label="31d">统计</el-radio>
              <el-radio disabled label="32d">工商行政管理</el-radio>
              <el-radio disabled label="33d">邮政</el-radio>
              <el-radio label="34d">教育</el-radio>
              <el-radio disabled label="35d">文化</el-radio>
              <el-radio disabled label="36d">卫生</el-radio>
              <el-radio disabled label="37d">农业</el-radio>
              <el-radio disabled label="38d">水利</el-radio>
              <el-radio disabled label="39d">外交</el-radio>
              <el-radio disabled label="40d">发展改革</el-radio>
              <el-radio disabled label="41d">科技</el-radio>
              <el-radio disabled label="42d">宣传</el-radio>
              <el-radio disabled label="43d">质量监督检验检疫</el-radio>
              <el-radio disabled label="44d">其他</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.hylb=='44d'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="其他" prop="qita3">
              <el-input v-model="dataForm.qita3" placeholder="其他行业类别"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { regionData, CodeToText } from "element-china-area-data";
export default {
  data() {
    var isqita1 = (rule, value, callback) => {
      console.log("isqita1", rule, value, callback);
      if (this.dataForm.lsgx == "05d") {
        if (value === "") {
          callback(new Error("请输入其他隶属关系"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isqita2 = (rule, value, callback) => {
      console.log("isqita2", rule, value, callback);
      if (this.dataForm.dwlx == "10d") {
        if (value === "") {
          callback(new Error("请输入其他单位类型"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isqita3 = (rule, value, callback) => {
      console.log("isqita3", rule, value, callback);
      if (this.dataForm.hylb == "44d") {
        if (value === "") {
          callback(new Error("请输入其他行业类别"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    // 验证手机
    let checkPhone = (rule, value, callback) => {
      let reg = /^1[345789]\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入11位手机号"));
      } else {
        callback();
      }
    };
    // 验证固话
    let checkGuhua = (rule, value, callback) => {
      let reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的固定电话"));
      } else {
        callback();
      }
    };
    // 验证邮箱
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    return {
      visible: false,
      options: regionData,
      selectedOptions: [],
      dataForm: {
        id: 0,
        danwei: "",
        danweiaddress: [],
        fuze: "",
        zhicheng: "",
        ipdizhi: "",
        systemnumber: "",
        bangongphone: "",
        bangongemail: "",
        zerenbumen: "",
        zhiwuname: "",
        fuzhename: "",
        yiidongphone: "",
        fuzephone: "",
        fuzemail: "",
        lsgx: "",
        dwlx: "",
        hylb: "",
        qita1: "",
        qita2: "",
        qita3: "",
      },
      dataRule: {
        danwei: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        danweiaddress: [
          { required: true, message: "单位地址不能为空", trigger: "blur" },
        ],
        fuze: [
          { required: true, message: "单位负责人不能为空", trigger: "blur" },
        ],
        zhicheng: [
          { required: true, message: "职称不能为空", trigger: "blur" },
        ],
        ipdizhi: [
          {
            required: true,
            message: "单位互联网IP地址段不能为空",
            trigger: "blur",
          },
        ],
        systemnumber: [
          { required: true, message: "系统总数量不能为空", trigger: "blur" },
        ],
        bangongphone: [
          { required: true, message: "办公电话不能为空", trigger: "blur" },
          {
            type: "number",
            validator: checkGuhua,
            message: "请输入正确的固定电话格式",
            trigger: ["blur", "change"],
          },
        ],
        bangongemail: [
          { required: true, message: "电子邮件不能为空", trigger: "blur" },
          {
            type: "number",
            validator: checkEmail,
            message: "请输入正确的邮箱格式",
            trigger: ["blur", "change"],
          },
        ],
        zerenbumen: [
          { required: true, message: "责任部门不能为空", trigger: "blur" },
        ],
        zhiwuname: [
          { required: true, message: "职务不能为空", trigger: "blur" },
        ],
        fuzhename: [
          { required: true, message: "负责人姓名不能为空", trigger: "blur" },
        ],
        yiidongphone: [
          { required: true, message: "移动电话不能为空", trigger: "blur" },
          {
            type: "number",
            validator: checkPhone,
            message: "请输入11位有效手机号号码",
            trigger: ["blur", "change"],
          },
        ],
        fuzephone: [
          { required: true, message: "办公电话不能为空", trigger: "blur" },
          {
            type: "number",
            validator: checkGuhua,
            message: "请输入正确的固定电话格式",
            trigger: ["blur", "change"],
          },
        ],
        fuzemail: [
          { required: true, message: "电子邮件不能为空", trigger: "blur" },
          {
            type: "number",
            validator: checkEmail,
            message: "请输入正确的邮箱格式",
            trigger: ["blur", "change"],
          },
        ],
        lsgx: [{ required: true, message: "请选择隶属关系", trigger: "blur" }],
        dwlx: [{ required: true, message: "请选择单位类型", trigger: "blur" }],
        hylb: [{ required: true, message: "请选择行业类别", trigger: "blur" }],
        qita1: [{ validator: isqita1, trigger: "blur" }],
        qita2: [{ validator: isqita2, trigger: "blur" }],
        qita3: [{ validator: isqita3, trigger: "blur" }],
      },
    };
  },
  methods: {
    handleChange() {
      var locCode = "";
      var loc = "";
      for (let i = 0; i < this.dataForm.danweiaddress.length; i++) {
        loc += CodeToText[this.dataForm.danweiaddress[i]];
      }
      console.log(this.dataForm.danweiaddress);
      console.log(loc);
    },
    getAddText(add) {
      var loc = "";
      for (let i = 0; i < this.dataForm.danweiaddress.length; i++) {
        loc += CodeToText[this.dataForm.danweiaddress[i]];
      }
      return loc;
    },
    init(id) {
      this.dataForm.id = id || "";
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: `/gen/danwei/info/${this.dataForm.id}`,
            method: "get",
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.dataForm = data.data;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      var that = this;
      console.log(that.getAddText(that.dataForm.danweiaddress));

      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          that.dataForm.province = CodeToText[that.dataForm.danweiaddress[0]];
          that.dataForm.city = CodeToText[that.dataForm.danweiaddress[1]];
          that.dataForm.district = CodeToText[that.dataForm.danweiaddress[2]];
          for (var i = 0; i < that.dataForm.danweiaddress[2].length; i++) {
            var name = "xz" + (i + 1);
            that.dataForm[name] = that.dataForm.danweiaddress[2].substring(
              i,
              i + 1
            );
          }
          that.dataForm.xingzheng = that.dataForm.danweiaddress[2];
          that.dataForm.youzheng = findPostCode(
            that.dataForm.province,
            that.dataForm.city,
            that.dataForm.district
          );
          for (var i = 0; i < that.dataForm.xingzheng.length; i++) {
            var num = "x" + (i + 1);
            that.dataForm[num] = that.dataForm.xingzheng[i];
          }
          for (var i = 0; i < that.dataForm.youzheng.length; i++) {
            var num = "y" + (i + 1);
            that.dataForm[num] = that.dataForm.youzheng[i];
          }
          for (var i = 0; i < that.dataForm.youzheng.length; i++) {
            var name = "yb" + (i + 1);
            that.dataForm[name] = that.dataForm.youzheng.substring(i, i + 1);
          }
          var formdata = new Object();
          formdata.danwei = that.dataForm.danwei;
          formdata.systemnumber = that.dataForm.systemnumber;
          formdata.systemsnumber = that.dataForm.systemnumber;
          formdata.fuze = that.dataForm.fuze;
          formdata.danweiaddress = that.getAddText(that.dataForm.danweiaddress);
          formdata.bangongphone = that.dataForm.bangongphone;
          formdata.basedagouparam = [];
          formdata.basedagouparam.push(that.dataForm.lsgx);
          formdata.basedagouparam.push(that.dataForm.dwlx);
          formdata.basedagouparam.push(that.dataForm.hylb);
          formdata.qita1 = that.dataForm.qita1;
          formdata.qita2 = that.dataForm.qita2;
          formdata.qita3 = that.dataForm.qita3;
          that.dataForm.danweiaddress = that.getAddText(
            that.dataForm.danweiaddress
          );
          formdata.basedagouparam = JSON.stringify(formdata.basedagouparam);
          formdata.publicparam = JSON.stringify(that.dataForm);
          console.log(formdata);
          that
            .$http({
              url: `/gen/danwei`,
              method: `${!that.dataForm.id || 0 ? "post" : "put"}`,
              data: formdata,
            })
            .then(({ data }) => {
              if (data && data.code === 200) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                });
                this.$refs["dataForm"].resetFields();
                that.visible = false;
                that.$emit("refreshDataList");
              }
            });
        }
      });
    },
  },
};
</script>
<style scope>
.line {
  width: 100%;
  height: 2px;
  background-color: #eee;
  margin-bottom: 22px;
}
.hylb {
  width: 100%;
}
.hylb .el-radio {
  width: 140px;
  margin: 0 30px 20px;
}
</style>