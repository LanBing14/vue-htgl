import request from '@/utils/request';
import { fxb, upms } from '@/utils/variables';

// 获取我的订单列表
export function Api_FindOrderListByPage(params) {
	return request(`${upms}/pay/orders/page`, {
		method: 'get',
		params: params
	});
}

// 获取报告类型接口
export function Api_GetReportTypeList(params) {
	return request(`${fxb}/credit-report/report-types`, {
		method: 'get',
		params: params
	});
}

/**
 * 根据订单编号下载报告
 * @param orderNo 订单编号
 */
export function Api_DownloadFile(filePath) {
	window.open(process.env.VUE_APP_FILE_API + filePath);
}

// 信用修复 分页
export function Api_GetPageList(params) {
	return request('/user/center/fxbCreditRepairApplication/getPageList', {
		method: 'post',
		params: params
	});
}

// 取消 信用修复
export function Api_CancelApplication(params) {
	return request('/user/center/fxbCreditRepairApplication/cancelApplication', {
		method: 'get',
		params: params
	});
}

// 撤销订单
export function Api_DeleteOrder(id) {
	return request(`${upms}/pay/orders/${id}`, {
		method: 'delete'
	});
}

// 获取订单信息
export function Api_GetOrder(params) {
	return request('/user/center/order/getOrder', {
		method: 'get',
		params: params
	});
}

// 计算时间差，分钟
export function difference(date) {
	const now = new Date();
	return Math.ceil(now - new Date(date)) / 1000 / 60;
}

// 调用微信支付接口
export function Api_WXPay({ orderNo }) {
	return request(`${upms}/pay/wx/${orderNo}`, {
		method: 'post'
	});
}

// 二维码地址转成图片流
export function Api_WriterImage(params) {
	return request(`${upms}/pay/wx/image`, {
		method: 'get',
		params: params
	});
}

// 查询微信支付结果
export function Api_OrderQuery({ orderNo }) {
	return request(`${upms}/pay/wx/order/${orderNo}`, {
		method: 'get'
	});
}
