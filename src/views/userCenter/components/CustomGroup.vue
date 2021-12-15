<template>
    <div>
        <div>
            <el-row
                v-for="item in customGroup"
                :key="item.id"
                :gutter="10"
                v-show="item.groupType !== groupType"
                @mouseover.native="item.isFocus = true"
                @mouseout.native="item.isFocus = false"
            >
                <el-col :span="1">
                    <div class="green-circle"></div>
                </el-col>
                <el-col :span="15">
                    <el-input
                        v-show="item.isEditing"
                        :class="{ error: item.error, success: item.success }"
                        v-model="item.name"
                        :disabled="item.createBy === 'system'"
                        size="small"
                    >
                        <i
                            slot="suffix"
                            class="el-input__icon el-icon-loading"
                            v-show="item.loading"
                        ></i>
                        <i
                            slot="suffix"
                            class="el-input__icon el-icon-error"
                            v-show="item.error"
                        ></i>
                        <i
                            slot="suffix"
                            class="el-input__icon el-icon-success"
                            v-show="item.success"
                        ></i>
                    </el-input>
                    <span v-show="!item.isEditing" style="line-height: 32px">
                        {{ item.name }}
                    </span>
                </el-col>
                <el-col
                    :span="8"
                    v-show="
                        (item.isFocus && item.createBy !== 'system') ||
                            item.isEditing ||
                            item.isDeleting
                    "
                >
                    <el-button
                        type="primary"
                        icon="el-icon-edit"
                        size="small"
                        v-show="!item.isEditing"
                        @click="toEdit(item)"
                    ></el-button>
                    <el-button
                        style="margin-left: 0"
                        type="success"
                        icon="el-icon-check"
                        size="small"
                        v-show="item.isEditing"
                        :loading="item.loading"
                        @click="saveGroup(item)"
                    ></el-button>
                    <el-button
                        icon="el-icon-delete"
                        size="small"
                        :disabled="item.loading"
                        @click="deleteGroup(item)"
                        :loading="item.deleteLoading"
                    ></el-button>
                </el-col>
            </el-row>
        </div>
        <div class="footer">
            <span @click="addGroupInput">
                <i class="el-icon-circle-plus-outline"></i>新增
            </span>
        </div>
    </div>
</template>

<script>
import {
    Api_DeleteGroup,
    Api_EditGroup,
    Api_SaveGroup
} from "@/api/userCenter/creditManage";
import { uuid } from "@/utils";

export default {
    name: "CustomGroup",
    props: {
        groupType: ""
    },
    data() {
        return {
            customGroup: [],
            customPromise: []
        };
    },
    mounted: function() {
        console.log(this.groupType);
        // 将全局的企业分组复制一份用于页面编辑
        [...this.customGroup] = this.$store.getters.attentionGroup;
        this.customGroup.forEach(item => {
            this.$set(item, "isEditing", false);
            this.$set(item, "isDeleting", false);
            this.$set(item, "isOldGroup", true);
            this.$set(item, "loading", false);
            this.$set(item, "error", false);
            this.$set(item, "success", false);
            this.$set(item, "deleteLoading", false);
            this.$set(item, "isFocus", false);
        });
    },
    methods: {
        // 进入编辑状态
        toEdit(item) {
            item.isEditing = true;
        },
        // 自定义分组-添加分组输入框
        addGroupInput() {
            console.log(1);
            this.customGroup.push({
                id: uuid(),
                name: "",
                groupType: this.groupType,
                isEditing: true,
                isDeleting: false,
                isOldGroup: false,
                loading: false,
                error: false,
                success: false,
                deleteLoading: false,
                isFocus: true
            });
        },
        // 删除分组
        deleteGroup(group) {
            if (group.isOldGroup) {
                group.isDeleting = true;
                // 旧的分组，提交数据库
                this.$confirm("确认删除该分组吗？")
                    .then(() => {
                        const promise = new Promise((resolve, reject) => {
                            group.deleteLoading = true;
                            Api_DeleteGroup(group.id).then(res => {
                                resolve();
                                group.deleteLoading = false;
                                if (res.stateCode === "1") {
                                    this.customGroup = this.customGroup.filter(
                                        ({ id }) => id !== group.id
                                    );
                                    this.$message.success("删除分组成功");
                                } else if (res.stateCode === "70002") {
                                    this.$message.error(
                                        "删除分组失败，分组已被使用"
                                    );
                                } else {
                                    this.$message.error("删除分组失败");
                                }
                            });
                        });
                        this.customPromise.push(promise);
                    })
                    .catch(() => {
                        group.isDeleting = false;
                    });
            } else {
                this.customGroup = this.customGroup.filter(
                    ({ id }) => id !== group.id
                );
            }
        },
        // 保存分组名
        saveGroup(group) {
            group.loading = true;
            group.success = false;
            group.error = false;
            if (!group.name || !group.name.trim()) {
                group.loading = false;
                return;
            }
            if (group.name.trim().length > 10) {
                group.loading = false;
                group.error = true;
                this.$message.error("分组名称长度不能超过10");
                return;
            }
            group.name = group.name.trim();
            if (group.isOldGroup) {
                // 旧的分组，修改名称
                const promise = new Promise((resolve, reject) => {
                    Api_EditGroup({
                        name: group.name,
                        groupId: group.id
                    }).then(res => {
                        group.loading = false;
                        resolve();
                        if (res.stateCode === "1") {
                            group.success = true;
                            this.$message.success("修改分组成功");
                            this.exitEdit(group);
                        } else if (res.stateCode === "70001") {
                            group.error = true;
                            this.$message.error("修改分组失败，分组名称重复");
                        } else if (res.stateCode === "70003") {
                            // 修改的分组名称未发生改变，页面不修改
                            this.exitEdit(group);
                        } else {
                            group.error = true;
                            this.$message.error("修改分组失败");
                        }
                    });
                });
                this.customPromise.push(promise);
            } else {
                // 新的分组，保存分组
                const promise = new Promise((resolve, reject) => {
                    Api_SaveGroup(group.name, group.groupType).then(res => {
                        group.loading = false;
                        resolve();
                        if (res.stateCode === "1") {
                            group.success = true;
                            group.isOldGroup = true;
                            group.id = res.data.id;
                            this.$message.success("保存分组成功");
                            this.exitEdit(group);
                        } else if (res.stateCode === "70001") {
                            group.error = true;
                            this.$message.error("保存分组失败，分组名称重复");
                        } else {
                            group.error = true;
                            this.$message.error("保存分组失败");
                        }
                    });
                });
                this.customPromise.push(promise);
            }
        },
        // 编辑成功，退出编辑状态
        exitEdit(group) {
            group.isEditing = false;
            group.success = false;
            group.error = false;
        }
    }
};
</script>

<style lang="scss">
.error > .el-input__inner {
    border-color: #f56c6c;
}

.success > .el-input__inner {
    border-color: #67c23a;
}</style
><style lang="scss" scoped>
.el-row {
    margin-bottom: 7px;
    padding-bottom: 7px;
    border-bottom: 1px solid #eaedf4;

    &:last-child {
        margin-bottom: 0;
    }
}

.green-circle {
    margin: 12px 0;
    height: 7px;
    width: 7px;
    background: #0f8cf8;
    border-radius: 50%;
    border: 1px solid #0f8cf8;
}

.footer {
    text-align: center;
    padding-top: 15px;

    i {
        color: #bbb;
        margin-right: 5px;
    }

    span {
        cursor: pointer;
    }
}

.el-icon-error {
    color: #f56c6c;
}

.el-icon-success {
    color: #67c23a;
}
</style>
