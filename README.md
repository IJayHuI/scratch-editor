# 🚀 BlockCode Scratch Editor

基于原版 [scratchfoundation/scratch-editor](https://github.com/scratchfoundation/scratch-editor)￼ 的二次开发项目，增加了账号系统、文件管理功能，并接入 Supabase 作为后端服务。

本项目用于搭建一个可登录、可管理作品的 Scratch 在线编辑器，可结合 BlockCode 前端使用。

## ✨ 功能特性

### 🔐 账号系统（Supabase Auth）
- Token 校验
- Profile 同步（昵称、角色等）

### 🤖 AI 助手（DeepSeek 接入）
- 集成 DeepSeek API，为用户提供实时 AI 辅助
- 可用于项目搭建、疑难解答、生成积木块等

### 🌐 在线持续编辑
- 支持使用 token 自动登录到 Scratch Editor

## 📦 技术栈

Layer	Technology
前端	Scratch Editor（基于 React）
认证	Supabase Auth
存储	Supabase Storage
数据库	Supabase Postgres
云函数	Supabase Edge Functions
作品系统	兼容 Scratch .sb3 文件格式


## 📁 项目结构（摘要）

scratch-editor/
  ├── src/
  ├── build/
  ├── package.json
  ├── README.md  ← 你正在看的文件
  └── ...

## 🚀 本地开发

1. 克隆项目

```
git clone https://github.com/IJayHuI/scratch-editor.git
cd scratch-editor
```

2. 安装依赖

```
npm install
```

3. 先进行一次构建
```
npm run build
```

- 开发模式运行

```
npm start
```

- 打包

```
npm run build
```

## 📝 Licenses

本项目基于 Scratch（MIT License）进行二次开发，请遵守相关开源协议。

## 🤝 致谢

感谢 Scratch Foundation 开源原始编辑器，使本项目成为可能。
感谢 Supabase 提供简单易用的 Auth / Database / Storage 服务。

## 📚 官方文档

更多内容请参考本目录下的 [README.SOURCE](README.source.md)
