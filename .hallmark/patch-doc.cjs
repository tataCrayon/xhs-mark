const fs = require('fs');
const docPath = 'F:/Projects/chromeProjects/xsh-mark/小红书树状管理插件-需求文档.md';
let t = fs.readFileSync(docPath, 'utf8');
const wf = fs.readFileSync('F:/Projects/chromeProjects/xsh-mark/.hallmark/wireframe-manager.md', 'utf8');

const startMark = '**② 管理页 · 编辑台（三栏，宽屏充分利用）**';
const endMark = '**③ 阅读器';
const i = t.indexOf(startMark);
const j = t.indexOf(endMark);
if (i < 0 || j < 0) { console.error('anchors not found', i, j); process.exit(1); }
t = t.slice(0, i) + wf + t.slice(j);

const oldFiles = '| `prototype/states.html` | **状态预览**（四种数据态 + 控件八态 + 输入框态） | 实现时对照 |';
const newFiles = [
  '| `prototype/inject.html` | **小红书页内注入层**（右下角收藏按钮 + 收藏面板 + 账号收藏按钮） | 浏览器直接打开 |',
  '| `prototype/dialogs.html` | **弹窗与菜单体系**（新建分类 / 删除确认 / 标签选择 / 批量条 / 右键菜单 / 导入 / 设置 / 反馈 / 快捷键） | 浏览器直接打开 |',
  oldFiles,
].join('\n');
if (!t.includes(oldFiles)) { console.error('file list anchor missing'); process.exit(1); }
t = t.replace(oldFiles, newFiles);

fs.writeFileSync(docPath, t, 'utf8');
console.log('doc updated');
