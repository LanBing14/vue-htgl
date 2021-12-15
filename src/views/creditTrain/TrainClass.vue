<template>
    <div>
        <el-row :gutter="10" class="train-list-title">
            <el-col :span="12">
                <h2 class="fxb-333 font24">培训班级</h2>
            </el-col>
            <el-col :span="12" align="right">
                <el-button type="primary" size="default" @click="courseClick()">培训课程</el-button>
                <el-button type="default" size="default" @click="teacherClick()">信用教师</el-button>
            </el-col>
        </el-row>

        <el-row class="fxb-table-tool" id="pageView">
            <el-form>
                <el-form-item label="培训专题：" class="fxb-tag-list">
                    <span
                        :class="{'active':postData.trainClass === ''}"
                        @click="getPageList({trainClass: ''})"
                    >全部</span>
                    <span
                        :class="{'active':postData.trainClass === '1'}"
                        @click="getPageList({trainClass: '1'})"
                    >行政处罚信用修复培训</span>
                    <span
                        :class="{'active':postData.trainClass === '0'}"
                        @click="getPageList({trainClass: '0'})"
                    >黑名单信用修复培训</span>
                </el-form-item>
            </el-form>
        </el-row>

        <div class="class-panel">
            <el-row :gutter="52" v-loading="listLoading">
                <el-col :span="8" v-for="( item, index ) in pageList" :key="index">
                    <el-card shadow="hover" class="class-item" @click.native="infoClick(item)">
                        <div class="img-box">
                            <img class="item-cover" :src="item.CLASS_COVER" alt />
                        </div>
                        <h3>{{ (item.CLASS_NAME.length > 48 ) ? (item.CLASS_NAME.substring(0,48) + '...') : item.CLASS_NAME }}</h3>
                        <ul>
                            <li>
                                <h4>{{ item.courseNum }}</h4>
                                <span>课时</span>
                            </li>
                            <li>
                                <h4>{{ item.trainMember }}</h4>
                                <span>学员</span>
                            </li>
                            <li>
                                <h4 class="blue">￥{{ item.TRAIN_PRICE }}</h4>
                                <span>价格</span>
                            </li>
                        </ul>
                    </el-card>
                </el-col>
            </el-row>

            <el-pagination
                class="fxb-page nobod"
                v-show="totalRecords > 0"
                :total="totalRecords"
                :page-sizes="[12, 24, 36, 48]"
                :page-size="postData.pageSize"
                :current-page.sync="postData.pageNo"
                @size-change="handleSizeChange"
                @current-change="changeCurrentPage"
                layout="total, sizes, prev, pager, next, jumper"
            />
        </div>
    </div>
</template>

<script>
import { getUserInfo } from "@/utils/auth";
import { Api_GetClassListByPage } from "@/api/creditTrain";

export default {
    data() {
        return {
            userInfo: getUserInfo(),
            listLoading: false,
            pageList: [],
            postData: {
                trainClass: "",
                trainType: "2",
                trainStatus: "1",
                pageNo: 0,
                pageSize: 12
            },
            totalRecords: 1
        };
    },
    computed: {},
    mounted() {
        this.getPageList();
    },
    methods: {
        getPageList(option) {
            this.listLoading = true;
            Api_GetClassListByPage(Object.assign(this.postData, option)).then(
                res => {
                    this.listLoading = false;
                    if (res.stateCode === "1") {
                        const data = res.data;
                        this.pageList = data.list;
                        this.totalRecords = data.totalRecords;
                    } else {
                        this.$message.error("数据加载失败");
                    }
                }
            );
        },
        handleSizeChange(val) {
            this.getPageList({ pageSize: val });
            // 分页过后回到顶部
            this.$el.querySelector("#pageView").scrollIntoView();
        },
        changeCurrentPage() {
            this.getPageList();

            // 分页过后回到顶部
            this.$el.querySelector("#pageView").scrollIntoView();
        },
        courseClick() {
            this.$router.push({
                path: "/creditTrain/trainCourse"
            });
        },
        teacherClick() {
            this.$router.push({
                path: "/creditTeacherList"
            });
        },
        infoClick(item) {
            this.$router.push({
                path: "/trainClass/classInfo",
                query: {
                    id: item.ID,
                    type: "1"
                }
            });
        }
    }
};
</script>

<style lang="scss">
.class-item {
    .el-card__body {
        padding: 0;
    }
}
</style>

<style lang="scss" scoped>
.blue {
    color: #20a0ff;
}
.class-panel {
    background-color: #fff;
    padding: 44px 45px 41px 45px;
    margin-bottom: 25px;
}

.fxb-page {
    margin-top: 0;
}

.class-item {
    margin-bottom: 52px;
    cursor: pointer;

    .img-box {
        width: 100%;
        height: 245px;
        overflow: hidden;
    }

    &:hover img {
        transform: scale(1.1);
        transition: all 0.2s linear;
    }
}

.class-item h3 {
    font-size: 14px;
    height: 82px;
    border-bottom: 1px dashed #ddd;
    padding-top: 25px;
    padding-bottom: 22px;
    margin: 0 15px;
    text-overflow: ellipsis;
    overflow: hidden;
    // white-space: nowrap;
    word-wrap: break-word;
}

.class-item ul {
    overflow: hidden;
}

.class-item ul li {
    width: 33.33%;
    float: left;
    padding: 12px 0;
    text-align: center;
}

.class-item li h4 {
    padding-bottom: 12px;
}

.fxb-tag-list span {
    display: inline-block;
    line-height: 30px;
    padding: 0 10px;
    border-radius: 5px;
    margin-right: 20px;
    cursor: pointer;
}

.fxb-tag-list span:first-child.active {
    color: #20a0ff;
}

.fxb-tag-list span:not(:first-child):hover,
.fxb-tag-list span:not(:first-child).active {
    color: #fff;
    background-color: #20a0ff;
}

#pageView {
    background-color: #fff;
    padding: 24px 45px 3px 45px;
    border-bottom: 1px solid #f8f8f8;
}
</style>
