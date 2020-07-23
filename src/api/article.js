import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function removeImg(data) {
  return request({
    url: '/article/remove',
    method: 'post',
    data
  })
}

export function getArticle(articleId) {
  return request({
    url: '/article/get',
    method: 'get',
    params: { articleId }
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function getCategoryList() {
  return request({
    url: '/article/category',
    method: 'get'
  })
}

export function listArticle(params) {
  return request({
    url: '/article/list',
    method: 'get',
    params
  })
}

export function deleteArticle(articleId) {
  return request({
    url: '/article/delete',
    method: 'get',
    params: { articleId }
  })
}

export function getSortId() {
  return request({
    url: '/article/getId',
    method: 'get'
  })
}

export function getAllList() {
  return request({
    url: '/article/getAllList',
    method: 'get'
  })
}

export function saveSort(data) {
  return request({
    url: '/article/saveSort',
    method: 'post',
    data
  })
}
