const fs = require('fs');
const docPath = 'F:/Projects/chromeProjects/xsh-mark/小红书树状管理插件-需求文档.md';
let t = fs.readFileSync(docPath, 'utf8');
const loop = fs.readFileSync('F:/Projects/chromeProjects/xsh-mark/.hallmark/insert-loop.md', 'utf8');

// 1) insert the closed-loop section before section 6
const anchor = '## 6. 落地建议与待确认事项';
if (!t.includes(anchor)) { console.error('section 6 anchor missing'); process.exit(1); }
t = t.replace(anchor, loop + anchor);

// 2) add F10 - F12 after F9
const f9 = `#### F9 · 快速添加账号（新增）
- 管理页常驻一个"快速添加账号"面板：粘贴主页链接或小红书号 → 选归到哪个方向 → 添加并收藏
- 添加后自动建账号节点、带上头像，并可在浏览器里打开该主页
- 零配置、零后端`;
const fMore = `#### F9 · 快速添加账号（新增）
- 管理页常驻一个"快速添加账号"面板：粘贴主页链接或小红书号 → 选归到哪个方向 → 添加并收藏
- 添加后自动建账号节点、带上头像，并可在浏览器里打开该主页
- 零配置、零后端

#### F10 · 页内注入层（新增 · 闭环的入口）
- 在小红书笔记页右下角注入一个「收藏到红笺」浮动按钮
- 点开是一个轻量收藏面板：归类树（复选）、批注（可留空）、标签（可后补）
- **归类默认选中上次用的位置**，让收藏变成一次点击
- 在小红书账号主页注入「收藏这个账号」按钮，整个号进树
- 收藏完成后：写回树 + 改写标签页标题 + 一条 Toast
- 只注入，不拦截页面原有操作，不读取页面未渲染的内容

#### F11 · 管理操作（新增）
- 树节点右键菜单：重命名 / 移动到 / 加标签 / 复制链接 / 写批注 / 在浏览器中打开 / 删除 / 归档
- 拖拽归位：把账号或笔记拖到另一个方向下
- 多选（⌘ 点击）后浮出批量操作条：移动到 / 加标签 / 归档 / 删除
- 收藏夹视角：最近收藏、全部收藏、只看我标注过的

#### F12 · 弹窗与反馈（新增）
- 新建分类（领域与方向共用一个对话框）
- 删除确认：不可逆动作要用户把名字打出来才可删
- 标签选择：常用标签点选 + 新标签直接建
- 导入：选文件或粘贴 JSON，同名节点询问保留哪一个
- 设置：标签页上限、是否自动改写标题、是否自动识别账号、归档方式（休眠 / 关闭）
- 反馈：看得见的结果不弹提示条，只在看不见的时候提示
- 快捷键：整套管理动作都有键盘路径`;
if (!t.includes(f9)) { console.error('F9 anchor missing'); process.exit(1); }
t = t.replace(f9, fMore);

// 3) milestones: inject the new steps
const mOld = '| **M5 阅读器** | 插件内阅读视图 + 面包屑 + 上一篇/下一篇 + 就地批注栏 | 点头像或笔记卡 → 在插件内像网页一样读，导航全在插件内闭环 |';
const mNew = `| **M5 阅读器** | 插件内阅读视图 + 面包屑 + 上一篇/下一篇 + 就地批注栏 | 点头像或笔记卡 → 在插件内像网页一样读，导航全在插件内闭环 |
| **M5.5 注入层** | 小红书页内的收藏按钮 + 收藏面板 + 账号收藏按钮 | 在小红书笔记页点一下就能收藏，且归类默认选中上次用的位置 |
| **M5.8 管理与弹窗** | 右键菜单 / 拖拽 / 批量条 / 新建 / 删除确认 / 标签选择 / 设置 / 快捷键 | 树上每个节点右键都有完整操作，且有键盘路径 |`;
if (!t.includes(mOld)) { console.error('milestone anchor missing'); process.exit(1); }
t = t.replace(mOld, mNew);

fs.writeFileSync(docPath, t, 'utf8');
console.log('doc updated: loop section + F10-F12 + milestones');
