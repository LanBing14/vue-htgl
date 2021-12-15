import request from "@/utils/request";
import {upms} from '@/utils/variables';

// 获取培训班详情信息
export function Api_GetTrainById(params) {
    return request("/user/center/fxbCreditRepairTrain/tourist/getTrainById", {
        method: "get",
        params: params
    });
}

// 根据培训班ID获取培训课程
export function Api_GetCoursesByTrainId(params) {
    return request(
        "/user/center/fxbCreditRepairTrain/tourist/getCoursesByTrainId",
        {
            method: "get",
            params: params
        }
    );
}

// 根据培训班ID获取考试信息
export function Api_GetExaminationByTrainId(params) {
    return request(
        "/user/center/fxbCreditRepairTrain/tourist/getExaminationByTrainId",
        {
            method: "get",
            params: params
        }
    );
}

// 信用修复培训申请
export function Api_RepairApplicatSave(params) {
    return request("/user/center/fxbCreditRepairApplication/save", {
        method: "post",
        params: params
    });
}

// 获取课程分类
export function Api_GetDicts(params) {
    return request("/user/center/xhsRest/common/getDicts", {
        method: "get",
        params: params
    });
}

// 分页获取课程列表
export function Api_GetPageList(params) {
    return request("/user/center/fxbCourse/tourist/getPageList", {
        method: "get",
        params: params
    });
}

// 根据课程ID获取教师信息
export function Api_GetTeacherByCourseId(params) {
    return request("/user/center/fxbCourse/tourist/getTeacherByCourseId", {
        method: "get",
        params: params
    });
}

// 获取课程详情信息
export function Api_GetCourseById(params) {
    return request("/user/center/fxbCourse/tourist/getCourseById", {
        method: "get",
        params: params
    });
}

// 根据课程ID查询课时列表
export function Api_GetLessonsByCourseId(params) {
    return request("/user/center/fxbCourse/tourist/getLessonsByCourseId", {
        method: "get",
        params: params
    });
}

// 课程申请
export function Api_ApplyCourse(params) {
    return request("/user/center/fxbCourse/applyCourse", {
        method: "post",
        params: params
    });
}

// 获取 首页 热度培训班
export function Api_GetIndexTrainClass(params) {
    return request("/user/center/fxbCreditRepairTrain/tourist/getHotList", {
        method: "get",
        params: params
    });
}

// 获取 首页 热度培训课程
export function Api_GetIndexTrainCourse(params) {
    return request("/user/center/fxbCourse/tourist/getHotList", {
        method: "get",
        params: params
    });
}

// 获取 首页 热度培训老师
export function Api_GetIndexTrainTeacher(params) {
    return request("/user/center/fxbTeacher/tourist/getHotList", {
        method: "get",
        params: params
    });
}

// 获取教师详情
export function Api_GetTeacherById(params) {
    return request("/user/center/fxbTeacher/tourist/getTeacherById", {
        method: "get",
        params: params
    });
}

// 获取用户中心-学习记录
export function Api_GetLearnPageList(params) {
    return request(`${upms}/training/courses/learning/published-page`, {
        method: "get",
        params: params
    });
}

// 分页查询班级列表
export function Api_GetClassListByPage(params) {
    return request('/user/center/fxbCreditRepairTrain/tourist/getClassListByPage', {
        method: 'get',
        params: params
    });
}

// 获取 课程/培训班 视频 详情 接口
export function Api_LessonManagementGetDetail(params) {
    return request('/user/center/fxbLessonManagement/getDetail', {
        method: 'get',
        params: params
    });
}

// 更新 视频学习 进度 接口
export function Api_LessonManagementUpdateLearn(params) {
    return request(`${upms}/training/learning`, {
        method: 'post',
        dataForm: true,
        params: params
    });
}

// 完成视频学习 接口
export function Api_LessonManagementCompleteLearn(params) {
    return request('/user/center/fxbUserLessonLearning/completeLearn', {
        method: 'get',
        params: params
    });
}

// 分页查询已发布培训课程
export function Api_CoursesPublishedPage(params) {
    return request(`${upms}/training/courses/published-page`, {
        method: 'get',
        params: params
    });
}

// 读取单个已发布培训课程信息
export function Api_CoursesPublishedDetail(id) {
    return request(`${upms}/training/courses/published/${id}`, {
        method: 'get'
    });
}

// 读取单个已发布课时信息
export function Api_CoursesPublishedLessonDetail(id) {
    return request(`${upms}/training/courses/published-lesson/${id}`, {
        method: 'get'
    });
}

// 查询单个培训讲师信息
export function Api_TeachersDetail(id) {
    return request(`${upms}/training/teachers/${id}`, {
        method: 'get'
    })
}

// 获取个人课时学习进度
export function Api_VideoTime(id) {
    return request(`${upms}/training/learning/self/${id}`, {
        method: 'get'
    })
}
