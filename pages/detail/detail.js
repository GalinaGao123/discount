// pages/detail/detail.js
Page({
  data: {
    detailUrl: 'https://www.haoquanfang.com/products/get',
    modelUrl: 'https://www.haoquanfang.com/products/createToken',
    detail: {},
    btnText: '立即领取',
    btnShow: false
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    wx.request({
      url: this.data.detailUrl,
      data: {
        id: options.id
      },
      success: res => {
        this.setData({
          detail: res.data.data.detail,
          btnShow: !res.data.data.stageMode
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(this.data.detail.title)
    return {
      title: this.data.detail.title,
      path: `/page/detail/detail/id=${this.data.detail.itemId}`,
      imgUrl: this.data.detail.picture
    }
  },
  createModel () {
    this.setData({ btnText: '获取中...' })
    wx.request({
      url: this.data.modelUrl,
      data: {
        id: this.data.detail.itemId
      },
      success: res => {
        wx.setClipboardData({
          data: res.data.data,
          success: () => {
            this.setData({ btnText: '淘口令已复制，打开【手机淘宝】APP领取' })
          },
          fail: () => {
            this.setData({ btnText: '淘口令生成失败，稍后重试' })
          }
        })
      },
      fail: () => {
        this.setData({ btnText: '淘口令生成失败，稍后重试' })
      },
      complete: () => {
        setTimeout(() => {
          this.setData({ btnText: '立即领取' })
        }, 2000)
      }
    })
  }
})