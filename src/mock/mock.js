import Mock from 'mockjs' // 引入mockjs

const Random = Mock.Random // Mock.Random 是一个工具类，用于生成各种随机数据

const dataList = [] // 用于接受生成数据的数组

for (let i = 0; i < 31; i++) { // 可自定义生成的个数

  const template = {

    'time': Random.date(), // 生成一个随机日期,可加参数定义日期格式

    'title': Random.paragraph(2, 5), // 生成2至5个句子的文本

    'name': Random.name(), // 生成姓名

    "isTrue" : Boolean(Math.round(Math.random())),
     "id" : Random.date()

  }

  dataList.push(template)

}

// list 分页接口()

Mock.mock('http://localhost:9529/api/list', 'post', (params) => {

  var info = JSON.parse(params.body)

  var [index, size, total] = [info.pageIndex, info.pageSize, dataList.length]

  var len = total / size

  var totalPages = len - parseInt(len) > 0 ? parseInt(len) + 1 : len

  var newDataList = dataList.slice(index * size, (index + 1) * size)

  return {

    'code': '0',

    'message': 'success',

    'data': {

      'pageIndex': index,

      'pageSize': size,

      'rows': newDataList,

      'total': total,

      'totalPages': totalPages

    }

  }

})