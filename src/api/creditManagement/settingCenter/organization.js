import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 获取部门
export function Api_GetDepartmentList() {
  return request(`/user/center/department/getDepartmentList`, {
    method: "get"
  });
}

// 根据部门获取人员
export function Api_GetChildUserByPage(params) {
  return request(`${fxb}/org-structure/getUserPage`, {
    method: "get",
    params
  });
}

// 添加部门
export function Api_AddDepartment(params) {
  return request(`/user/center/department/add`, {
    method: "post",
    params
  });
}

// 编辑部门
export function Api_EditDepartment(params) {
  return request(`/user/center/department/edit`, {
    method: "post",
    params
  });
}

// 删除部门
export function Api_DeleteDepartment(params) {
  return request(`/user/center/department/delete`, {
    method: "get",
    params
  });
}

// 添加人员
export function Api_AddUser(params) {
  return request(`/user/center/xhsRest/addUser`, {
    method: "post",
    params
  });
}
