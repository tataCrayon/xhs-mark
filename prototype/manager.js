/* Small, framework-free interaction layer for the manager prototype. */
(() => {
  const tree = document.querySelector('.navigator .tree');
  const notes = [...document.querySelectorAll('[data-note-owner]')];
  if (!tree) return;

  const accountProfiles = {
    '花扑Huapu': {
      avatar: 'huapu', path: '串珠领域 / 做手链的', meta: '小红书号 lct0826 · IP属地 山东',
      bio: '独立设计生产，主打天然石与性价比。\n关注配色、配绳和日常叠戴灵感。',
      note: '配线留 2cm 余量这条要照抄。发货只等一天，价格是同类里最狠的。',
      stats: ['306', '2万', '9.6万'], title: '花扑HUAPU · 安静的蓝调色'
    },
    '白玉小铺': {
      avatar: 'baiyu', path: '串珠领域 / 做手链的', meta: '小红书号 baiyu_daily · IP属地 浙江',
      bio: '白玉、珍珠与日常首饰。\n记录材质选择和耐看的搭配。',
      note: '关注白玉配绳的尺寸说明，适合和素银叠戴的笔记一起看。',
      stats: ['128', '8,621', '3.2万'], title: '白玉小铺 · 白玉珠串的日常搭配'
    },
    '晶石记事': {
      avatar: 'jing-shi', path: '串珠领域 / 蓝色水晶', meta: '小红书号 crystal_notes · IP属地 江苏',
      bio: '晶石原矿观察与选购记录。\n重点看纹理、净度和自然光下的颜色。',
      note: '蓝晶原矿的开箱可留作后续选料参考。',
      stats: ['86', '1.3万', '4.8万'], title: '晶石记事 · 蓝晶原矿的纹理与净度'
    }
  };

  let selected = { type: 'account', name: '花扑Huapu', path: '串珠领域 / 做手链的 / 花扑Huapu' };
  let filter = 'account';

  function selectNode(button) {
    tree.querySelectorAll('[data-select]').forEach(node => node.removeAttribute('aria-current'));
    tree.querySelectorAll('.node.is-selected').forEach(node => node.classList.remove('is-selected'));
    button.setAttribute('aria-current', 'true');
    button.closest('.node')?.classList.add('is-selected');
    selected = { ...button.dataset, type: button.dataset.select };
    filter = 'account';
    updateFilterButtons();
    renderSelection();
  }

  function updateFilterButtons() {
    document.querySelectorAll('.workbench__notes .seg__btn').forEach((button, index) => {
      const isCurrent = (filter === 'account' && index === 0) || (filter === 'annotated' && index === 1) || (filter === 'all' && index === 2);
      if (isCurrent) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
      if (index === 0) button.textContent = selected.type === 'account' ? '这个账号' : '这个分类';
    });
  }

  function notesTitle() {
    if (filter === 'all') return '全部收藏';
    if (filter === 'annotated') return '我标注过的笔记';
    const lead = /[A-Za-z0-9]$/.test(selected.name) ? `${selected.name} ` : selected.name;
    return `${lead}的笔记`;
  }

  function renderSelection() {
    const isAccount = selected.type === 'account';
    const profile = accountProfiles[selected.name];
    document.querySelector('[data-selection-path]').textContent = selected.path;
    document.querySelector('[data-notes-title]').textContent = notesTitle();

    let visible = notes.filter(card => {
      if (filter === 'all') return true;
      if (filter === 'annotated') return card.dataset.hasNote === 'true';
      if (selected.type === 'domain') return card.dataset.noteDomain === selected.name;
      if (selected.type === 'direction') return card.dataset.noteDirection === selected.name && card.dataset.noteDomain === selected.path.split(' / ')[0];
      return card.dataset.noteOwner === selected.name;
    });
    notes.forEach(card => { card.hidden = !visible.includes(card); });
    document.querySelector('[data-notes-hint]').textContent = `${visible.length} 篇收藏 · ${filter === 'annotated' ? '仅显示有批注的内容' : filter === 'all' ? '按收藏时间整理' : '点击笔记进入插件内阅读'}`;
    document.querySelector('[data-notes-empty]').hidden = visible.length !== 0;

    const panel = document.querySelector('[data-account-panel]');
    panel.hidden = !isAccount;
    document.querySelector('.workbench').classList.toggle('workbench--category', !isAccount);
    if (!isAccount || !profile) return;
    document.querySelector('[data-account-name]').textContent = selected.name;
    document.querySelector('[data-account-path]').textContent = profile.path;
    document.querySelector('[data-account-meta]').textContent = profile.meta;
    document.querySelector('[data-account-bio]').textContent = profile.bio;
    document.querySelector('[data-account-note]').value = profile.note;
    document.querySelector('[data-tab-title]').textContent = profile.title;
    const avatar = document.querySelector('[data-account-avatar]');
    avatar.src = `./assets/img/avatar-${profile.avatar}.jpg`;
    avatar.alt = `${selected.name} 的头像`;
    document.querySelectorAll('[data-account-stats] b').forEach((stat, index) => { stat.textContent = profile.stats[index]; });
  }

  tree.addEventListener('click', event => {
    const twisty = event.target.closest('.node__twisty');
    if (twisty) {
      const item = twisty.closest('[role="treeitem"]');
      const group = item?.querySelector(':scope > [role="group"]');
      if (!group) return;
      const expanded = twisty.getAttribute('aria-expanded') !== 'true';
      twisty.setAttribute('aria-expanded', String(expanded));
      twisty.setAttribute('aria-label', `${expanded ? '折叠' : '展开'} ${twisty.getAttribute('aria-label').replace(/^(折叠|展开)\s*/, '')}`);
      item.setAttribute('aria-expanded', String(expanded));
      group.hidden = !expanded;
      return;
    }
    const select = event.target.closest('[data-select]');
    if (select) selectNode(select);
  });

  document.querySelector('[data-collapse-all]')?.addEventListener('click', event => {
    const shouldCollapse = event.currentTarget.textContent === '全部收起';
    tree.querySelectorAll('.node__twisty').forEach(button => {
      button.setAttribute('aria-expanded', String(!shouldCollapse));
      button.setAttribute('aria-label', `${shouldCollapse ? '展开' : '折叠'} ${button.getAttribute('aria-label').replace(/^(折叠|展开)\s*/, '')}`);
      const item = button.closest('[role="treeitem"]');
      item.setAttribute('aria-expanded', String(!shouldCollapse));
      item.querySelector(':scope > [role="group"]').hidden = shouldCollapse;
    });
    event.currentTarget.textContent = shouldCollapse ? '全部展开' : '全部收起';
  });

  document.querySelectorAll('.workbench__notes .seg__btn').forEach((button, index) => {
    button.addEventListener('click', () => {
      filter = ['account', 'annotated', 'all'][index];
      updateFilterButtons();
      renderSelection();
    });
  });

  document.querySelector('.quickadd__form')?.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('#qa-url');
    const button = event.currentTarget.querySelector('[type="submit"]');
    if (!input.value.trim()) {
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    button.textContent = '已添加';
    button.disabled = true;
    window.setTimeout(() => { button.textContent = '添加'; button.disabled = false; input.value = ''; }, 1400);
  });
})();
