const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('search');
const clearSearchBtn = document.getElementById('clear-search');
const filterButtons = document.querySelectorAll('.filter-btn');

const PLACEHOLDER_SRC = 'image/placeholder.svg';
// 作品根目录（按 image 下的目录区分）
const COLLECTIONS = {
  shuihu: { key: 'shuihu', label: '水浒传', root: 'image/水浒传' },
  xiyou: { key: 'xiyou', label: '西游记', root: 'image/西游记' }
};

// 兼容：水浒传扁平目录（如果你以前按 image/108 放过，也能显示）
const IMAGE_DIR_SHUIHU_FLAT = 'image/108';
const IMAGE_EXTS = ['jpg', 'png', 'webp'];
const MAX_VARIANTS_PER_HERO = 12;

/**
 * 数据说明
 * - rank: 1~108
 * - group: 'tiangang' | 'disha'
 * - filename: 默认按 001-宋江.jpg 规则拼接（你把图放进去就会自动显示）
 */
const SHUIHU = [
  // 天罡 36
  { rank: 1, group: 'tiangang', name: '宋江', nickname: '呼保义 / 及时雨' },
  { rank: 2, group: 'tiangang', name: '卢俊义', nickname: '玉麒麟' },
  { rank: 3, group: 'tiangang', name: '吴用', nickname: '智多星' },
  { rank: 4, group: 'tiangang', name: '公孙胜', nickname: '入云龙' },
  { rank: 5, group: 'tiangang', name: '关胜', nickname: '大刀' },
  { rank: 6, group: 'tiangang', name: '林冲', nickname: '豹子头' },
  { rank: 7, group: 'tiangang', name: '秦明', nickname: '霹雳火' },
  { rank: 8, group: 'tiangang', name: '呼延灼', nickname: '双鞭' },
  { rank: 9, group: 'tiangang', name: '花荣', nickname: '小李广' },
  { rank: 10, group: 'tiangang', name: '柴进', nickname: '小旋风' },
  { rank: 11, group: 'tiangang', name: '李应', nickname: '扑天雕' },
  { rank: 12, group: 'tiangang', name: '朱仝', nickname: '美髯公' },
  { rank: 13, group: 'tiangang', name: '鲁智深', nickname: '花和尚' },
  { rank: 14, group: 'tiangang', name: '武松', nickname: '行者' },
  { rank: 15, group: 'tiangang', name: '董平', nickname: '双枪将' },
  { rank: 16, group: 'tiangang', name: '张清', nickname: '没羽箭' },
  { rank: 17, group: 'tiangang', name: '杨志', nickname: '青面兽' },
  { rank: 18, group: 'tiangang', name: '徐宁', nickname: '金枪手' },
  { rank: 19, group: 'tiangang', name: '索超', nickname: '急先锋' },
  { rank: 20, group: 'tiangang', name: '戴宗', nickname: '神行太保' },
  { rank: 21, group: 'tiangang', name: '刘唐', nickname: '赤发鬼' },
  { rank: 22, group: 'tiangang', name: '李逵', nickname: '黑旋风' },
  { rank: 23, group: 'tiangang', name: '史进', nickname: '九纹龙' },
  { rank: 24, group: 'tiangang', name: '穆弘', nickname: '没遮拦' },
  { rank: 25, group: 'tiangang', name: '雷横', nickname: '插翅虎' },
  { rank: 26, group: 'tiangang', name: '李俊', nickname: '混江龙' },
  { rank: 27, group: 'tiangang', name: '阮小二', nickname: '立地太岁' },
  { rank: 28, group: 'tiangang', name: '阮小五', nickname: '短命二郎' },
  { rank: 29, group: 'tiangang', name: '阮小七', nickname: '活阎罗' },
  { rank: 30, group: 'tiangang', name: '张横', nickname: '船火儿' },
  { rank: 31, group: 'tiangang', name: '张顺', nickname: '浪里白条' },
  { rank: 32, group: 'tiangang', name: '杨雄', nickname: '病关索' },
  { rank: 33, group: 'tiangang', name: '石秀', nickname: '拼命三郎' },
  { rank: 34, group: 'tiangang', name: '解珍', nickname: '两头蛇' },
  { rank: 35, group: 'tiangang', name: '解宝', nickname: '双尾蝎' },
  { rank: 36, group: 'tiangang', name: '燕青', nickname: '浪子' },

  // 地煞 72
  { rank: 37, group: 'disha', name: '朱武', nickname: '神机军师' },
  { rank: 38, group: 'disha', name: '黄信', nickname: '镇三山' },
  { rank: 39, group: 'disha', name: '孙立', nickname: '病尉迟' },
  { rank: 40, group: 'disha', name: '宣赞', nickname: '丑郡马' },
  { rank: 41, group: 'disha', name: '郝思文', nickname: '井木犴' },
  { rank: 42, group: 'disha', name: '韩滔', nickname: '百胜将' },
  { rank: 43, group: 'disha', name: '彭玘', nickname: '天目将' },
  { rank: 44, group: 'disha', name: '单廷圭', nickname: '圣水将' },
  { rank: 45, group: 'disha', name: '魏定国', nickname: '神火将' },
  { rank: 46, group: 'disha', name: '萧让', nickname: '圣手书生' },
  { rank: 47, group: 'disha', name: '裴宣', nickname: '铁面孔目' },
  { rank: 48, group: 'disha', name: '欧鹏', nickname: '摩云金翅' },
  { rank: 49, group: 'disha', name: '邓飞', nickname: '火眼狻猊' },
  { rank: 50, group: 'disha', name: '燕顺', nickname: '锦毛虎' },
  { rank: 51, group: 'disha', name: '杨林', nickname: '锦豹子' },
  { rank: 52, group: 'disha', name: '凌振', nickname: '轰天雷' },
  { rank: 53, group: 'disha', name: '蒋敬', nickname: '神算子' },
  { rank: 54, group: 'disha', name: '吕方', nickname: '小温侯' },
  { rank: 55, group: 'disha', name: '郭盛', nickname: '赛仁贵' },
  { rank: 56, group: 'disha', name: '安道全', nickname: '神医' },
  { rank: 57, group: 'disha', name: '皇甫端', nickname: '紫髯伯' },
  { rank: 58, group: 'disha', name: '王英', nickname: '矮脚虎' },
  { rank: 59, group: 'disha', name: '扈三娘', nickname: '一丈青' },
  { rank: 60, group: 'disha', name: '鲍旭', nickname: '丧门神' },
  { rank: 61, group: 'disha', name: '樊瑞', nickname: '混世魔王' },
  { rank: 62, group: 'disha', name: '孔明', nickname: '毛头星' },
  { rank: 63, group: 'disha', name: '孔亮', nickname: '独火星' },
  { rank: 64, group: 'disha', name: '孟康', nickname: '玉幡竿' },
  { rank: 65, group: 'disha', name: '项充', nickname: '八臂哪吒' },
  { rank: 66, group: 'disha', name: '李衮', nickname: '飞天大圣' },
  { rank: 67, group: 'disha', name: '金大坚', nickname: '玉臂匠' },
  { rank: 68, group: 'disha', name: '马麟', nickname: '铁笛仙' },
  { rank: 69, group: 'disha', name: '童威', nickname: '出洞蛟' },
  { rank: 70, group: 'disha', name: '童猛', nickname: '翻江蜃' },
  { rank: 71, group: 'disha', name: '侯健', nickname: '通臂猿' },
  { rank: 72, group: 'disha', name: '陈达', nickname: '跳涧虎' },
  { rank: 73, group: 'disha', name: '杨春', nickname: '白花蛇' },
  { rank: 74, group: 'disha', name: '郑天寿', nickname: '白面郎君' },
  { rank: 75, group: 'disha', name: '陶宗旺', nickname: '九尾龟' },
  { rank: 76, group: 'disha', name: '宋清', nickname: '铁扇子' },
  { rank: 77, group: 'disha', name: '乐和', nickname: '铁叫子' },
  { rank: 78, group: 'disha', name: '龚旺', nickname: '花项虎' },
  { rank: 79, group: 'disha', name: '丁得孙', nickname: '中箭虎' },
  { rank: 80, group: 'disha', name: '穆春', nickname: '小遮拦' },
  { rank: 81, group: 'disha', name: '曹正', nickname: '操刀鬼' },
  { rank: 82, group: 'disha', name: '宋万', nickname: '云里金刚' },
  { rank: 83, group: 'disha', name: '杜迁', nickname: '摸着天' },
  { rank: 84, group: 'disha', name: '薛永', nickname: '病大虫' },
  { rank: 85, group: 'disha', name: '施恩', nickname: '金眼彪' },
  { rank: 86, group: 'disha', name: '李忠', nickname: '打虎将' },
  { rank: 87, group: 'disha', name: '周通', nickname: '小霸王' },
  { rank: 88, group: 'disha', name: '汤隆', nickname: '金钱豹子' },
  { rank: 89, group: 'disha', name: '杜兴', nickname: '鬼脸儿' },
  { rank: 90, group: 'disha', name: '邹渊', nickname: '出林龙' },
  { rank: 91, group: 'disha', name: '邹润', nickname: '独角龙' },
  { rank: 92, group: 'disha', name: '朱贵', nickname: '旱地忽律' },
  { rank: 93, group: 'disha', name: '朱富', nickname: '笑面虎' },
  { rank: 94, group: 'disha', name: '蔡福', nickname: '铁臂膊' },
  { rank: 95, group: 'disha', name: '蔡庆', nickname: '一枝花' },
  { rank: 96, group: 'disha', name: '李立', nickname: '催命判官' },
  { rank: 97, group: 'disha', name: '李云', nickname: '青眼虎' },
  { rank: 98, group: 'disha', name: '焦挺', nickname: '没面目' },
  { rank: 99, group: 'disha', name: '石勇', nickname: '石将军' },
  { rank: 100, group: 'disha', name: '孙新', nickname: '小尉迟' },
  { rank: 101, group: 'disha', name: '顾大嫂', nickname: '母大虫' },
  { rank: 102, group: 'disha', name: '张青', nickname: '菜园子' },
  { rank: 103, group: 'disha', name: '孙二娘', nickname: '母夜叉' },
  { rank: 104, group: 'disha', name: '王定六', nickname: '活闪婆' },
  { rank: 105, group: 'disha', name: '郁保四', nickname: '险道神' },
  { rank: 106, group: 'disha', name: '白胜', nickname: '白日鼠' },
  { rank: 107, group: 'disha', name: '时迁', nickname: '鼓上蚤' },
  { rank: 108, group: 'disha', name: '段景住', nickname: '金毛犬' }
];

// 西游记（按需补充/修改人物列表）
const XIYOU = [
  { name: '孙悟空', nickname: '齐天大圣' },
  { name: '唐僧', nickname: '玄奘' },
  { name: '猪八戒', nickname: '天蓬元帅' },
  { name: '沙僧', nickname: '卷帘大将' },
  { name: '白龙马', nickname: '西海龙王三太子' },
  { name: '观音菩萨', nickname: '' },
  { name: '如来佛祖', nickname: '' },
  { name: '玉皇大帝', nickname: '' },
  { name: '太上老君', nickname: '' },
  { name: '二郎神', nickname: '杨戬' }
];

function pad3(n) {
  return String(n).padStart(3, '0');
}

function itemBaseName(collectionKey, item) {
  if (collectionKey === 'shuihu') return `${pad3(item.rank)}-${item.name}`;
  return item.name;
}

function itemVariantCandidates(collectionKey, item, variantIndex) {
  const collection = COLLECTIONS[collectionKey] || COLLECTIONS.shuihu;
  const base = itemBaseName(collectionKey, item);
  const suffix = variantIndex ? `-${variantIndex}` : '';
  const filename = `${base}${suffix}`;

  const inFolder = IMAGE_EXTS.map(ext => `${collection.root}/${item.name}/${filename}.${ext}`);

  // 水浒传兼容：扁平目录（image/108）
  if (collectionKey === 'shuihu') {
    const flat = IMAGE_EXTS.map(ext => `${IMAGE_DIR_SHUIHU_FLAT}/${filename}.${ext}`);
    return [...inFolder, ...flat];
  }

  return inFolder;
}

function setImageWithFallback(imgEl, candidates) {
  let i = 0;
  imgEl.onerror = () => {
    i += 1;
    if (i < candidates.length) {
      imgEl.src = encodeURI(candidates[i]);
      return;
    }
    imgEl.onerror = null;
    imgEl.src = PLACEHOLDER_SRC;
  };
  imgEl.src = encodeURI(candidates[i]);
}

function probeFirstExisting(candidates) {
  return new Promise((resolve) => {
    let i = 0;
    const test = new Image();
    const tryNext = () => {
      if (i >= candidates.length) {
        resolve(null);
        return;
      }
      const url = encodeURI(candidates[i]);
      test.onload = () => resolve(url);
      test.onerror = () => {
        i += 1;
        tryNext();
      };
      test.src = url;
    };
    tryNext();
  });
}

async function getItemGalleryUrls(collectionKey, item) {
  const urls = [];

  for (let i = 1; i <= MAX_VARIANTS_PER_HERO; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const found = await probeFirstExisting(itemVariantCandidates(collectionKey, item, i));
    if (!found) break;
    urls.push(found);
  }

  if (urls.length > 0) return urls;

  const single = await probeFirstExisting(itemVariantCandidates(collectionKey, item, 0));
  return single ? [single] : [];
}

function normalizeText(s) {
  return (s || '').toString().trim().toLowerCase();
}

function matchesQuery(item, q) {
  if (!q) return true;
  const hay = normalizeText(`${item.rank || ''} ${item.name || ''} ${item.nickname || ''}`);
  return hay.includes(q);
}

function setActiveFilterButton(filter) {
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

function createViewer() {
  if (document.getElementById('image-viewer')) return;

  const viewer = document.createElement('div');
  viewer.id = 'image-viewer';
  viewer.className = 'image-viewer';
  viewer.innerHTML = `
    <div class="viewer-content">
      <button class="close-btn" type="button" aria-label="关闭">×</button>
      <div class="viewer-head">
        <div class="viewer-title" id="viewer-title"></div>
        <div class="viewer-sub" id="viewer-sub"></div>
      </div>
      <div class="viewer-body">
        <button id="viewer-prev" class="nav-btn" type="button" aria-label="上一张">‹</button>
        <img id="viewer-image" alt="大图预览" />
        <button id="viewer-next" class="nav-btn" type="button" aria-label="下一张">›</button>
      </div>
      <div class="viewer-thumbs" id="viewer-thumbs" aria-label="缩略图"></div>
      <div class="viewer-actions">
        <a id="viewer-download" class="control-btn" href="#" download>下载原图</a>
      </div>
    </div>
  `;

  document.body.appendChild(viewer);

  const close = () => (viewer.style.display = 'none');
  viewer.querySelector('.close-btn').addEventListener('click', close);
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && viewer.style.display === 'flex') close();
  });
}

function openViewer(collectionKey, item) {
  const viewer = document.getElementById('image-viewer');
  const img = document.getElementById('viewer-image');
  const title = document.getElementById('viewer-title');
  const sub = document.getElementById('viewer-sub');
  const dl = document.getElementById('viewer-download');
  const prevBtn = document.getElementById('viewer-prev');
  const nextBtn = document.getElementById('viewer-next');
  const thumbs = document.getElementById('viewer-thumbs');

  if (collectionKey === 'shuihu') {
    title.textContent = `${pad3(item.rank)} · ${item.name}`;
    sub.textContent = item.nickname || '';
  } else {
    title.textContent = item.name;
    sub.textContent = item.nickname || '';
  }

  viewer.style.display = 'flex';

  img.onerror = null;
  img.src = PLACEHOLDER_SRC;
  thumbs.innerHTML = '<div class="thumbs-loading">加载图片列表...</div>';
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  dl.href = '#';

  let currentIndex = 0;
  let urls = [];

  const setCurrent = (idx) => {
    if (!urls || urls.length === 0) {
      img.onerror = null;
      img.src = PLACEHOLDER_SRC;
      dl.href = '#';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    currentIndex = ((idx % urls.length) + urls.length) % urls.length;
    const url = urls[currentIndex];
    img.onerror = () => {
      img.onerror = null;
      img.src = PLACEHOLDER_SRC;
    };
    img.src = url;

    dl.href = url;
    dl.download = `${itemBaseName(collectionKey, item)}-${currentIndex + 1}.${(url.split('.').pop() || IMAGE_EXTS[0])}`;

    prevBtn.disabled = urls.length <= 1;
    nextBtn.disabled = urls.length <= 1;

    Array.from(thumbs.querySelectorAll('.thumb')).forEach((el, i) => {
      el.classList.toggle('active', i === currentIndex);
    });
  };

  getItemGalleryUrls(collectionKey, item).then((list) => {
    urls = list || [];

    if (urls.length === 0) {
      thumbs.innerHTML = '<div class="thumbs-empty">未找到该人物图片，请按命名规则放入 image 下对应作品目录</div>';
      setCurrent(0);
      return;
    }

    thumbs.innerHTML = '';
    urls.forEach((url, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'thumb';
      b.title = `第 ${idx + 1} 张`;

      const t = document.createElement('img');
      t.loading = 'lazy';
      t.alt = `${item.name} 缩略图 ${idx + 1}`;
      t.src = url;
      t.onerror = () => {
        t.onerror = null;
        t.src = PLACEHOLDER_SRC;
      };

      b.appendChild(t);
      b.addEventListener('click', () => setCurrent(idx));
      thumbs.appendChild(b);
    });

    prevBtn.onclick = () => setCurrent(currentIndex - 1);
    nextBtn.onclick = () => setCurrent(currentIndex + 1);

    setCurrent(0);
  });
}

function render(state) {
  const q = normalizeText(state.query);
  const items = state.collectionKey === 'xiyou' ? XIYOU : SHUIHU;
  const list = items.filter(h => matchesQuery(h, q));

  gallery.innerHTML = '';

  if (list.length === 0) {
    gallery.innerHTML = '<p class="hint">没有匹配结果，换个关键词试试（例如：武松 / 行者）。</p>';
    return;
  }

  list.forEach(item => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'hero-card';
    card.title = `${item.name}${item.nickname ? `（${item.nickname}）` : ''}`;

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = `${item.name}${item.nickname ? `（${item.nickname}）` : ''}`;
    // 卡片优先显示 -1，其次单图
    setImageWithFallback(img, [
      ...itemVariantCandidates(state.collectionKey, item, 1),
      ...itemVariantCandidates(state.collectionKey, item, 0)
    ]);

    const meta = document.createElement('div');
    meta.className = 'hero-meta';
    if (state.collectionKey === 'shuihu') {
      meta.innerHTML = `
        <div class="hero-name">
          <span class="hero-rank">${pad3(item.rank)}</span>
          <span class="hero-realname">${item.name}</span>
        </div>
        <div class="hero-nickname">${item.nickname || ''}</div>
      `;
    } else {
      meta.innerHTML = `
        <div class="hero-name">
          <span class="hero-realname">${item.name}</span>
        </div>
        <div class="hero-nickname">${item.nickname || ''}</div>
      `;
    }

    card.appendChild(img);
    card.appendChild(meta);
    card.addEventListener('click', () => openViewer(state.collectionKey, item));

    gallery.appendChild(card);
  });
}

const state = {
  collectionKey: 'shuihu',
  query: ''
};

createViewer();
setActiveFilterButton(state.collectionKey);
render(state);

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    state.collectionKey = btn.dataset.filter || 'shuihu';
    setActiveFilterButton(state.collectionKey);
    render(state);
  });
});

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  render(state);
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  state.query = '';
  render(state);
  searchInput.focus();
});
