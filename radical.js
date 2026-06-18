// 1. 题库数据 (可以随时在这里增加或修改题目)
const questionPool = [
    { id: 'q1', radical: "氵", character: "海" },
    { id: 'q2', radical: "亻", character: "你" },
    { id: 'q3', radical: "木", character: "村" },
    { id: 'q4', radical: "艹", character: "花" },
    { id: 'q5', radical: "讠", character: "说" }
];

let matchedCount = 0;
const totalQuestions = 5;

// 获取 DOM 容器
const radicalsContainer = document.getElementById('radicals');
const charactersContainer = document.getElementById('characters');

// 2. 初始化游戏：打乱顺序并渲染
function initGame() {
    // 将题库打乱并截取需要的数量
    const currentQuestions = [...questionPool].sort(() => 0.5 - Math.random()).slice(0, totalQuestions);
    
    // 为了增加难度，分别打乱偏旁和汉字的显示顺序
    const shuffledRadicals = [...currentQuestions].sort(() => 0.5 - Math.random());
    const shuffledCharacters = [...currentQuestions].sort(() => 0.5 - Math.random());

    // 渲染偏旁卡片
    shuffledRadicals.forEach(q => {
        const card = document.createElement('div');
        card.className = "card bg-blue-400 p-6 rounded-2xl shadow-lg text-center text-4xl font-bold text-white z-10";
        card.dataset.id = q.id;
        card.innerText = q.radical;
        radicalsContainer.appendChild(card);
    });

    // 渲染汉字接收区
    shuffledCharacters.forEach(q => {
        const zoneWrapper = document.createElement('div');
        // 将 data-id 绑在 drop-zone 容器上，方便比对
        zoneWrapper.innerHTML = `
            <div class="drop-zone relative bg-white border-4 border-dashed border-gray-300 rounded-2xl text-4xl font-bold text-gray-700 w-full" data-id="${q.id}">
                <span>${q.character}</span>
                <div class="star-container absolute -top-6 -right-6 opacity-0 scale-50 pointer-events-none text-5xl">🌟</div>
            </div>
        `;
        charactersContainer.appendChild(zoneWrapper);
    });

    setupDragAndDrop();
}

// 3. 配置拖拽逻辑
function setupDragAndDrop() {
    // 左侧偏旁区设为 Sortable
    new Sortable(radicalsContainer, {
        group: { name: 'shared', pull: true, put: false }, // 允许拖出，不允许拖入
        animation: 150,
        sort: false // 禁止在左侧内部重新排序
    });

    // 获取所有右侧的接收框，将它们分别设为 Sortable
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        new Sortable(zone, {
            group: { name: 'shared', put: true },
            animation: 150,
            onAdd: function (evt) {
                const draggedItem = evt.item; // 拖拽的偏旁卡片
                const targetZone = evt.to;    // 放下的汉字框

                // 核心判断：偏旁的 id 是否等于 汉字框的 id
                if (draggedItem.dataset.id === targetZone.dataset.id) {
                    // 匹配成功！
                    handleSuccess(draggedItem, targetZone);
                } else {
                    // 匹配失败！弹回原处
                    handleFailure(draggedItem);
                }
            }
        });
    });
}

// 4. 成功反馈逻辑
function handleSuccess(item, zone) {
    // 改变卡片颜色，移除拖拽状态
    item.classList.replace('bg-blue-400', 'bg-green-500');
    item.style.cursor = 'default';
    item.style.boxShadow = 'none';
    
    // 触发边框闪烁和星星动画
    zone.classList.add('animate-success-flash');
    const star = zone.querySelector('.star-container');
    if (star) {
        star.classList.add('animate-star-pop');
        star.addEventListener('animationend', () => {
            star.classList.remove('animate-star-pop');
            zone.classList.remove('animate-success-flash');
        }, { once: true });
    }

    // 更新进度条
    matchedCount++;
    document.getElementById('progress-bar').style.width = `${(matchedCount / totalQuestions) * 100}%`;
    document.getElementById('progress-text').innerText = `${matchedCount} / ${totalQuestions}`;

    // 通关判断
    if (matchedCount === totalQuestions) {
        setTimeout(() => alert("太厉害了！你完成了所有挑战！🎉"), 600);
    }
}

// 5. 失败弹回逻辑
function handleFailure(item) {
    // 稍微延迟一下再弹回，体验更自然
    setTimeout(() => {
        // 利用 Sortable 实例或者 DOM 原生方法将其放回左侧
        radicalsContainer.appendChild(item);
    }, 200);
}

// 启动游戏
initGame();
