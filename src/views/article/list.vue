<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-if="!isSort">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="4" class="filterStyle">
            <el-input
              v-model="listQuery.title"
              placeholder="文章名"
              clearable
              @keyup.enter.native="handerFilter"
              @clear="handerFilter"
              @blur="handerFilter"
            />
          </el-col>
          <el-col :xs="24" :sm="4" class="filterStyle">
            <el-input
              v-model="listQuery.author"
              placeholder="作者"
              clearable
              @keyup.enter.native="handerFilter"
              @clear="handerFilter"
              @blur="handerFilter"
            />
          </el-col>
          <el-col :xs="24" :sm="4" class="filterStyle">
            <el-select
              v-model="listQuery.category"
              placeholder="分类"
              clearable
              @change="handerFilter"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.value"
                :label="item.label + '(' +item.num+')'"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="3" class="filterStyle">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handerFilter"
            >查询
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="3" class="filterStyle">
            <el-button
              type="primary"
              icon="el-icon-sort"
              @click="handerSort"
            >排序
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="3" class="filterStyle">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handerCreate"
            >新增
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="3" class="filterStyle">
            <el-checkbox
              v-model="showCover"
              @change="changeShowCover"
            >
              显示封面
            </el-checkbox>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-row :gutter="10">
          <el-col :span="4" class="filterStyle">
            <span>文章排序</span>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="3" class="filterStyle">
            <el-button
              type="primary"
              @click="handerSave"
            >保存
            </el-button>
          </el-col>
          <el-col :span="3" class="filterStyle">
            <el-button
              type="primary"
              @click="handerCancel"
            >取消</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-table
      :key="tableKey"
      ref="dragTable"
      v-loading="listLoading"
      :data="List"
      border
      fit
      hightlight-current-row
      style="width:100%"
      row-key="id"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        width="180"
        align="center"
      >
        <template v-slot="{row}">
          <template v-if="isSort">
            <template v-if="row.edit">
              <el-input v-model="idEdit" />
              <el-button @click="handerConfirmEdit(row)">确定</el-button>
              <el-button @click="handerCancelEdit(row)">取消</el-button>
            </template>
            <template v-else>
              <span>{{ row.sortId }}</span>
              <el-button type="text" icon="el-icon-edit" @click="handerIdEdit(row)" />
              <el-button v-show="row.sortId!==1" type="text" icon="el-icon-caret-top" @click="handerToTop(row)" />
              <el-button v-show="row.sortId!==totalListLength" type="text" icon="el-icon-caret-bottom" @click="handerToBottom(row)" />
            </template>
          </template>
          <span v-else>{{ row.sortId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="文章标题"
        align="center"
        width="180"
      >
        <template v-slot="{row}">
          <span v-if="row.titleWrapper" v-html="row.titleWrapper" />
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column

        label="作者"
        align="center"
        width="180"
      >
        <template v-slot="{row}">
          <span v-if="row.authorWrapper" v-html="row.authorWrapper" />
          <span v-else>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="种类"
        prop="category"
        align="center"
        width="180"
      />
      <el-table-column
        label="创建时间"
        prop="createDt"
        align="center"
        width="180"
      >
        <template v-slot="{row:{createDt}}">
          <span>{{ createDt | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        prop="updateDt"
        align="center"
        width="180"
      >
        <template v-slot="{row:{updateDt}}">
          <span>{{ updateDt | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status"
        align="center"
        width="100"
      >
        <template v-slot="{row:{status}}">
          <el-tag
            :type="status === 'published' ? 'primary' : 'success'"
            disable-transitions
          >{{ status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showCover"
        label="封面"
        align="center"
        width="180"
      >
        <template v-slot="{row:{image_uri}}">
          <img v-if="image_uri" :src="image_uri" style="height:100%;width:100%">
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column
        label="ulsum"
        align="center"
        width="180"
      >
        <template>
          <span>无</span>
        </template>
      </el-table-column>
      <el-table-column
        label="ulsum"
        align="center"
        width="180"
      >
        <template>
          <span>无</span>
        </template>
      </el-table-column>
      <el-table-column
        label="ulsum"
        align="center"
        width="180"
      >
        <template>
          <span>无</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!isSort"
        label="操作"
        width="120"
        align="center"
        fixed="right"
      >
        <template v-slot="{row}">
          <el-button type="text" icon="el-icon-edit" style="color:#13ce66" @click="handerUpdate(row)" />
          <el-button type="text" icon="el-icon-delete" style="color:#f56c6c" @click="handerDelete(row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0 && !isSort"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="refresh"
    />
    <pagination
      v-show="total > 0 && isSort"
      :total="total"
      :page.sync="sortMode.page"
      :limit.sync="sortMode.pageSize"
      @pagination="handerSortModePage"
    />
  </div>
</template>

<script>
import Pagination from '../../components/Pagination'
import { getCategoryList, listArticle, deleteArticle, getAllList, saveSort } from '../../api/article'
import { parseTime, deepClone } from '../../utils'
import Sortable from 'sortablejs'

export default {
  components: { Pagination },
  filters: {
    timeFilter(time) {
      return time ? parseTime(time, '{y}-{m}-{h} {h}:{i}') : '无'
    }
  },
  data() {
    return {
      listQuery: {},
      showCover: false,
      categoryList: [],
      tableKey: 0,
      listLoading: true,
      List: [],
      total: 0,
      isSort: false,
      sortMode: {
        page: 1,
        pageSize: 20
      },
      totalList: [],
      copyList: [],
      sortable: null,
      idEdit: 0,
      OldId: 0,
      totalListLength: 0

    }
  },
  created() {
    this.parseQuery()
  },
  mounted() {
    this.getList()
    this.getCategoryList()
    console.log('mounted')
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to, from)
    if (to.path === from.path) {
      const newQuery = Object.assign({}, to.query)
      const oldQuery = Object.assign({}, from.query)
      if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
        this.getList()
      }
    }
    next()
  },
  methods: {
    parseQuery() {
      const query = Object.assign({}, this.$route.query)
      const listQuery = {
        page: 1,
        pageSize: 20
      }
      if (query) {
        query.page && (query.page = Number(query.page))
        query.pageSize && (query.pageSize = Number(query.pageSize))
      }
      this.listQuery = { ...listQuery, ...query }
      // console.log(this.listQuery)
    },
    /* getSortId() {
      getSortId().then(res => {
        if (!res.data.sortId) {
          this.postForm.sortId = 0
        } else {
          this.postForm.sortId = res.data.sortId
        }
      })
    },*/
    wrapperKeyword(k, v) {
      function hightlight(value) {
        return `<span style="color:#dd4b39">${value}</span>`
      }
      if (!this.listQuery[k]) {
        return v
      } else {
        return v.replace(new RegExp(this.listQuery[k], 'ig'), v => hightlight(v))
      }
    },
    getList() {
      this.listLoading = true
      // console.log(this.listQuery)
      listArticle(this.listQuery).then(res => {
        const { list, count } = res.data
        this.total = count
        this.List = list
        this.List.forEach(article => {
          article.titleWrapper = this.wrapperKeyword('title', article.title)
          article.authorWrapper = this.wrapperKeyword('author', article.author)
        })
        this.listLoading = false
      })
    },
    getCategoryList() {
      getCategoryList().then(res => {
        this.categoryList = res.data
      })
    },
    refresh() {
      // console.log(this.listQuery)
      this.$router.push({
        path: '/article/list',
        query: this.listQuery
      })
    },
    handerFilter() {
      this.listQuery.page = 1
      this.refresh()
    },
    handerCreate() {
      this.$router.push('/article/create')
    },
    changeShowCover(value) {
      this.showCover = value
    },
    sortChange(data) {
      console.log('sortChange：', data)
    },
    handerUpdate(row) {
      console.log('handerUpdate', row)
      this.$router.push(`/article/edit/${row.articleId}`)
    },
    handerDelete(row) {
      this.$confirm('确定删除该文章？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.articleId).then(res => {
          const { msg } = res
          this.$notify({
            title: '成功',
            message: msg,
            type: 'success',
            duration: 2000
          })
          this.handerFilter()
        })
      })
    },
    handerSave() {
      if (!this.listLoading) {
        this.listLoading = true
        this.copyList.map(item => {
          delete item.edit
        })
        saveSort(this.copyList).then((res) => {
          const { msg } = res
          this.listLoading = false
          this.isSort = false
          this.getList()
          this.sortable.destroy()// 取消拖拽
          this.sortMode.page = 1
          this.sortable.pageSize = 20
          this.$notify({
            title: '成功',
            message: msg,
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.listLoading = false
          this.isSort = false
          this.sortMode.page = 1
          this.sortable.pageSize = 20
          this.sortable.destroy()// 取消拖拽
          this.getList()
        })
      }
    },
    handerCancel() {
      this.isSort = false
      this.sortMode.page = 1
      this.sortable.pageSize = 20
      this.sortable.destroy()// 取消拖拽
      this.getList()
    },
    async handerSort() {
      this.listLoading = true
      this.isSort = true
      const result = await getAllList()
      const { list, count } = result.data
      this.total = count
      this.totalList = list
      this.totalListLength = this.totalList.length
      this.copyList = deepClone(list)
      this.copyList = this.copyList.map(v => {
        this.$set(v, 'edit', false) // 监听新增属性
        return v
      })
      this.List = this.copyList.slice((this.sortMode.page - 1) * this.sortMode.pageSize, (this.sortMode.page - 1) * this.sortMode.pageSize + this.sortMode.pageSize)
      // console.log(this.List)

      this.listLoading = false
      this.$nextTick(() => {
        this.setSort()
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.copyList.splice(evt.oldIndex, 1)[0]// 返回删除的元素
          this.copyList.splice(evt.newIndex, 0, targetRow) // 加入删除的元素
          if (evt.oldIndex <= evt.newIndex) {
            for (let i = evt.oldIndex; i < evt.newIndex; i++) {
              this.copyList[i].sortId -= 1
            }
            this.copyList[evt.newIndex].sortId = evt.newIndex - evt.oldIndex + this.copyList[evt.newIndex].sortId
          } else {
            for (let i = evt.oldIndex; i > evt.newIndex; i--) {
              this.copyList[i].sortId += 1
            }
            this.copyList[evt.newIndex].sortId = this.copyList[evt.newIndex].sortId - (evt.oldIndex - evt.newIndex)
          }
          this.handerSortModePage()
        }
      })
    },
    // 分页改变 table 的 List
    handerSortModePage() {
      this.List = this.copyList.slice((this.sortMode.page - 1) * this.sortMode.pageSize, (this.sortMode.page - 1) * this.sortMode.pageSize + this.sortMode.pageSize)
    },
    handerIdEdit(row) {
      row.edit = true
      this.idEdit = row.sortId
      this.OldId = row.sortId
    },
    handerConfirmEdit(row) {
      if (isNaN(this.idEdit)) {
        this.$message({
          message: '请输入数字',
          type: 'error'
        })
      } else if (this.idEdit < this.totalList[0].sortId || this.idEdit > this.totalList[this.totalList.length - 1].sortId) {
        this.$message({
          message: '序号应该小于等于' + this.totalList[this.totalList.length - 1].sortId + '大于等于' + this.totalList[0].sortId,
          type: 'error'
        })
      } else {
        // 操作整个list
        const targetRow = this.copyList.splice(this.OldId - 1, 1)[0]// 返回删除的元素
        this.copyList.splice(this.idEdit - 1, 0, targetRow) // 加入删除的元素
        if (this.OldId <= this.idEdit) {
          for (let i = this.OldId - 1; i < this.idEdit - 1; i++) {
            this.copyList[i].sortId -= 1
          }
          this.copyList[this.idEdit - 1].sortId = this.idEdit - this.OldId + this.copyList[this.idEdit - 1].sortId
        } else {
          for (let i = this.OldId - 1; i > this.idEdit - 1; i--) {
            this.copyList[i].sortId += 1
          }
          this.copyList[this.idEdit - 1].sortId = this.copyList[this.idEdit - 1].sortId - (this.OldId - this.idEdit)
        }
        row.edit = false
        this.handerSortModePage()
      }
    },
    handerCancelEdit(row) {
      row.edit = false
      this.idEdit = 0
      this.OldId = 0
    },
    handerToTop(row) {
      const targetRow = this.copyList.splice(row.sortId - 1, 1)[0]// 返回删除的元素
      this.copyList.splice(0, 0, targetRow) // 加入删除的元素
      for (let i = row.sortId - 1; i > 0; i--) {
        this.copyList[i].sortId += 1
      }
      this.copyList[0].sortId = 1
      this.handerSortModePage()
    },
    handerToBottom(row) {
      const targetRow = this.copyList.splice(row.sortId - 1, 1)[0]// 返回删除的元素
      this.copyList.splice(this.totalListLength - 1, 0, targetRow) // 加入删除的元素
      for (let i = row.sortId - 1; i < this.totalListLength - 1; i++) {
        this.copyList[i].sortId -= 1
      }
      this.copyList[this.totalListLength - 1].sortId = this.totalListLength
      this.handerSortModePage()
    }

  }
}
</script>

<style lang="scss" >
    .filterStyle{
        margin-bottom: 10px;
    }
    .ghost{
        opacity: 0.8!important;
        color: #fff!important;
        background: #1890ff!important;
    }
    .hover-row > td {
        background-color: #1890ff !important;
        color: #fff!important;
    }

</style>
