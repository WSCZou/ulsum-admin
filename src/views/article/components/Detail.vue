<template>
  <el-form ref="postForm" :model="postForm" :rules="rules">
    <div class="detail-container">
      <Sticky :class-name="'sub-navbar'">
        <el-button
          v-loading="loading"
          type="warning"
          style="margin-left:10px"
          @click="submitDraft"
        >存为草稿
        </el-button>
        <el-button
          v-loading="loading"
          type="success"
          style="margin-left:10px"
          @click="submitForm"
        >{{ isEdit ? '更新文章' : '发布文章' }}
        </el-button>
      </Sticky>
      <div class="detail-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="image_uri">
              <UploadImg
                v-model="postForm.image_uri"
                :file-list="fileList"
                @onSuccess="onUploadSuccess"
                @onRemove="onUploadRemove"
              />
            </el-form-item>

            <el-form-item prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" :required="true">标题</MDinput>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="作者" prop="author">
                  <el-input
                    v-model="postForm.author"
                    placeholder="作者"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文章类型" prop="category">
                  <el-select v-model="postForm.category" :remote-method="getRemoteCategoryList" filterable default-first-option remote placeholder="搜索类型(音乐，球鞋...)" style="display:block;">
                    <el-option v-for="(item,index) in CateListOptions" :key="item+index" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

        </el-row>
        <el-form-item prop="content">
          <Tinymce ref="editor" v-model="postForm.content" :is-publish="isPublish" @setEmptyed="onSetEmptyed" />
        </el-form-item>
        <div class="">{{ postForm }}</div>
      </div>
    </div>
  </el-form>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import UploadImg from './UploadImg'
import MDinput from '@/components/MDinput'
import { searchCategory } from '@/api/remote-search'
import { createArticle, removeImg, getArticle, updateArticle, getSortId } from '../../../api/article'

const defaultForm = {
  status: 'draft',
  title: '', // 文章标题
  author: '', // 作者
  category: '', // 文章类型
  content: '', // 文章内容
  image_uri: '', // 封面url
  image_path: '' // 封面图片路径
  // sortId: 0// 排序序号
}

export default {
  components: {
    Tinymce,
    Sticky,
    UploadImg,
    MDinput
  },
  props: {
    isEdit: Boolean
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        /* this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })*/
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      fileList: [], // 编辑时获取数据
      CateListOptions: [],
      rules: {
        title: [{ validator: validateRequire, trigger: 'blur' }],
        content: [{ validator: validateRequire, trigger: 'blur' }],
        author: [{ validator: validateRequire, trigger: 'blur' }],
        category: [{ validator: validateRequire, trigger: 'blur' }]
      },
      isPublish: false
    }
  },
  created() {
    if (this.isEdit) {
      const articleId = this.$route.params.articleId
      console.log(articleId)
      this.getArticleData(articleId)
    }
    this.getSortId()
  },
  methods: {
    getArticleData(articleId) {
      getArticle(articleId).then(res => {
        this.setData(res.data)
      })
    },
    setData(res) {
      this.postForm = {
        title: res.title,
        author: res.author, // 作者
        category: res.category, // 文章类型
        content: res.content, // 文章内容
        image_uri: res.image_uri, // 封面url
        image_path: res.image_path || res.img_path, // 封面 图片路径
        articleId: res.articleId, // 文章标识ID
        createDt: res.createDt, // 文章创建时间
        sortId: res.sortId// 排序Id
      }
    },
    getSortId() {
      getSortId().then(res => {
        if (!res.data.sortId) {
          this.postForm.sortId = 0
        } else {
          this.postForm.sortId = res.data.sortId
        }
      })
    },
    setDefault() {
      // this.postForm = Object.assign({},defaultForm)
      this.postForm.status = 'draft'
      this.postForm.image_path = ''
      this.fileList = []
      this.$refs.postForm.resetFields()
      this.postForm.content = ''
    },
    onUploadSuccess(file, data) {
      this.postForm.image_path = data.replace(/\\/g, '/')
      // console.log(data)
    },
    onUploadRemove() {
      console.log(this.postForm.image_path)
      removeImg({ image_path: this.postForm.image_path }).then(() => {
        this.postForm.image_path = ''
      })
    },
    getRemoteCategoryList(query) {
      searchCategory(query).then(response => {
        if (!response.data.FilterList) return
        this.CateListOptions = response.data.FilterList
      })
    },
    submitForm() {
      console.log(this.postForm.image_path)
      if (!this.loading) {
        this.loading = true
        this.postForm.status = 'published'// 发布状态
        this.$refs.postForm.validate((valid, fields) => {
          if (valid) {
            if (!this.isEdit) {
              this.postForm.articleId = new Date().getTime()// 为文章创建唯一ID
              this.postForm.createDt = new Date().getTime()// 文章创建时间
              this.postForm.sortId = +this.postForm.sortId + 1// 排序加1
              createArticle(this.postForm).then((res) => {
                const { msg } = res
                this.$notify({
                  title: '成功',
                  message: msg,
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
                this.isPublish = true
                this.setDefault()
                this.getSortId()
              }).catch(() => {
                this.loading = false
                this.getSortId()
              })
            } else {
              updateArticle(this.postForm).then((res) => {
                const { msg } = res
                this.$notify({
                  title: '成功',
                  message: msg,
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message({ message, type: 'error' })
            this.loading = false
          }
        })
      }
    },
    submitDraft() {
      if (!this.loading) {
        this.loading = true
        this.postForm.status = 'draft'// 草稿状态
        this.$refs.postForm.validate((valid, fields) => {
          if (valid) {
            if (!this.isEdit) {
              this.postForm.articleId = new Date().getTime()// 为文章创建唯一ID
              this.postForm.createDt = new Date().getTime()// 文章创建时间
              this.postForm.sortId = +this.postForm.sortId + 1// 排序加1
              createArticle(this.postForm).then((res) => {
                this.$notify({
                  title: '成功',
                  message: '存为草稿成功',
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
                this.isPublish = true
                this.setDefault()
                this.getSortId()
              }).catch(() => {
                this.loading = false
                this.getSortId()
              })
            } else {
              updateArticle(this.postForm).then((res) => {
                this.$notify({
                  title: '成功',
                  message: '存为草稿成功',
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            }
          } else {
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message({ message, type: 'error' })
            this.loading = false
          }
        })
      }
    },
    onSetEmptyed(isPublish) { // 清空富文本编辑器
      console.log(isPublish)
      this.isPublish = isPublish
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-main-container{
  padding:40px 50px 20px;
}
</style>
