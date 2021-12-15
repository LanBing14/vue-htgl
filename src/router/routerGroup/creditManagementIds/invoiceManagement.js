// 发票管理
export default {
	invoiceManagement: () => ({
		component: () => import('@/views/blank'),
		meta: { title: '发票管理', icon: 'dashboard' }
	}),
	invoiceList: () => ({
		name: 'invoiceList',
		component: () => import('@/views/creditManagement/invoiceManagement/invoiceList/index'),
		meta: { title: '发票管理' }
	}),
	invoiceTracking: () => ({
		component: () => import('@/views/creditManagement/invoiceManagement/invoiceTracking/index'),
		meta: { title: '发票跟踪' }
	})
};
