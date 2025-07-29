# Vercel 部署指南

## 部署步骤

### 1. 准备文件
确保以下文件在项目根目录：
- `index.html` - 主页面
- `App.js` - React应用代码
- `vercel.json` - Vercel配置文件
- `package.json` - 项目配置

### 2. 部署到Vercel

#### 方法一：通过Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 在项目目录运行
vercel

# 按照提示完成部署
```

#### 方法二：通过Vercel网站
1. 访问 https://vercel.com
2. 登录或注册账号
3. 点击 "New Project"
4. 选择 "Import Git Repository" 或直接拖拽文件夹
5. 选择项目文件夹
6. 点击 "Deploy"

### 3. 配置说明

- `vercel.json` 配置了API代理，将 `/analyze` 请求转发到PythonAnywhere后端
- 前端使用相对路径 `/analyze`，Vercel会自动代理到后端
- 支持CORS跨域请求

### 4. 部署后测试

1. 访问Vercel提供的URL
2. 上传CSV文件测试分析功能
3. 确认数据能正常显示

### 5. 自定义域名（可选）

在Vercel项目设置中可以添加自定义域名。

## 注意事项

- 确保PythonAnywhere后端正常运行
- 如果遇到CORS问题，检查后端CORS配置
- Vercel免费版有使用限制，注意监控用量

## 故障排除

如果部署失败：
1. 检查vercel.json语法是否正确
2. 确认所有文件都在正确位置
3. 查看Vercel部署日志获取错误信息
4. 确保后端API地址正确