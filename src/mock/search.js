import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const ResultList = []
const count = 100
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
const PageSize = Mock.mock('@integer(1, 100)')
const TotalRecords = Mock.mock('@integer(0, 1000)')
const PageNo = Mock.mock('@integer(1, 50)')

for (let i = 0; i < count; i++) {
    ResultList.push(Mock.mock({
        "id": '23e3d5cd718faa3b5ba1632305af3a29',
        "address": "我是测试地址我是测试地址我是测试地址我是测试地址",
        "belongOrg": "登记机关",
        "checkDate": "发照日期",
        "city": "所属城市",
        "creditCode": "统一社会信用代码",
        "econKind": "企业类型",
        "email": '邮箱',
        "endDate": '吊销日期',
        "englishName": '英文名',
        "industry": "行业",
        "industryCode": "行业代码",
        "keyNo": "23e3d5cd718faa3b5ba1632305af3a29",
        "name": "@title(5, 10)",
        "no": "注册号",
        "operName": "法人",
        "orgNo": '组织机构代码',
        "originalName": '曾用名',
        "phoneNumber": "电话",
        "province": "所属省份",
        "registCapi": "注册资本",
        "scope": "经营范围",
        "startDate": "成立日期",
        "status": "企业状态",
        "subIndustry": "所属行业大类",
        "subIndustryCode": "所属行业大类代码",
        "teamEnd": "营业结束日期",
        "termStart": "营业开始日期",
        "updatedDate": "更新日期",
        "created_date": "数据创建时间",
        "is_expired": "false",
        "regist_capi": "注册资本",
        "regist_capi_desc": "注册资本万元",
        "startyear": "2017",
        "tmImageUrl": image_uri,
        "isTaxCredit": '传真',
        "website": '网站'
    }))
}
// ResultList.push({ name: 'mockPan' })

export default {
    searchUser: config => {
        // const { name } = param2Obj(config.url)
        const Result = ResultList;
        // const Result = ResultList.filter(item => {
        // const lowerCaseName = item.name.toLowerCase()
        // if (name && lowerCaseName.indexOf(name.toLowerCase()) < 0) {
        //     return false
        // }
        // return true
        // })
        return { PageSize, TotalRecords, PageNo, Result }
    }
}
