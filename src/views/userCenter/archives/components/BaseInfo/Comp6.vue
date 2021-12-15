<template>
  <div class="gqjg">
     <h4 class="flex cp-title-wrap">
      <span class="flex-primary  cp-title">其他附件</span>
    </h4>

   <el-row>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="附件" prop="fj">
            <div v-if="!isreadOnly">
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="3"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </div>
            <div v-else>

            </div>

        </el-form-item>
    </el-form>
   </el-row>

  </div>
</template>

<script type="text/jsx">

export default {
  name: "Comp6",
  props: {
    baseInfo: {
      type: Object,
      default: () => ({}),
    },
    /**是不是只读 */
    isreadOnly:Boolean
  },
  data() {
    
    const createRules = this.$createRules;

    return {
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      form:{
        fj:''  //附件
      },
      rules:{
          // fj:createRules({msg:'附件',required:true})
        },

    };
  },
  mounted() {
   
  },
  methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
  }
};
</script>

