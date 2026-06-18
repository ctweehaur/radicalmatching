const questionPool = [
    { id: 1, radical: "氵", character: "海" },
    { id: 2, radical: "亻", character: "你" },
    { id: 3, radical: "木", character: "村" },
    { id: 4, radical: "艹", character: "花" },
    { id: 5, radical: "讠", character: "说" }
];

let matchedCount = 0;
const radicalsContainer = document.getElementById('radicals');
const charactersContainer = document.getElementById('characters');

// 随机出题并渲染
const questions = [...questionPool].sort(() => 0.5 - Math.random());

questions.forEach(q => {
    radicalsContainer.innerHTML += `
        <div class="card bg-blue-400 p-6 rounded-2xl shadow-lg text-center text-4xl font-bold text-white" 
             data-id="${q.id}">${q.radical}</div>`;
    
    charactersContainer.innerHTML += `
        <div class="drop-zone relative bg-white border-4 border-dashed border-gray-300 p-6 rounded-2xl text-center text-4xl font-bold text-gray-700" 
             data-id="${q.id}">
            ${q.character}
            <div class="star-container absolute -top-4 -right-4 opacity-0 scale-50">🌟</div>
        </div>`;
});

// 初始化交互
new Sortable(radicalsContainer, { group: 'shared', sort: false });

new Sortable(charactersContainer, {
    group: 'shared',
    onAdd: function (evt) {
        const item = evt.item;
        const target = evt.to;
        if (item.dataset.id === target.dataset.id) {
            item.classList.add('bg-green-500');
            target.classList.add('animate-success-flash');
            target.querySelector('.star-container').classList.add('animate-star-pop');
            matchedCount++;
            document.getElementById('progress-bar').style.width = (matchedCount / 5 * 100) + '%';
            document.getElementById('progress-text').innerText = matchedCount + '/5';
        } else {
            alert("再试一次哦！");
            radicalsContainer.appendChild(item);
        }
    }
});
