import {userRequest} from '../baseApi'
import request from "@/utils/request";

// 人员设置 接口

/**
 * 分页获取合同管理列表 接口
 * @param pageNo 当前页.
 * @param pageSize 分页大小.
 * @param realName 姓名
 * @param phoneNo 手机号码
 * @param deptIds 部门id
 */
export function Api_GetPageList(pageNo, pageSize, realName, phoneNo, deptIds) {
    return userRequest({pageNo: pageNo, pageSize: pageSize, realName: realName,
            phoneNo: phoneNo, deptIds: deptIds}, "post",
        "xhsRest/getChildUserByPage");
}

/**
 * 删除接口
 * @param id
 * @return {*|Promise|Promise<unknown>}
 * @constructor
 */
export function Api_delete(id) {
    return userRequest({id: id}, "get",
        "xhsRest/deleteUser");
}

/**
 * 获取详情接口
 * @param id
 * @return {*|Promise|Promise<unknown>}
 * @constructor
 */
export function Api_getDetail(id) {
    return userRequest({id: id}, "get",
        "xhsRest/getChildUserById");
}

/**
 * 新增接口
 * @return {*|Promise|Promise<unknown>}
 * @constructor
 */
export function Api_save(realName, phoneNo, email, deptId,
                         role, viewPermission, editPermission) {
    return userRequest({realName: realName, phoneNo: phoneNo,
            email: email, deptId: deptId, role: role, viewPermission: viewPermission,
            editPermission: editPermission}, "post",
        "xhsRest/addUser");
}

/**
 * 编辑保存接口
 * @return {*|Promise|Promise<unknown>}
 * @constructor
 */
export function Api_saveEdit(id, realName, phoneNo, email, deptId,
                         role, viewPermission, editPermission) {
    return userRequest({id: id, realName: realName, phoneNo: phoneNo,
            email: email, deptId: deptId, role: role, viewPermission: viewPermission,
            editPermission: editPermission}, "post",
        "xhsRest/editUser");
}

/**
 * 启用/禁用 接口
 * @param id
 * @return {*|Promise|Promise<unknown>}
 * @constructor
 */
export function Api_enabled(userId, enabled) {
    return userRequest({userId: userId, enabled: enabled}, "get",
        "xhsRest/enabledUser");
}

// 获取树列表数据
export function Api_GetDepartmentTree() {
    return request("/user/center/department/getDepartmentList", {
        method: "get"
    });
}

// 获取部门详情
export function Api_GetDepartmentDetail(params) {
    return request("/user/center/department/getDepartmentById", {
        method: "get",
        params: params
    });
}

// 新增部门
export function Api_AddDepartment(params) {
    return request("/user/center/department/add", {
        method: "post",
        params: params
    });
}

// 编辑部门
export function Api_EditDepartment(params) {
    return request("/user/center/department/edit", {
        method: "post",
        params: params
    });
}

// 删除部门
export function Api_DelDepartment(params) {
    return request("/user/center/department/delete", {
        method: "get",
        params: params
    });
}
