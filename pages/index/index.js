//index.js
Page({
  data: {
    url: 'https://www.haoquanfang.com/products',
    currentTab: '',
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
  onLoad () {
    this.requestList()
  },
  onShow() {
    this.setData({
      str: '',
      page: 1,
      currentTab: '',
      sort: 'itemId',
      order: 'desc',
      // filterFixed: false,
      // show: false
    })
    this.setData({ toView: 'search' })
  },
  onShareAppMessage: function () {
    return {
      title: '惠券多-会省钱的小程序',
      path: '/pages/index/index'
    }
  },
  scrollHandle (e) {
    const top = e.detail.scrollTop

    if (top >= 178 && !this.data.filterFixed) {
      this.setData({ filterFixed: true, show: true })
    } else if (top < 178 && this.data.filterFixed) {
      this.setData({ filterFixed: false, show: false })
    }
  },
  top () {
    this.setData({ toView: 'search' })
  },
  requestList () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    wx.request({
      url: this.data.url,
      data: {
        category: this.data.currentTab,
        order: `${this.data.sort} ${this.data.order}`,
        page: this.data.page,
        q: this.data.str
      },
      success: (res) =>  {
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
  handleInput (event) {
    console.log(event)
    this.setData({
      str: event.detail.value
    })
  },
  enter (e) {
    wx.navigateTo({
      url: `/pages/search/search?q=${e.detail.value}`,
    })
  },
  searchItems (e) {
    wx.navigateTo({
      url: `/pages/search/search?q=${e.detail.value.search}`,
    })
  },
  changeTab (event) {
    this.setData({
      currentTab: event.currentTarget.id,
      sort: 'itemId',
      page: 1,
      order: 'desc'
    })
    this.requestList()
  },
  changeOrder (event) {
    const dataset = event.currentTarget.dataset
    this.setData({ page: 1, toView: 'filter' })

    if (dataset.exchange) {
      if (dataset.sort === this.data.sort){
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
  buyNow (event) {
    const id = event.currentTarget.dataset.id

    console.log(id)
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  loadMore () {
    if (this.data.loading) { return }
    if (this.data.page >= this.data.totalPage) { return }
    this.setData({ page: this.data.page + 1, loading: true })

    wx.request({
      url: this.data.url,
      data: {
        category: this.data.currentTab,
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
