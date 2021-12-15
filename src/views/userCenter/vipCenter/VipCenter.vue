<template>
    <div class="vipCenter">
        <el-form
            ref="ref_form"
            v-model="form"
            label-width="90px"
            style="margin-top: 15px"
        >
            <el-form-item label="会员等级：">
                {{ form.mvName || "-" }}
                <span
                    class="canClick"
                    style="margin-left: 10px"
                    @click="gotoBuy()"
                    >会员权限</span
                >
            </el-form-item>
            <el-form-item label="到期时间：">
                {{ form.mvEndTime ? $dateFormat(form.mvEndTime) : "-" }}
                <span
                    v-if="form.mvName === '基础版试用'"
                    class="canClick"
                    style="margin-left: 10px"
                    @click="openVip()"
                    >开通会员</span
                >
                <span
                    v-if="form.mvName === '企业版' || form.mvName === '专业版'"
                    class="canClick"
                    style="margin-left: 10px"
                    @click="reNew()"
                    >续费</span
                >
                <span
                    v-if="form.mvName === '企业版'"
                    class="canClick"
                    style="margin-left: 10px"
                    @click="upgradeLevel()"
                    >升级会员</span
                >
            </el-form-item>
        </el-form>
        <TableWrapper ref="ref_table" :data="tableData" :columns="tableCol"     :tableProps="{class: 'fxb-table'}"   />
        <OpenVip ref="ref_OpenVip" @getVipInfo="getVipInfo"></OpenVip>
    </div>
</template>

<script>
import OpenVip from "./OpenVip";
import {
    Api_versionEdit,
    Api_versionPage,
    Api_versionProducts,
    Api_versionOrder,
    Api_versionPermissions,
    Api_versionPermissionsG,
    Api_getMemberInfos,
    Api_versionRenewalOrder,
    Api_versionUpgradeOrder
} from "@/api/userCenter/vip.js";
import router from "@/router";

export default {
    name: "VipCenter",
    components: { OpenVip },
    data() {
        return {
            form: {},
            tableData: [],
            tableCol: [
                { label: "会员等级", key: "mvName",width:140 },
                {
                    label: "有效期始",
                    key: "mvBeginTime",
                    render: (h, data, row) =>
                        data ? this.$dateFormat(data) : "-"
                },
                {
                    label: "到期时间",
                    key: "mvEndTime",
                    render: (h, data, row) =>
                        data ? this.$dateFormat(data) : "-"
                },
                {
                    label: "当前状态",
                    key: "versionStatus",
                    render: (h, data, row) =>
                        data === "1"
                            ? "待生效"
                            : data === "2"
                            ? "生效中"
                            : data === "3"
                            ? "已到期"
                            : "-"
                }
            ]
        };
    },
    mounted() {
        this.getVipInfo();
    },
    methods: {
        getVipInfo() {
            const loading = this.$openLoading();
            Api_getMemberInfos()
                .then(res => {
                    this.tableData = res;
                    this.form = res[0];
                    loading.close();
                })
                .catch(res => {
                    loading.close();
                });
        },
        gotoBuy() {
            this.$router.push({ path: "/buy" });
            // const newpage = router.resolve({ path: "/buy" });
            // window.open(newpage.href, "_self");
        },
        openVip() {
            this.$refs.ref_OpenVip.open();
        },
        reNew() {
            if (this.form.mvName === "企业版") {
                this.$refs.ref_OpenVip.open("1", this.form.mvEndTime);
            } else if (this.form.mvName === "专业版") {
                this.$refs.ref_OpenVip.open("2", this.form.mvEndTime);
            }
        },
        upgradeLevel() {
            this.$alert("系统暂不支持升级会员！", "提示", {
                confirmButtonText: "确定",
                type: "warning"
            });
            // this.$refs.ref_OpenVip.open("2", this.form.mvEndTime, "1");
        }
    }
};
</script>

<style lang="scss">
.vipCenter{
  .el-table--fit{
        border-bottom: 1px solid #ebeef5; 
  }
}

</style>

