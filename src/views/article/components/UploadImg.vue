<template>
  <div class="uploadimg-container">
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-exceed="onExceed"
      :disabled="disabled"
      drag
      show-file-list
      accept=".jpg,.jpeg,.png"
      class="image-upload"
    >
      <img v-if="url" :src="url" class="cover">
      <div v-else>
        <i class="el-icon-upload" />
        <div class="el-upload__text">上传封面</div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '../../../utils/auth'
export default {
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/article/upload`,
      url: ''
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.url = newValue
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    beforeUpload(file) {
      this.$emit('beforeUpload', file)
    },
    onSuccess(response, file) {
      const { code, msg, data } = response
      if (code === 0) {
        this.$message({
          message: msg,
          type: 'success'
        })
        this.url = data.url
        this.emitInput(data.url)
        this.$emit('onSuccess', file, data.imgPath)
      } else {
        this.$message({
          message: msg && `上传失败，失败原因：${msg}` || '上传失败',
          type: 'error'
        })
        this.$emit('onError', file)
      }
    },
    onRemove() {
      this.url = ''
      this.$message({
        message: '图片删除成功',
        type: 'success'
      })
      this.emitInput(this.url)
      this.$emit('onRemove')
    },
    onError(err) {
      const errMsg = err.message && JSON.parse(err.message)
      this.$message({
        message: (errMsg && errMsg.msg && `上传失败，失败原因:${errMsg.msg}`) || '上传失败',
        type: 'error'
      })
      this.$emit('onError', err)
    },
    onExceed() {
      this.$message({
        message: '只能上传一张封面图',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss" >
.uploadimg-container{
    .image-upload{
        .el-upload{
            width: 100%;
            .el-upload-dragger{
                width: 100%;
                height: 100%;
                .cover{
                    max-width: 100%;
                    max-height: 100%;
                }
            }
        }
    }
}

</style>
