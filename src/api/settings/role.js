import request from '@/utils/request';
import {upms as modelBase} from '@/utils/variables';

// 查询角色列表
export function Api_RolesFetchList(params) {
    return request(`${modelBase}/system/roles/page`, {
        method: 'get',
        params
    });
}

// 查询角色菜单权限树
export function Api_RolesGetPermissions(id, cancelToken) {
    return request(`${modelBase}/system/roles/${id}/permissions`, {
        method: 'get',
        cancelToken
    });
}

// 更新角色菜单权限树
export function Api_RolesUpdatePermissions(id, permissionIds) {
    return request(`${modelBase}/system/roles/${id}/permissions`, {
        method: 'post',
        dataForm: true,
        params: {
            permissionIds: permissionIds
        }
    });
}

// 获取单个角色户信息
export function Api_RolesDetail(id) {
    return request(`${modelBase}/system/roles/${id}`, {
        method: 'get'
    });
}

// 新增角色
export function Api_RolesAdd(params) {
    return request(`${modelBase}/system/roles`, {
        method: 'post',
        dataForm: true,
        params
    });
}

// 修改单个角色信息
export function Api_RolesUpdate(id, params) {
    return request(`${modelBase}/system/roles/${id}`, {
        method: 'put',
        dataForm: true,
        params
    });
}

// 删除单个角色信息
export function Api_RolesDel(id) {
    return request(`${modelBase}/system/roles/${id}`, {
        method: 'delete'
    });
}
