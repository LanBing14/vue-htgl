<template>
    <el-upload
        ref="uploader"
        :action="actionBaseUrl"
        :file-list="fileList"
        :list-type="listType"
        :file-type="fileType"
        :file-size="fileSize"
        :auto-upload="autoUpload"
        :on-preview="handlePreview"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :before-remove="beforeRemove"
        :show-file-list="showFileList"
        :data="postData"
        :limit="limit"
        :on-exceed="handleExceed"
        :on-change="change"
        :http-request="httpRequest"
        :multiple="multiple"
        :disabled="disabled"
        :class="{'upload-disabled': disabled}"
        class="upload-demo"
    >
        <template v-if="!disabled">
            <div>
                <img src="../../assets/enterprise-images/uoload.png" alt="" v-if="listType === 'picture-card'" style="vertical-align: top;">
                <slot v-else name="trigger">
                    <el-button type="primary">选择文件</el-button>
                </slot>
            </div>
            <div slot="tip" class="upload-tip">只能上传{{ fileType.replace(/,/g, '/') }}文件，且不超过{{ fileSize }}M</div>
        </template>
    </el-upload>
</template>

<script>
import { Message } from "element-ui";
import { Api_uploadCP, Api_fileUrl } from "@/api/baseApi";

export default {
    name: "Upload",
    model: { prop: "value", event: "change" },
    props: {
        value: {
            type: Array,
            default: () => []
        }, // 不需要主动传入，值是通过v-model注入
        list: Array, // 当前变化的附件值
        actionType: {
            // 附件的种类(all, doc, image, video)，属于图片或文档或视频或不限制
            type: String,
            default: () => "all"
        },
        autoUpload: {
            // 是否自动上传
            type: Boolean,
            default: () => true
        },
        postData: {
            // 上传时附带的额外参数
            type: Object,
            default: () => null
        },
        // 是否支持多选文件
        multiple: {
            type: Boolean,
            default: () => true
        },
        fileType: {
            // 附件后辍类型,","号分割
            type: String,
            default: () => ""
        },
        fileSize: {
            // 文件大小，默认单位M
            type: Number,
            default: () => 10
        },
        listType: {
            // 文件列表显示的风格类型
            type: String,
            default: () => "text" // text/picture/picture-card
        },
        disabled: Boolean,
        showFileList: {
            // 是否显示已上传的文件列表
            type: Boolean,
            default: () => true
        },
        limit: Number, // 最大上传个数
        tip: String, // 附件上传的提示
        success: Function, // 文件上传成功的回调
        remove: Function, // 文件移除之后的回调
        error: Function, // 文件上传失败的回调
        delAlert: {
            // 删除文件时是否进行提示确认
            type: Boolean,
            default: () => true
        },
        // 文件名称最大长度
        maxFileNameLength: {
            type: Number,
            default: 50
        }
    },
    data() {
        return {
            fileList: this.value, // 存放文件数据列表
            curUploadFileNum: -1, // 传递给后台的图片顺序
            dialogVisible: false, // 是否预览图的弹框
            dialogImageUrl: undefined, // 预览图的图片地址
            fileListUrls: []
        };
    },
    computed: {
        // 上传的服务器url
        actionBaseUrl: function() {
            let actionBaseUrl = Api_fileUrl();
            if (this.actionType === "doc") {
                actionBaseUrl += "doc/";
            } else if (this.actionType === "image") {
                actionBaseUrl += "image/";
            } else if (this.actionType === "video") {
                actionBaseUrl += "video/";
            }
            return actionBaseUrl;
        }
    },
    watch: {
        value(val) {
            this.fileList = val;
        }
    },
    methods: {
        // 获取当前上传的文件列表信息
        getListData() {
            return this.fileList;
        },
        // 上传成功
        handleSuccess(response, file, fileList) {},
        // 上传失败
        handleError(err) {
            Message({
                message: err,
                type: "error",
                duration: 3 * 1000
            });
        },
        // 上传进度
        // handleProgress(event, file, fileList) {
        //     this.uploading = true;
        // },
        // 文件上传发生变化
        change(file, fileList) {
            // this.fileList = fileList;
            fileList.forEach(item => {
                if (!item.url && item.response) {
                    item.url = item.response.url;
                }
            });
            this.emitChange(fileList);
        },
        // 文件移除
        handleRemove(file, fileList) {
            this.emitChange(fileList);
        },
        // 通知v-model改变value值
        emitChange(fileList) {
            this.$emit("change", fileList);
        },
        // 文件预览
        handlePreview(file) {
            if (file.status !== "success") {
                return;
            }
            this.$emit("onPreview",file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length +
                    fileList.length} 个文件`
            );
        },
        // 上传之前
        beforeUpload(file) {
            const {fileType, fileSize} = this;
            if (file.name.split('.')[0].length > this.maxFileNameLength) {
                this.$message.error(`文件名称长度不能大于${this.maxFileNameLength}!`);
                return false
            }
            if (fileType) {
                const h = file.name.split(".").pop();
                const typeFlag = this.isCurrFileType(h);
                if (!typeFlag) {
                    this.$message.error("上传的文件格式不正确！");
                    return false
                }
            }
            if (fileSize && file.size) {
                const isLtM = this.isValideFileSize(file.size);
                if (!isLtM) {
                    this.$message.error(`上传的文件大小不能超过 ${fileSize} MB!`);
                    return false
                }
            }
        },
        // 移除之前
        beforeRemove(file) {
            const h = file.name.split(".").pop();
            if (this.delAlert && this.isCurrFileType(h) && this.isValideFileSize(file.size) && file.name.split('.')[0].length < this.maxFileNameLength) {
                return this.$confirm(`确定移除 ${file.name}？`);
            }
        },
        // 清除文件
        clearFiles() {
            this.$refs.uploader.clearFiles();
        },
        // 判断是否是正确的文件格式
        isCurrFileType(type) {
            const { fileType } = this;
            if (!fileType) {
                return true;
            }
            const fileTypeArr = fileType.split(",");
            return fileTypeArr.indexOf(type) !== -1;
        },
        // 文件大小是否正确
        isValideFileSize(size) {
            if (!size) {
                return false;
            }
            return size / 1024 / 1024 <= this.fileSize;
        },
        // 主动提交文件
        submit() {
            this.$refs.uploader.submit();
        },
        // 自定义的上传事件
        httpRequest(p) {
            this.curUploadFileNum++;
            const newFormData = new FormData();
            newFormData.append("file", p.file);
            const onprogress = e => {
                if (e.total > 0) {
                    e.percent = (e.loaded / e.total) * 100;
                }
                p.onProgress(e);
            };
            return Api_uploadCP(this.actionBaseUrl + this.curUploadFileNum, newFormData, onprogress);
        }
    }
};
</script>

<style lang="scss">
.upload-demo {
    line-height: normal;
}

.upload-disabled .el-upload.el-upload--text {
    display: none;
}

.upload-tip {
    font-size: 12px;
    margin: 3px 0 10px;
    color: #aaa;

    p {
        margin: 0;
    }

    &:empty {
        display: none;
    }
}

.el-upload-list__item:first-child {
    margin-top: 0;
}
</style>
