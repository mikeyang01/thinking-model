# 思维模型大全 - Docsify

本站使用 Docsify 部署静态文档。以下是快速使用说明：

本地预览：

```bash
# 安装依赖（只需一次）
npm install

# 本地启动 docsify 服务（在 3000 端口）
npm run serve
```

构建到 `docs/`：

```bash
npm run build
```

部署到 GitHub Pages：

- 确保仓库的 `gh-pages` 分支或 `docs/` 目录被 GitHub Pages 设置为来源（本项目方案用 `docs/`）。
- 运行 `npm run build`，把生成的 `docs/` 提交并推送到仓库。

备注：
- `docs/index.html` 中使用了 CDN 的 docsify，不需要额外构建步骤。
- 如果你习惯使用 `gh-pages` 分支，也可以改为将 `docs/` 内容推到 `gh-pages` 分支。