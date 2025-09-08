# AI 每日总结功能测试指南

## 🚀 快速测试

### 1. 基础功能测试
```bash
# 测试环境变量和 AI 功能
node test-simple.js
```

### 2. API 端点测试
```bash
# 启动开发服务器
npm run dev

# 在另一个终端运行 API 测试
node test-api-endpoints.js
```

### 3. 完整功能测试
```bash
# 运行完整测试套件
node test-daily-summary.js
```

## 📋 测试检查清单

### ✅ 环境配置
- [ ] GEMINI_API_KEY 已设置
- [ ] DATABASE_URL 已设置
- [ ] 数据库连接正常
- [ ] 至少有一个社区存在

### ✅ AI 功能
- [ ] Gemini API 连接正常
- [ ] 帖子分类功能正常
- [ ] 每日总结生成正常
- [ ] 关键词匹配备选方案正常

### ✅ API 端点
- [ ] 社区列表 API (`/api/communities`)
- [ ] 每日总结 API (`/api/communities/[id]/daily-summary`)
- [ ] 帖子列表 API (`/api/communities/[id]/posts`)

### ✅ 前端功能
- [ ] 每日总结组件正常显示
- [ ] 自动刷新功能正常（每2分钟）
- [ ] 手动刷新按钮正常
- [ ] 实时状态指示器正常

## 🧪 测试场景

### 场景 1: 无帖子情况
- 社区中没有帖子
- 应该显示 "AI summaries will appear here once there are posts to analyze"
- 应该显示 "Auto-refreshes every 2 minutes"

### 场景 2: 有帖子情况
- 社区中有帖子
- 应该显示 AI 生成的总结
- 应该显示帖子统计信息
- 应该显示今日帖子列表

### 场景 3: 实时更新
- 添加新帖子后
- 等待2分钟或手动刷新
- 总结应该自动更新

## 🔧 故障排除

### 问题 1: Gemini API 错误
```
Error: models/gemini-pro is not found
```
**解决方案**: 使用 `gemini-1.5-flash` 模型

### 问题 2: 数据库连接错误
```
Error: Environment variable not found: DATABASE_URL
```
**解决方案**: 检查 `.env.local` 文件中的 `DATABASE_URL`

### 问题 3: 模块导入错误
```
Cannot find module './ai-gemini'
```
**解决方案**: 使用 `ai-simple.ts` 文件

### 问题 4: API 端点 404
```
404 Not Found
```
**解决方案**: 确保开发服务器正在运行

## 📊 性能测试

### 响应时间测试
```bash
# 测试 API 响应时间
time curl http://localhost:3000/api/communities/[id]/daily-summary
```

### 并发测试
```bash
# 测试多个并发请求
for i in {1..5}; do
  curl http://localhost:3000/api/communities/[id]/daily-summary &
done
wait
```

## 🎯 预期结果

### 成功指标
- ✅ 所有测试脚本通过
- ✅ API 响应时间 < 2秒
- ✅ AI 总结质量良好
- ✅ 实时更新功能正常
- ✅ 用户界面友好

### 失败指标
- ❌ 任何测试脚本失败
- ❌ API 响应时间 > 5秒
- ❌ AI 总结为空或错误
- ❌ 实时更新不工作
- ❌ 用户界面错误

## 📝 测试报告模板

```
测试日期: [日期]
测试环境: [开发/生产]
测试人员: [姓名]

测试结果:
- 环境配置: ✅/❌
- AI 功能: ✅/❌
- API 端点: ✅/❌
- 前端功能: ✅/❌

发现问题:
1. [问题描述]
2. [问题描述]

建议改进:
1. [改进建议]
2. [改进建议]
```
