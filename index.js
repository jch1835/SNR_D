// JSON 데이터 로드
fetch('dogam_info/index_menu.json')
  .then(response => response.json())
  .then(jsonData => {
    const data = mergeJson(jsonData);

    fetch('dogam_info/character_info.json')
      .then(response => response.json())
      .then(characterData => {
        init(data, characterData);
      });
  })
  .catch(error => console.error('JSON 데이터 로드 실패:', error));

// JSON 배열 합치기
function mergeJson(jsonArray) {
  return jsonArray.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

function init(data, characters) {
  const navContainer = document.getElementById("nav-buttons");
  const data1Container = document.getElementById("data1-filters");
  const data2Container = document.getElementById("data2-filters");
  const cardsContainer = document.getElementById("cards");

  let currentData1Filters = [];
  let currentCharacters = characters;

  // 네비 버튼 렌더링
  data.navButtons.forEach(btn => {
    const button = document.createElement("button");
    button.id = btn.id;
    button.textContent = btn.label;
    button.className = "nav-btn";
    if (btn.active) button.classList.add("active");
    navContainer.appendChild(button);
  });

  // 네비 버튼 클릭 이벤트
  navContainer.addEventListener("click", e => {
    if (e.target.classList.contains("nav-btn")) {
      document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
      e.target.classList.add("active");

      const selectedId = e.target.id;
      if (selectedId === "character-dogam") {
        currentData1Filters = data.data1Filters;
      } else if (selectedId === "pet-dogam") {
        currentData1Filters = data.data2Filters;
      } else if (selectedId === "equip-dogam") {
        currentData1Filters = data.data3Filters;
      }

      renderData1();
    }
  });

  // 구분1 렌더링
  function renderData1() {
    data1Container.innerHTML = "<h2>구분 1</h2>";
    currentData1Filters.forEach((item, index) => {
      const button = document.createElement("button");
      button.textContent = item.label;
      button.className = "data1-btn";
      button.dataset.type = item.type;
      if (index === 0) button.classList.add("active");
      data1Container.appendChild(button);
    });

    if (currentData1Filters.length > 0) {
      const first = currentData1Filters[0];
      renderData2(first.subFilters);
      renderCards(first.type, first.subFilters[0].type);
    } else {
      data2Container.innerHTML = "<h2>구분 2</h2>";
      cardsContainer.innerHTML = "";
    }
  }

  // 구분1 클릭 이벤트
  data1Container.addEventListener("click", e => {
    if (e.target.classList.contains("data1-btn")) {
      document.querySelectorAll(".data1-btn").forEach(btn => btn.classList.remove("active"));
      e.target.classList.add("active");

      const selected = currentData1Filters.find(item => item.type === e.target.dataset.type);
      if (selected) {
        renderData2(selected.subFilters);
        renderCards(selected.type, selected.subFilters[0].type);
      }
    }
  });

  // 구분2 렌더링
  function renderData2(subFilters) {
    data2Container.innerHTML = "<h2>구분 2</h2>";
    subFilters.forEach((sub, index) => {
      const button = document.createElement("button");
      button.textContent = sub.label;
      button.className = "data2-btn";
      button.dataset.type = sub.type;
      if (index === 0) button.classList.add("active");
      data2Container.appendChild(button);
    });
  }

  // 구분2 클릭 이벤트
  data2Container.addEventListener("click", e => {
    if (e.target.classList.contains("data2-btn")) {
      document.querySelectorAll(".data2-btn").forEach(btn => btn.classList.remove("active"));
      e.target.classList.add("active");

      const data1Type = document.querySelector(".data1-btn.active")?.dataset.type;
      const data2Type = e.target.dataset.type;
      renderCards(data1Type, data2Type);
    }
  });

  // 카드 렌더링
  function renderCards(data1Type, data2Type) {
    cardsContainer.innerHTML = "";

    const filtered = currentCharacters.filter(char =>
      char.data1 === data1Type && char.data2 === data2Type
    );

    if (filtered.length === 0) {
      cardsContainer.innerHTML = "<p>해당 캐릭터가 없습니다.</p>";
      return;
    }

    filtered.forEach(char => {
      const card = document.createElement("div");
      card.className = "character-card";
      card.innerHTML = `
        <img src="${char['image-sum']}" alt="${char.name}" />
        <p>${char.name}</p>
      `;
      cardsContainer.appendChild(card);
    });
  }

  // 첫 로드 (영웅 도감 선택)
  document.querySelector(".nav-btn.active")?.click();
}

// 모바일 더블탭 확대 방지
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);