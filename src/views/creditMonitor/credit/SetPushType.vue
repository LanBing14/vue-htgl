<template>
  <el-row>
    <el-col :span="24" class="set-way">
   
      <ul id="pushTypeBox">
        <li v-loading="loadingPhone"  element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
          <h3>
            <span class="name">短信通知</span>
            <el-switch
              v-model="smsNotify"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              :active-value="0"
              :inactive-value="-1"
              :disabled="setPhoneDisabled"
              @change="changePhoneSwitchStatus"
            ></el-switch>
          </h3>
          <el-col :span="24">
            <el-form :model="pushInfo1" ref="pushForm1" :rules="pushRules1" :inline="true">
              <el-form-item label="手机号码" prop="mobile">
                <el-input
                  v-model.lazy="pushInfo1.mobile"
                  :value="pushInfo1.mobile"
                  placeholder="请输入11位手机号码"
                  style="width:250px;"
                  size="small"
                  @change="submitPhone('pushForm1')"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <p>开启后，监测企业触发预警规则时，系统将推送相关信息到指定手机</p>
        </li>
        <li v-loading="loadingEmail"  element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
          <h3>
            <span class="name">邮件通知</span>
            <el-switch
              v-model="emailNotify"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              :active-value="0"
              :inactive-value="-1"
              :disabled="setEmailDisabled"
              @change="changeEmailSwitchStatus"
            ></el-switch>
          </h3>
          <el-col :span="24">
            <el-form :model="pushInfo2" ref="pushForm2" :rules="pushRules2" :inline="true">
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model.lazy="pushInfo2.email"
                  :value="pushInfo2.email"
                  placeholder="请输入邮箱"
                  style="width:250px;"
                  size="mini"
                  @change="submitEmail('pushForm2')"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <p>开启后，监测企业处罚预警规则时，系统将推送相关信息到指定邮箱</p>
        </li>
      </ul>
    </el-col>
  </el-row>
</template>

<script>
import { isNull } from "@/utils/commonUtils";
import { patterns } from "@/utils/variables";
import { Api_SavePushWay, Api_ChangePushWay, Api_GetPushWay } from "@/api/creditMonitor";

export default {
  name: "SetPushType",
  data() {
    const validateEmail = (rule, value, callback) => {
      if (isNull(value)) {
        callback(new Error("请输入邮箱"));
      } else if (!patterns.email.test(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    return {
      smsNotify: -1,
      emailNotify: -1,
      monitorTypes: [],
      // 短信推送信息
      pushInfo1: {
        id: "",
        mobile: "",
      },
      // 邮箱推送信息
      pushInfo2: {
        id: "",
        email: "",
      },
      // 检测集合
      pushRules1: {
        mobile: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号",
          },
        ],
      },
      pushRules2: {
        email: [
          {
            validator: validateEmail,
            trigger: "blur",
          },
        ],
      },
      validPhone: false,
      validEmail: false,
      loadingPhone: false,
      loadingEmail: false,
    };
  },
  computed: {
    setPhoneDisabled: function () {
      return !(this.validPhone && this.pushInfo1.mobile !== "");
    },
    setEmailDisabled: function () {
      return !(this.validEmail && this.pushInfo2.email !== "");
    },
  },
  watch: {
    validEmail: {
      handler: function () {},
      immediate: true,
    },
  },
  // 初始化数据
  mounted() {
    // 获取推送方式
    this.getPushWay();
  },
  methods: {
    getPushWay() {
      Api_GetPushWay().then((res) => {
        if (res) {
          this.pushInfo1.id = this.pushInfo2.id = res.id;
          this.pushInfo1.mobile = res.mobile;
          this.pushInfo2.email = res.email;

          // 根据返回的推送方式复写状态
          if (res.pushWay) {
            if (res.pushWay.includes("mobile")) {
              this.smsNotify = 0;
            }
            if (res.pushWay.includes("email")) {
              this.emailNotify = 0;
            }
          }

          if (res.mobile) {
            this.validPhone = true;
          }
          if (res.email) {
            this.validEmail = true;
          }
        }
      });
    },
    submitPhone(formName) {
      this.$refs[formName].validate((valid) => {
        this.validPhone = valid;
        if (valid) {
          this.loadingPhone = true;
          Api_SavePushWay({
            mobile: this.pushInfo1.mobile,
            pushWay: "mobile",
          })
            .then((res) => {
              this.loadingPhone = false;
              this.$message.success("保存手机号码成功");
              this.getPushWay();
            })
            .catch((e) => {
              this.loadingPhone = false;
              this.$message.error("保存手机号码失败");
            });
        }
      });
    },
    submitEmail(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingEmail = true;
          this.validEmail = valid;
          Api_SavePushWay({
            email: this.pushInfo2.email,
            pushWay: "email",
          })
            .then((res) => {
              this.loadingEmail = false;
              this.$message.success("保存邮箱成功");
              this.getPushWay();
            })
            .catch((e) => {
              this.loadingEmail = false;
              this.$message.error("保存邮箱失败");
            });
        }
      });
    },
    changePhoneSwitchStatus() {
      if (this.validPhone) {
        Api_ChangePushWay({
          supervisePushId: this.pushInfo1.id,
          status: this.smsNotify, // 状态 0启用 -1 禁用
          pushWay: "mobile", // mobile/email
        })
          .then((res) => {
            this.$message.success("修改成功");
          })
          .catch((e) => {
            this.$message.error("修改失败");
          });
      }
    },
    changeEmailSwitchStatus() {
      if (this.validEmail) {
        Api_ChangePushWay({
          supervisePushId: this.pushInfo2.id,
          status: this.emailNotify, // 状态 0启用 -1 禁用
          pushWay: "email", // mobile/email
        })
          .then((res) => {
            this.$message.success("修改成功");
          })
          .catch((e) => {
            this.$message.error("修改失败");
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#pushTypeBox {
  display: flex;
  justify-content: space-between;
  margin: 0 -15px;

  li {
    margin: 15px 15px;
    padding: 18px 25px;
    height: 164px;
    flex: 1;
    border: 1px solid #f0f2f7;

    h3 {
      overflow: hidden;
      margin-bottom: 20px;

      .name {
        font-size: 18px;
        color: #5f7b9a;
      }

      .el-switch {
        float: right;
      }
    }

    p {
      color: #888888;
      line-height: 30px;
      min-height: 60px;
    }
  }
}
</style>
