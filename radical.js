// 1. 拼字题库数据：偏旁 + 部件 = 合成字
const questionPool = [
    { id: 'q1', radical: "氵", component: "每", result: "海" },
    { id: 'q2', radical: "亻", component: "尔", result: "你" },
    { id: 'q3', radical: "木", component: "寸", result: "村" },
    { id: 'q4', radical: "艹", component: "化", result: "花" },
    { id: 'q5', radical: "讠", component: "兑", result: "说" },
    { id: 'q6', radical: "日", component: "月", result: "明" },
    { id: 'q7', radical: "女", component: "马", result: "妈" }
];

let matchedCount = 0;
const totalQuestions = 5; // 每次随机抽5题

const radicalsContainer = document.getElementById('radicals');
const charactersContainer = document.getElementById('characters');

// 2. 初始化游戏
function initGame() {
    // 随机抽取5道题
    const currentQuestions = [...questionPool].sort(() => 0.5 - Math.random()).slice(0, totalQuestions);
    
    // 分别打乱左侧（偏旁）和右侧（部件）的顺序
    const shuffledRadicals = [...currentQuestions].sort(() => 0.5 - Math.random());
    const shuffledComponents = [...currentQuestions].sort(() => 0.5 - Math.random());

    // 渲染左侧：偏旁卡片 (例如：氵)
    shuffledRadicals.forEach(q => {
        const card = document.createElement('div');
        card.className = "card bg-blue-400 p-6 rounded-2xl shadow-lg text-center text-4xl font-bold text-white z-10";
        card.dataset.id = q.id;
        card.innerText = q.radical;
        radicalsContainer.appendChild(card);
    });

    // 渲染右侧：部件接收区 (例如：每)
    // 注意这里增加了 data-result 属性，用于合成字
    shuffledComponents.forEach(q => {
        const zoneWrapper = document.createElement('div');
        zoneWrapper.innerHTML = `
            <div class="drop-zone relative bg-white border-4 border-dashed border-gray-300 rounded-2xl text-4xl font-bold text-gray-700 w-full flex items-center justify-center min-h-[100px]" 
                 data-id="${q.id}" 
                 data-result="${q.result}">
                <span class="component-text transition-all duration-300">${q.component}</span>
                <div class="star-container absolute -top-6 -right-6 opacity-0 scale-50 pointer-events-none text-5xl">🌟</div>
            </div>
        `;
        charactersContainer.appendChild(zoneWrapper);
    });

    setupDragAndDrop();
}

// 3. 配置拖拽逻辑
function setupDragAndDrop() {
    new Sortable(radicalsContainer, {
        group: { name: 'shared', pull: true, put: false },
        animation: 150,
        sort: false 
    });

    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        new Sortable(zone, {
            group: { name: 'shared', put: true },
            animation: 150,
            onAdd: function (evt) {
                const draggedItem = evt.item; 
                const targetZone = evt.to;    

                // 判断是否匹配
                if (draggedItem.dataset.id === targetZone.dataset.id) {
                    handleSuccess(draggedItem, targetZone);
                } else {
                    handleFailure(draggedItem);
                }
            }
        });
    });
}

// 4. 成功反馈逻辑 (文字变身)
function handleSuccess(item, zone) {
    // 1. 隐藏被拖进来的偏旁卡片（因为它已经和部件"融合"了）
    item.style.display = 'none';
    
    // 2. 获取目标格子里的文字和合成字结果
    const textSpan = zone.querySelector('.component-text');
    const resultCharacter = zone.dataset.result;
    
    // 3. 执行“合成”视觉效果
    zone.classList.replace('border-gray-300', 'border-green-500');
    zone.classList.replace('border-dashed', 'border-solid');
    zone.classList.add('bg-green-50');
    
    // 将“每”变成“海”，并放大变色
    textSpan.innerText = resultCharacter;
    textSpan.classList.add('text-green-600', 'text-5xl', 'scale-125');

    // 4. 触发闪烁和星星动画
    zone.classList.add('animate-success-flash');
    const star = zone.querySelector('.star-container');
    if (star) {
        star.classList.add('animate-star-pop');
        star.addEventListener('animationend', () => {
            star.classList.remove('animate-star-pop');
            zone.classList.remove('animate-success-flash');
        }, { once: true });
    }

    // 5. 更新进度条
    matchedCount++;
    document.getElementById('progress-bar').style.width = `${(matchedCount / totalQuestions) * 100}%`;
    document.getElementById('progress-text').innerText = `${matchedCount} / ${totalQuestions}`;

    if (matchedCount === totalQuestions) {
        setTimeout(() => alert("太棒了！你拼出了所有的汉字！🎉"), 600);
    }
}

// 5. 失败弹回逻辑
function handleFailure(item) {
    setTimeout(() => {
        radicalsContainer.appendChild(item);
    }, 200);
}

// 启动游戏
initGame();
