/**
 * 大小周休息日助手 - Background Service Worker
 * @fileoverview Chrome插件的后台服务脚本，处理插件的生命周期事件
 * @author Tommy Runner
 * @version 1.0.0
 */

/**
 * 插件安装事件处理
 * @description 当插件首次安装或更新时触发
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('大小周休息日助手已安装/更新');
  
  if (details.reason === 'install') {
    // 首次安装时的处理
    console.log('感谢安装大小周休息日助手！');
    
    // 设置默认配置
    chrome.storage.sync.set({
      firstSingleWeek: '2024-12-16', // 默认第一个单休周的周一
      lastUpdateCheck: Date.now()
    }).catch(error => {
      console.error('设置默认配置失败:', error);
    });
    
  } else if (details.reason === 'update') {
    // 插件更新时的处理
    const currentVersion = chrome.runtime.getManifest().version;
    console.log(`插件已更新到版本 ${currentVersion}`);
    
    // 更新最后检查时间
    chrome.storage.sync.set({
      lastUpdateCheck: Date.now()
    }).catch(error => {
      console.error('更新检查时间失败:', error);
    });
  }
});

/**
 * 插件启动事件处理
 * @description 当浏览器启动时触发
 */
chrome.runtime.onStartup.addListener(() => {
  console.log('浏览器启动，大小周休息日助手已准备就绪');
});

/**
 * 处理来自popup的消息
 * @description 监听popup页面发送的消息
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message);
  
  switch (message.type) {
    case 'GET_VERSION':
      // 返回当前版本信息
      sendResponse({
        version: chrome.runtime.getManifest().version,
        name: chrome.runtime.getManifest().name
      });
      break;
      
    case 'LOG_EVENT':
      // 记录用户操作事件
      console.log('用户操作:', message.data);
      sendResponse({ success: true });
      break;
      
    default:
      console.warn('未知消息类型:', message.type);
      sendResponse({ error: '未知消息类型' });
  }
  
  return true; // 保持消息通道开放以支持异步响应
});

/**
 * 错误处理
 * @description 全局错误处理器
 */
self.addEventListener('error', (event) => {
  console.error('Background脚本错误:', event.error);
});

/**
 * 未处理的Promise拒绝处理
 * @description 处理未捕获的Promise错误
 */
self.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason);
});

console.log('大小周休息日助手 Background Service Worker 已加载'); 