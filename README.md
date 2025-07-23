# 🗓️ 大小周休息日助手

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue)](https://github.com/tommyrunner/alternatingWeekends)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

一个专为中国职场人士设计的Chrome浏览器插件，帮助您轻松管理和查看大小周休息日安排。无论您的公司采用何种大小周制度，这个插件都能帮您清晰地了解每周的休息安排。

## ✨ 功能特性

- 📅 **智能日历显示** - 清晰标注单休周和双休周
- 🔄 **自定义配置** - 支持设置任意起始日期的大小周循环
- 🌙 **农历显示** - 同时显示公历和农历日期
- 💾 **数据持久化** - 设置自动保存到Chrome同步存储
- 🎨 **美观界面** - 现代化设计，操作简单直观
- ⚡ **轻量高效** - 无需网络连接，纯本地计算

## 🚀 安装方法

### 方法一：Chrome应用商店安装（推荐）
*即将上线Chrome Web Store*

### 方法二：开发者模式安装

1. **下载源码**
   ```bash
   git clone git@github.com:tommyrunner/alternatingWeekends.git
   cd alternatingWeekends
   ```

2. **在Chrome中安装**
   - 打开 Chrome 浏览器
   - 在地址栏输入 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目文件夹

3. **完成安装**
   - 插件图标将出现在浏览器工具栏
   - 点击图标即可开始使用

## 📖 使用说明

### 首次配置

1. **点击插件图标** 打开插件界面
2. **设置基准日期** 在底部输入框中选择您公司第一个单休周的周一日期
3. **保存设置** 点击"保存设置"按钮完成配置

![插件使用界面](https://i.postimg.cc/T3C4NPzK/detail.png)

### 功能说明

- **🔴 红色圆点** - 单休周的休息日（仅周日休息）
- **🔵 蓝色圆点** - 双休周的休息日（周六日休息）
- **📅 日历导航** - 使用左右箭头切换月份
- **🌙 农历显示** - 点击任意日期查看对应农历信息

### 什么是大小周？

大小周是中国许多公司采用的工作制度：
- **单休周（小周）** - 周一到周六工作，周日休息（6天工作制）
- **双休周（大周）** - 周一到周五工作，周六日休息（5天工作制）

两种工作制度按周轮替，形成"大小周"工作模式。

## 🛠️ 技术架构

- **前端技术**: HTML5 + CSS3 + JavaScript ES6+
- **存储方案**: Chrome Storage API
- **UI框架**: 原生JavaScript + CSS Grid
- **兼容性**: Chrome 88+ / Edge 88+

## 📂 项目结构

```
alternatingWeekends/
├── manifest.json          # Chrome插件配置文件
├── popup.html             # 插件弹窗页面
├── popup.css              # 样式文件
├── popup.js               # 主要逻辑代码
├── icon.svg               # 插件图标
├── images/                # 图片资源
│   └── icon.png          # PNG格式图标
└── README.md              # 项目说明文档
```

## 🔧 开发指南

### 本地开发

1. **克隆项目**
   ```bash
   git clone git@github.com:tommyrunner/alternatingWeekends.git
   cd alternatingWeekends
   ```

2. **修改代码** 
   - 主要逻辑在 `popup.js` 中
   - 样式调整在 `popup.css` 中
   - 页面结构在 `popup.html` 中

3. **重新加载插件**
   - 在 `chrome://extensions/` 页面
   - 找到对应插件点击刷新按钮

### 代码规范

- 使用 JSDoc 注释规范
- 遵循 ES6+ 语法标准
- 采用语义化的CSS类名
- 保持函数职责单一

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进这个项目！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 更新日志

### v1.0.0 (2024-12-xx)
- 🎉 首次发布
- ✅ 基础大小周计算功能
- ✅ 日历界面显示
- ✅ 农历日期支持
- ✅ 数据持久化存储

## 📄 许可证

本项目采用 [MIT 许可证](https://opensource.org/licenses/MIT) - 查看 LICENSE 文件了解详情。

## 🙋 常见问题

**Q: 如何确定我公司的大小周起始日期？**  
A: 询问HR或查看公司制度，找到最近一个单休周的周一日期即可。

**Q: 农历显示不准确怎么办？**  
A: 插件使用简化算法，可能存在1-2天误差，仅供参考。

**Q: 能否支持其他工作制度？**  
A: 目前专注于标准大小周制度，未来可能扩展更多模式。

## 📞 联系作者

- GitHub: [@tommyrunner](https://github.com/tommyrunner)
- 项目地址: [https://github.com/tommyrunner/alternatingWeekends](https://github.com/tommyrunner/alternatingWeekends)

---

如果这个插件对您有帮助，请给个 ⭐ Star 支持一下！ 