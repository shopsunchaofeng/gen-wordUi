/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://localhost:8080'
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.200.254:8086'
  window.SITE_CONFIG['baseUrl'] = 'http://39.106.124.143/gen-word-api'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = 'http://39.106.124.143/gen-word-api' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
  // window.SITE_CONFIG['cdnUrl'] = 'http://127.0.0.1:8000/'
})()
