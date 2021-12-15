<!--<template>-->
<!--&lt;!&ndash;<ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>&ndash;&gt;-->
<!--<div class="editor-wrap">-->
<!--<textarea :id="editorId" rows="10" cols="80"></textarea>-->
<!--</div>-->

<!--</template>-->

<!--<script>-->
<!--import VueCkeditor from 'vue-ckeditor2';-->
<!--// import CKEDITOR from 'CKEDITOR';-->
<!--// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';-->
<!--export default {-->
<!--name: 'Ckeditor',-->
<!--components: { VueCkeditor },-->
<!--props: {-->
<!--id: {-->
<!--type: String,-->
<!--default: function () {-->
<!--return 'editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')-->
<!--}-->
<!--},-->
<!--value: {-->
<!--type: String,-->
<!--default: ''-->
<!--},-->
<!--height: {-->
<!--type: String,-->
<!--default: '300'-->
<!--}-->
<!--},-->
<!--data() {-->
<!--const {height} = this;-->
<!--return {-->
<!--editorInstances: undefined,-->
<!--editorId: this.id,-->
<!--hasChange: false,-->
<!--hasInit: false,-->

<!--// ckeditor的配置项-->
<!--config: {-->
<!--height: `${height}px`,-->
<!--width: '100%',-->
<!--toolbar: 'Full',-->
<!--filebrowserImageUploadUrl: `/citgc/fs/fs/attachments/image/0/${this.$store.getters.saasCode}`-->
<!--}-->
<!--// editor: ClassicEditor,-->
<!--// editorData: '<p>Content of the editor.</p>',-->
<!--// editorConfig: {-->
<!--//     // The configuration of the editor.-->
<!--// }-->
<!--};-->
<!--},-->
<!--watch: {-->
<!--value(val) {-->
<!--if (!this.hasChange && this.hasInit) {-->
<!--this.$nextTick(() =>-->
<!--this.editorInstances.setContent(val || ''))-->
<!--}-->
<!--},-->
<!--language() {-->
<!--this.destroyTinymce()-->
<!--this.$nextTick(() => this.initTinymce())-->
<!--}-->
<!--},-->
<!--mounted() {-->
<!--const {editorId, config} = this;-->
<!--CKEDITOR.replace(editorId, config);-->
<!--this.editorInstances = CKEDITOR.instances.editor2;-->
<!--},-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.editor-wrap {-->
<!--position: relative;-->
<!--z-index: 10;-->
<!--}-->
<!--</style>-->

<template>
<vue-ckeditor
    v-model="contentHtml"
    :config="config"
    :read-only-mode="readonly"
    :instance-ready-callback="readyCallback"
    @blur="onBlur($event)"
    @focus="onFocus($event)"
    @contentDom="onContentDom($event)"
    @dialogDefinition="onDialogDefinition($event)"
    @fileUploadRequest="onFileUploadRequest($event)"
    @fileUploadResponse="onFileUploadResponse($event)"/>

</template>

<script>
    import VueCkeditor from 'vue-ckeditor2';

    export default {
        components: {VueCkeditor},
        props: {
            // 高度
            ckHeight: {
                type: Number,
                default() {
                    return 200
                }
            },
            // 正文内容
            content: {
                type: String,
                default() {
                    return ''
                }
            },
            // 图片上传的地址
            imageUploadUrl: {
                type: String,
                default() {
                    return `${process.env.VUE_APP_BASE_API}/fs/fs/attachments/image/0/${this.$store.getters.saasCode}`
                }
            },
            // 实例初始化完成后的回调
            readyCallback: {
                type: Function,
                default() {
                    return null
                }
            },
            // 是否只读
            readonly: {
                type: Boolean,
                default() {
                    return false
                }
            }
        },
        data() {
            return {
                contentHtml: this.content,
                config: {
                    toolbar: 'Full',
                    // toolbar: [
                    //     ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript']
                    // ],
                    height: this.ckHeight,
                    filebrowserImageUploadUrl: this.imageUploadUrl
                }
            };
        },
        methods: {
            // 获取富文本内容
            getContent() {
                return this.contentHtml;
            },
            onBlur() {
                // console.log(evt);
            },
            onFocus() {
                // console.log(evt);
            },
            onContentDom() {
                // console.log(evt);
            },
            onDialogDefinition() {
                // console.log(evt);
            },
            onFileUploadRequest() {
                // console.log(evt);
            },
            onFileUploadResponse() {
                // console.log(evt);
            }
        }
    };
</script>
