import {userRequest} from './baseApi'

/**
 * 分页获取 信用教师 列表 接口
 * @param pageNo 当前页.
 * @param pageSize 分页大小.
 */
export function Api_GetPageList(pageNo, pageSize) {
    return userRequest({
            pageNo: pageNo, pageSize: pageSize
        }, "get",
        "fxbTeacher/tourist/getPageList");
}

/**
 * 获取教师 详情
 * @param teacherId
 * @return {*|Promise|Promise<unknown>}
 * @constructor
 */
export function Api_GetDetail(teacherId) {
    return userRequest({teacherId: teacherId}, "get", "fxbTeacher/tourist/getTeacherById")
}

/**
 * 通过教师id 获取教师 课程列表
 * @param teacherId
 * @param pageNo
 * @param pageSize
 * @return {*|Promise|Promise<unknown>}
 * @constructor
 */
export function Api_GetCourseList(teacherId, pageNo, pageSize) {
    return userRequest({teacherId: teacherId, pageNo: pageNo, pageSize: pageSize},
        "get", "fxbTeacher/tourist/getCoursePageList")
}
