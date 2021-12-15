import request from '@/utils/request';
import { upms as modelBase } from '@/utils/variables';

// 查询部门列表
export function Api_DepartmentsFetchList(params) {
	return request(`${modelBase}/system/departments/page`, {
		method: 'get',
		params
	});
}

// 查询部门树
export function Api_DepartmentsFetchTree(ignoreId) {
	return request(`${modelBase}/system/departments/tree`, {
		method: 'get',
		params: {
			ignoreId
		}
	});
}

// 查询部门树-带父级
export function Api_DepartmentsFetchTreeParent(ignoreId) {
	return request(`${modelBase}/system/departments/treeHaveParent`, {
		method: 'get',
		params: {
			ignoreId
		}
	});
}

// 新增部门
export function Api_DepartmentsAdd(params) {
	return request(`${modelBase}/system/departments`, {
		method: 'post',
		dataForm: true,
		params
	});
}

// 修改部门
export function Api_DepartmentsUpdate(id, params) {
	return request(`${modelBase}/system/departments/${id}`, {
		method: 'put',
		dataForm: true,
		params
	});
}

// 删除部门
export function Api_DepartmentsDel(id) {
	return request(`${modelBase}/system/departments/${id}`, {
		method: 'delete'
	});
}

// 获取用户列表
export function Api_DepartmentUserList(params) {
	return request(`${modelBase}/system/users/page`, {
		method: 'get',
		params
	});
}

// 获取单个用户信息
export function Api_UserDetail(id) {
	return request(`${modelBase}/system/users/${id}`, {
		method: 'get'
	});
}

// 新增用户
export function Api_UserAdd(params) {
	return request(`${modelBase}/system/users`, {
		method: 'post',
		dataForm: true,
		params
	});
}

// 修改单个用户信息
export function Api_UserUpdate(id, params) {
	return request(`${modelBase}/system/users/${id}`, {
		method: 'put',
		dataForm: true,
		params
	});
}

// 删除单个用户信息
export function Api_UserDel(ids) {
	return request(`${modelBase}/system/users/${ids}`, {
		method: 'delete'
	});
}

// 更改用户启用/停用状态
export function Api_UserChangeStatus(status, id) {
	const urlKind = !status ? 'enable' : 'disable';
	return request(`${modelBase}/system/users/${urlKind}/${id}`, {
		method: 'patch'
	});
}
