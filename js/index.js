// script.js
const dropdownButton = document.querySelector('.dropdown-button');
const dropdownContent = document.querySelector('.dropdown-content');
const chevron = document.querySelector('.chevron');
const selectedText = document.querySelector('.selected-text');
const dropdownItems = document.querySelectorAll('.dropdown-item');

// 드롭다운 버튼 클릭 이벤트
dropdownButton.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownContent.classList.toggle('show');
    chevron.classList.toggle('active');
});

// 드롭다운 아이템 클릭 이벤트
dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
        selectedText.textContent = item.textContent;
        dropdownContent.classList.remove('show');
        chevron.classList.remove('active');
    });
});

// 드롭다운 외부 클릭 시 닫기
window.addEventListener('click', () => {
    dropdownContent.classList.remove('show');
    chevron.classList.remove('active');
});