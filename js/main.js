// ==================== 素材数据 ====================
const materialData = {
    '都市人物(男)': [
        {
            id: 1,
            thumbnail: 'image/都市人物(男)/都市人物_男1_s.jpg',
            original: 'image/都市人物(男)/都市人物_男1.jpg',
            name: '都市人物-男-1',
            title: '都市青年角色设计',
            description: '现代都市风格的男性角色设计，适合游戏、动画等项目使用。包含完整的角色立绘和动作素材。',
            category: '都市人物(男)',
            isFree: true,
            isExclusive: true,
            hasCopyright: true,
            date: '2025-03-01',
            gifs: [
                'action/都市人物(男)/都市人物_男1_走路.gif',
                'action/都市人物(男)/都市人物_男1_跑步.gif'
            ]
        },
        {
            id: 2,
            thumbnail: 'image/都市人物(男)/都市人物_男2_s.jpg',
            original: 'image/都市人物(男)/都市人物_男2.jpg',
            name: '都市人物-男-2',
            title: '时尚男性模特',
            description: '时尚风格的男性角色，适合服装展示、广告设计等项目。',
            category: '都市人物(男)',
            isFree: true,
            isExclusive: false,
            hasCopyright: true,
            date: '2025-03-02',
            gifs: []
        },
        {
            id: 3,
            thumbnail: 'image/都市人物(男)/都市人物_男3_s.jpg',
            original: 'image/都市人物(男)/都市人物_男3.jpg',
            name: '都市人物-男-3',
            title: '街头涂鸦艺术家',
            description: '街头文化风格的艺术家角色，充满个性与创意。',
            category: '都市人物(男)',
            isFree: true,
            isExclusive: true,
            hasCopyright: true,
            date: '2025-03-03',
            gifs: []
        },
        {
            id: 4,
            thumbnail: 'image/都市人物(男)/都市人物_男4_s.jpg',
            original: 'image/都市人物(男)/都市人物_男4.jpg',
            name: '都市人物-男-4',
            title: '程序员角色设计',
            description: 'IT行业从业者形象，适合科技公司、互联网项目使用。',
            category: '都市人物(男)',
            isFree: true,
            isExclusive: false,
            hasCopyright: true,
            date: '2025-03-04',
            gifs: [
                'action/都市人物(男)/都市人物_男1_走路.gif',
                'action/都市人物(男)/都市人物_男1_跑步.gif'
            ]
        }
    ],
    '都市人物(女)': [
        {
            id: 5,
            thumbnail: 'image/都市人物(女)/都市人物_女1_s.jpg',
            original: 'image/都市人物(女)/都市人物_女1.jpg',
            name: '都市人物-女-1',
            title: '都市白领女性',
            description: '职场女性形象设计，优雅大方，适合商务场景使用。',
            category: '都市人物(女)',
            isFree: true,
            isExclusive: true,
            hasCopyright: true,
            date: '2025-03-05',
            gifs: [
                'action/都市人物(女)/都市人物_女1_走路.gif',
                'action/都市人物(女)/都市人物_女1_跑步.gif'
            ]
        }
    ],
    '修仙人物(男)': [
        {
            id: 6,
            thumbnail: 'image/修仙人物(男)/修仙人物_男1_s.jpg',
            original: 'image/修仙人物(男)/修仙人物_男1.jpg',
            name: '修仙人物-男-1',
            title: '修真者角色设计',
            description: '古风修仙题材男性角色，仙气飘飘，适合仙侠类游戏和小说插画。',
            category: '修仙人物(男)',
            isFree: true,
            isExclusive: true,
            hasCopyright: true,
            date: '2025-03-06',
            gifs: []
        }
    ],
    '修仙人物(女)': [],
    '动物': []
};

// ==================== 全局状态 ====================
let currentPage = 1;
const itemsPerPage = 12;
let currentFilters = {
    category: 'all'
};
let filteredMaterials = [];

// ==================== DOM元素 ====================
const gallery = document.getElementById('gallery');
const paginationContainer = document.getElementById('pagination');
const totalCountElement = document.getElementById('total-count');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    initMaterialModal();
    loadMaterials();
});

// ==================== 筛选功能 ====================
function initFilters() {
    // 分类筛选
    const categoryBtns = document.querySelectorAll('#category-filter .filter-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilters.category = this.dataset.category;
            currentPage = 1;
            loadMaterials();
        });
    });

    // 搜索功能
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const keyword = searchInput.value.trim().toLowerCase();
    if (keyword) {
        currentFilters.search = keyword;
    } else {
        delete currentFilters.search;
    }
    currentPage = 1;
    loadMaterials();
}

// ==================== 加载素材 ====================
function loadMaterials() {
    // 显示加载状态
    showLoading();

    // 使用 requestAnimationFrame 确保在下一帧渲染，避免阻塞
    requestAnimationFrame(() => {
        // 筛选素材
        filteredMaterials = filterMaterials();
        
        // 更新总数
        totalCountElement.textContent = filteredMaterials.length;
        
        // 清空画廊
        gallery.innerHTML = '';
        
        if (filteredMaterials.length === 0) {
            showEmptyState();
            paginationContainer.innerHTML = '';
            return;
        }

        // 分页
        const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageMaterials = filteredMaterials.slice(startIndex, endIndex);

        // 渲染素材卡片
        pageMaterials.forEach(material => {
            const card = createMaterialCard(material);
            gallery.appendChild(card);
        });

        // 渲染分页
        if (totalPages > 1) {
            renderPagination(totalPages);
        } else {
            paginationContainer.innerHTML = '';
        }
    });
}

function filterMaterials() {
    let materials = [];
    
    // 收集所有素材
    Object.values(materialData).forEach(categoryMaterials => {
        materials = materials.concat(categoryMaterials);
    });

    // 应用筛选条件
    return materials.filter(material => {
        // 分类筛选
        if (currentFilters.category !== 'all' && material.category !== currentFilters.category) {
            return false;
        }

        // 搜索关键词
        if (currentFilters.search) {
            const searchLower = currentFilters.search.toLowerCase();
            const matchTitle = material.title.toLowerCase().includes(searchLower);
            const matchName = material.name.toLowerCase().includes(searchLower);
            const matchCategory = material.category.toLowerCase().includes(searchLower);
            if (!matchTitle && !matchName && !matchCategory) {
                return false;
            }
        }

        return true;
    });
}

function createMaterialCard(material) {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.dataset.id = material.id;

    // 标签
    let tagsHtml = '';
    tagsHtml += '<span class="card-tag tag-free">免费</span>';
    if (material.isExclusive) {
        tagsHtml += '<span class="card-tag tag-exclusive">独家</span>';
    }
    if (material.hasCopyright) {
        tagsHtml += '<span class="card-tag tag-copyright">版权</span>';
    }

    card.innerHTML = `
        <div class="card-image">
            <img src="${material.thumbnail}" alt="${material.title}" loading="lazy">
            <div class="card-tags">${tagsHtml}</div>
        </div>
        <div class="card-info">
            <h3 class="card-title">${material.title}</h3>
            <div class="card-meta">
                <span class="card-category">${material.category}</span>
                <span>${material.date}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openMaterialModal(material));

    return card;
}

function showLoading() {
    gallery.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">加载中...</p>
        </div>
    `;
}

function showEmptyState() {
    gallery.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📭</div>
            <p class="empty-text">暂无符合条件的素材</p>
        </div>
    `;
}

// ==================== 分页功能 ====================
function renderPagination(totalPages) {
    paginationContainer.innerHTML = '';

    // 总数信息
    const totalInfo = document.createElement('span');
    totalInfo.className = 'total-info';
    totalInfo.textContent = `共${filteredMaterials.length}条`;
    paginationContainer.appendChild(totalInfo);

    // 上一页
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-nav-btn';
    prevBtn.innerHTML = '&lt;';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadMaterials();
            scrollToTop();
        }
    });
    paginationContainer.appendChild(prevBtn);

    // 页码按钮
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    if (startPage > 1) {
        const firstBtn = createPageButton(1);
        paginationContainer.appendChild(firstBtn);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'ellipsis';
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = createPageButton(i);
        paginationContainer.appendChild(btn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'ellipsis';
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
        const lastBtn = createPageButton(totalPages);
        paginationContainer.appendChild(lastBtn);
    }

    // 下一页
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-nav-btn';
    nextBtn.innerHTML = '&gt;';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadMaterials();
            scrollToTop();
        }
    });
    paginationContainer.appendChild(nextBtn);

    // 跳转输入
    const goToDiv = document.createElement('div');
    goToDiv.className = 'go-to-page';
    goToDiv.innerHTML = `
        <span>前往</span>
        <input type="number" class="page-input" min="1" max="${totalPages}" value="${currentPage}">
        <span>页</span>
        <button class="go-btn">确定</button>
    `;
    
    const pageInput = goToDiv.querySelector('.page-input');
    const goBtn = goToDiv.querySelector('.go-btn');
    
    goBtn.addEventListener('click', () => {
        let page = parseInt(pageInput.value);
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            loadMaterials();
            scrollToTop();
        }
    });
    
    pageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            goBtn.click();
        }
    });
    
    paginationContainer.appendChild(goToDiv);
}

function createPageButton(pageNum) {
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    if (pageNum === currentPage) {
        btn.classList.add('active');
    }
    btn.textContent = pageNum;
    btn.addEventListener('click', () => {
        currentPage = pageNum;
        loadMaterials();
        scrollToTop();
    });
    return btn;
}

function scrollToTop() {
    document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
}

// ==================== 素材详情弹窗 ====================
let currentMaterial = null;

function initMaterialModal() {
    const modal = document.getElementById('material-modal');
    const closeBtn = modal.querySelector('.modal-close');

    closeBtn.addEventListener('click', closeMaterialModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeMaterialModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeMaterialModal();
        }
    });

    // 下载按钮
    document.getElementById('btn-download').addEventListener('click', () => {
        if (currentMaterial) {
            downloadMaterial(currentMaterial);
        }
    });
}

function openMaterialModal(material) {
    currentMaterial = material;
    const modal = document.getElementById('material-modal');

    // 填充数据
    document.getElementById('modal-main-image').src = material.original;
    document.getElementById('modal-title').textContent = material.title;
    document.getElementById('modal-category').textContent = material.category;
    document.getElementById('modal-date').textContent = material.date;
    document.getElementById('modal-description').textContent = material.description || '暂无描述';

    // 标签
    const exclusiveTag = document.getElementById('modal-tag-exclusive');
    const copyrightTag = document.getElementById('modal-tag-copyright');
    exclusiveTag.style.display = material.isExclusive ? 'inline-block' : 'none';
    copyrightTag.style.display = material.hasCopyright ? 'inline-block' : 'none';

    // 缩略图
    const thumbnailsContainer = document.getElementById('modal-thumbnails');
    thumbnailsContainer.innerHTML = `
        <img src="${material.thumbnail}" class="active" data-src="${material.original}">
    `;

    // 如果有GIF，添加GIF缩略图
    if (material.gifs && material.gifs.length > 0) {
        material.gifs.forEach(gif => {
            const img = document.createElement('img');
            img.src = gif;
            img.dataset.src = gif;
            img.addEventListener('click', function() {
                document.getElementById('modal-main-image').src = this.dataset.src;
                thumbnailsContainer.querySelectorAll('img').forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
            thumbnailsContainer.appendChild(img);
        });
    }

    // 缩略图点击事件
    thumbnailsContainer.querySelectorAll('img').forEach(thumb => {
        thumb.addEventListener('click', function() {
            document.getElementById('modal-main-image').src = this.dataset.src;
            thumbnailsContainer.querySelectorAll('img').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeMaterialModal() {
    const modal = document.getElementById('material-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    currentMaterial = null;
}

function downloadMaterial(material) {
    // 模拟下载
    const btn = document.getElementById('btn-download');
    const originalText = btn.textContent;
    btn.textContent = '下载中...';
    btn.disabled = true;

    setTimeout(() => {
        // 创建下载链接
        const link = document.createElement('a');
        link.href = material.original;
        link.download = `${material.name}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        btn.textContent = '下载成功';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    }, 1000);
}

