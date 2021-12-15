// 发货管理
export default {
	shippingManagement: () => ({
		component: () => import('@/views/blank'),
		meta: { title: '发货管理', icon: 'dashboard' }
	}),
	pendingOrders: () => ({
		component: () => import('@/views/creditManagement/shippingManagement/pendingOrders/index'),
		meta: { title: '待发货订单' }
	}),
	shippingTracking: () => ({
		name: 'shippingTracking',
		component: () => import('@/views/creditManagement/shippingManagement/shippingTracking/index'),
		meta: { title: '发货跟踪' }
	}),
	abnormalShipment: () => ({
		component: () => import('@/views/creditManagement/shippingManagement/abnormalShipment/index'),
		meta: { title: '异常发货处理' }
	}),
	overstayShipment: () => ({
		name: 'overstayShipment',
		component: () => import('@/views/creditManagement/shippingManagement/overstayShipment/index'),
		meta: { title: '超额度超账期发货' }
	})
};
