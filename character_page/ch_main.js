// URL에서 id 파라미터 가져오기
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.body.innerHTML = "<p>캐릭터를 찾을 수 없습니다.</p><a href='index.html'>← 목록으로</a>";
} else {
  // 캐릭터 데이터 로드
  fetch('dogam_info/character_info.json')
    .then(response => response.json())
    .then(data => {
      const char = data.find(item => item.id === id);
      if (!char) {
        document.body.innerHTML = "<p>캐릭터를 찾을 수 없습니다.</p><a href='index.html'>← 목록으로</a>";
        return;
      }

      // 페이지에 캐릭터 정보 표시
      document.getElementById("char-name").textContent = char.name;
      document.getElementById("char-image").src = char['image-full'];
      document.getElementById("char-image").alt = char.name;      

      const infoList = document.getElementById("char-info");
      infoList.innerHTML = `
        <li><strong>성별:</strong> ${char.gender || "???"}</li>
        <li><strong>혈액형:</strong> ${char.blood || "???"}</li>
        <li><strong>생일:</strong> ${char.birth || "???"}</li>
        <li><strong>별자리:</strong> ${char.star || "???"}</li>
        <li><strong>나이:</strong> ${char.age || "???"}</li>
        <li><strong>키:</strong> ${char.height || "???"}</li>
        <li><strong>몸무게:</strong> ${char.weight || "???"}</li>
        <li><strong>좋아하는 것:</strong> ${char.likes || "???"}</li>
        <li><strong>싫어하는 것:</strong> ${char.dislikes || "???"}</li>
      `;
    })
    .catch(error => {
      console.error('캐릭터 데이터 로드 실패:', error);
    });
}

// 홈 아이콘 클릭 이벤트 (index.html로 이동)
document.getElementById('home-icon').addEventListener('click', function() {
  window.location.href = '../index.html';
});