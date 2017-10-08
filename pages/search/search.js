//search.js
Page({
  data: {
    url: 'https://www.haoquanfang.com/products',
    list: [],
    sort: 'itemId',
    order: 'desc',
    orderClass: '',
    str: '',
    loading: false,
    page: 1,
    totalPage: 0,
    filterFixed: false,
    show: false,
    toView: '',
    noResult: false
  },
  onLoad(options) {
    this.setData({ str: decodeURIComponent(options.q) })
    this.requestList()
  },
  onShow () {
    this.setData({
      page: 1,
      sort: 'itemId',
      order: 'desc'
    })
  },
  onShareAppMessage: function () {
    return {
      title: '惠券多-会省钱的小程序',
      path: '/pages/index/index'
    }
  },
  top () {
    this.setData({ toView: 'search' })
  },
  scrollHandle(e) {
    const top = e.detail.scrollTop
    console.log(top)
    if (top >= 52 && !this.data.filterFixed) {
      console.log(222)
      this.setData({ filterFixed: true, show: true })
    } else if (top < 52 && this.data.filterFixed) {
      console.log(333)
      this.setData({ filterFixed: false, show: false })
    }
  },
  requestList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    wx.request({
      url: this.data.url,
      data: {
        order: `${this.data.sort} ${this.data.order}`,
        page: this.data.page,
        q: this.data.str
      },
      success: (res) => {
        this.setData({
          list: res.data.data.data,
          totalPage: res.data.data.totalPages,
          noResult: !res.data.data.totalPages
        })
      },
      fail: () => {
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  handleInput(event) {
    this.setData({
      str: event.detail.value
    })
  },
  searchItems() {
    this.setData({
      page: 1,
      sort: 'itemId',
      order: 'desc'
    })
    this.requestList()
  },
  changeOrder(event) {
    const dataset = event.currentTarget.dataset
    this.setData({ page: 1, toView: 'filter' })
    
    if (dataset.exchange) {
      if (dataset.sort === this.data.sort) {
        if (this.data.order === 'asc') {
          this.setData({
            order: 'desc',
            orderClass: 'desc'
          })
        } else {
          this.setData({
            order: 'asc',
            orderClass: 'asc'
          })
        }
      } else {
        this.setData({
          order: 'asc',
          orderClass: 'asc'
        })
      }
    } else {
      this.setData({
        order: 'desc'
      })
    }

    this.setData({
      sort: dataset.sort
    })
    this.requestList()
  },
  buyNow(event) {
    const id = event.currentTarget.dataset.id

    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  loadMore() {
    if (this.data.loading) { return }
    if (this.data.page >= this.data.totalPage) { return }
    this.setData({ page: this.data.page + 1, loading: true })

    wx.request({
      url: this.data.url,
      data: {
        order: `${this.data.sort} ${this.data.order}`,
        page: this.data.page,
        q: this.data.str
      },
      success: (res) => {
        const array = this.data.list

        res.data.data.data.forEach(item => {
          array.push(item)
        })

        this.setData({
          loading: false,
          list: array,
          total: res.data.data.totalPages
        })
      },
      fail: () => {
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  }
})
