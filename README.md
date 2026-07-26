# Business Days Calculator

一个纯前端的工作日计算器工具站，专为海外长尾搜索流量设计。计算从任意日期起 N 个工作日后的日期，自动排除周末和公共假日（支持美国联邦假日、英国银行假日）。

## 项目结构

```
business-days-calculator/
├── index.html                          # 首页 + 交互式计算器
├── 3-business-days-from-today.html     # 长尾页：3 个工作日后
├── 5-business-days-from-today.html     # 长尾页：5 个工作日后
├── 10-business-days-from-today.html    # 长尾页：10 个工作日后
├── 30-business-days-from-today.html    # 长尾页：30 个工作日后
├── us-business-days.html               # 美国假日页 + 计算器
├── uk-business-days.html               # 英国假日页 + 计算器
├── assets/
│   ├── business-days.js                # 核心计算引擎（节假日库 + 日期计算）
│   └── style.css                       # 样式
├── robots.txt
├── sitemap.xml
└── README.md
```

## 本地预览

```bash
cd business-days-calculator
python -m http.server 8080
```

浏览器打开 http://localhost:8080

## 部署到 Cloudflare Pages（推荐，免费 + 全球 CDN）

1. 把整个 `business-days-calculator` 文件夹推到 GitHub 仓库
2. 登录 Cloudflare Pages → Create a project → Connect to Git
3. 选择仓库，构建配置：
   - Framework preset: **None**
   - Build command: **留空**
   - Build output directory: **/**（根目录）
4. 点 Deploy，几秒后上线
5. 在 Cloudflare Pages 后台绑定自定义域名
6. 把 `robots.txt` 和 `sitemap.xml` 里的 `your-domain.com` 替换成真实域名

## 上线后必须做

1. **替换占位域名**：把 `robots.txt` 和 `sitemap.xml` 里的 `https://www.your-domain.com` 改成你的真实域名
2. **Google Search Console**：提交 sitemap.xml，申请索引
3. **Google Analytics**：在每个 HTML 的 `<head>` 里加 GA4 统计代码
4. **AdSense**：流量稳定后申请（先保证每个页面内容充足、加载快）

## 如何扩展长尾页面（矩阵打法）

每个长尾页是一套独立 URL + 独特 SEO 文案，模板一致。要加新页面：

1. 复制任意一个 `N-business-days-from-today.html`
2. 改 3 处：
   - `<title>` 和 `<meta description>`
   - `<h1>` 和正文文案
   - 脚本里的 `var DAYS = N;`
3. 在 `sitemap.xml` 加一条 URL
4. 在首页和相关页的 `.related` 区加链接

可扩展方向：
- **按天数**：7、14、21、45、60、90 business days
- **按国家**：加拿大、澳大利亚、印度（在 `business-days.js` 加 `getCAHolidays` 等函数）
- **按场景**：shipping-days、contract-deadline、payroll-cycle
- **按方向**：from-a-date、between-two-dates

## 技术说明

- 纯静态 HTML/CSS/JS，无构建步骤，无后端
- 节假日数据内置在 `business-days.js`，每年更新一次即可
- 复活节用 Anonymous Gregorian 算法计算，UK 的 Good Friday / Easter Monday 由此派生
- "X days from today" 页面每天自动计算当天结果，Google 每次抓取都能看到新鲜内容
