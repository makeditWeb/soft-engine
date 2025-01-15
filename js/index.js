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



// dashboard 컬러
// status.js
// content__right 전환을 위한 스타일 추가
const style = document.createElement('style');
style.textContent = `
    .content__right_wrapper .content__right {
        display: none;
    }
    .content__right_wrapper .content__right.active {
        display: block;
    }

    .content-tap .arrow__inner.active .container{
        border:2px solid #06DDCE;
    }

    .content-tap .arrow__inner {
        cursor: pointer;
    }
    .content-tap .arrow__inner.active {
        opacity: 1;
    }


    .content-tap .arrow__inner:not(.active) {
        border:none;
    }
`;
document.head.appendChild(style);

const STATUS_COLORS = {
    'normal': '#06DDCE',    // sky-green (정상)
    'warning': '#FFBE19',   // yellow (비정상)
    'error': '#FF3B3B',     // red (장애)
    'noResponse': '#9C9C9C' // gray (무응답)
};

class StatusIndicator {
    constructor(container = null) {
        if (container) {
            // antenna.html용 (특정 컨테이너 내부의 요소들만 선택)
            const containerElement = document.getElementById(container);
            this.arrows = containerElement.querySelectorAll('.arrow svg path');
            this.listItems = containerElement.querySelectorAll('.list-model li');

            containerElement.addEventListener('click', () => {
                this.handleIndicatorClick();
            });
        } else {
            // dashboard.html용 (전체 문서에서 요소 선택)
            this.arrows = document.querySelectorAll('.arrow svg path');
            this.listItems = document.querySelectorAll('.list-model li');
        }
        this.currentStatus = 'normal';
        this.container = container;
    }

    handleIndicatorClick() {
        if (!this.container) return;
        
        // 모든 indicator의 active 클래스 제거
        document.querySelectorAll('.arrow__inner').forEach(el => {
            el.classList.remove('active');
        });
        
        // 클릭된 indicator에 active 클래스 추가
        document.getElementById(this.container).classList.add('active');
        
        // content__right 전환
        const indicatorNumber = this.container.replace('indicator', '');
        const allContents = document.querySelectorAll('.content__right');
        
        // 모든 content 숨기기
        allContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // 해당하는 content 보이기
        const targetContent = document.querySelector(`.content__right[data-indicator="${indicatorNumber}"]`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    changeStatus(status) {
        if (!STATUS_COLORS[status]) {
            console.error('Invalid status:', status);
            return;
        }

        const color = STATUS_COLORS[status];
        
        this.arrows.forEach(arrow => {
            arrow.setAttribute('fill', color);
        });

        this.listItems.forEach(item => {
            item.style.backgroundColor = color;
        });

        this.currentStatus = status;
    }

    getCurrentStatus() {
        return this.currentStatus;
    }
}

// 페이지 초기화 함수
function initializePage() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('dashboard')) {
        initializeDashboard();
    } else if (currentPath.includes('antenna')) {
        initializeAntenna();
    }

    // 공통 기능 초기화
    initializeDragAndDrop();
    initializeInputFields();
}

// dashboard.html 초기화 함수
function initializeDashboard() {
    const statusIndicator = new StatusIndicator();
    
    function checkStatus() {
        const status = 'normal'; 
        statusIndicator.changeStatus(status);
    }

    checkStatus();
    setInterval(checkStatus, 30000);
}

// antenna.html 초기화 함수
function initializeAntenna() {
    const indicator1 = new StatusIndicator('indicator1');
    const indicator2 = new StatusIndicator('indicator2');

    // 초기 상태 설정
    document.getElementById('indicator1').classList.add('active');
    document.querySelector('.content__right[data-indicator="1"]').classList.add('active');
    
    function checkStatus() {
        indicator1.changeStatus('normal');
        indicator2.changeStatus('normal');
    }

    checkStatus();
    setInterval(checkStatus, 30000);
}

// 드래그 앤 드롭 초기화
function initializeDragAndDrop() {
    const sections = document.querySelectorAll('.list-section');
    sections.forEach(section => {
        section.addEventListener('dragstart', handleDragStart);
        section.addEventListener('dragend', handleDragEnd);
        section.addEventListener('dragover', handleDragOver);
        section.addEventListener('drop', handleDrop);
    });
}

// 드래그 앤 드롭 관련 함수들
function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.id);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.list-section').forEach(section => {
        section.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    this.classList.add('drag-over');
    return false;
}

function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    const draggingElement = document.querySelector('.dragging');
    const dropTarget = this;

    if (draggingElement !== dropTarget) {
        const container = dropTarget.closest('.content__right');
        const allSections = [...container.querySelectorAll('.list-section')];
        const draggingIndex = allSections.indexOf(draggingElement);
        const dropIndex = allSections.indexOf(dropTarget);

        if (draggingIndex < dropIndex) {
            dropTarget.parentNode.insertBefore(draggingElement, dropTarget.nextSibling);
        } else {
            dropTarget.parentNode.insertBefore(draggingElement, dropTarget);
        }
    }

    this.classList.remove('drag-over');
    return false;
}

// 입력 필드 초기화
function initializeInputFields() {
    const inputs = document.querySelectorAll('.content__right input.value');
    inputs.forEach(input => {
        setupInputField(input);
    });
}

// 입력 필드 설정
function setupInputField(input) {
    input.readOnly = true;
    
    input.addEventListener('dblclick', function() {
        this.readOnly = false;
        this.focus();
        const len = this.value.length;
        this.setSelectionRange(len, len);
    });

    input.addEventListener('blur', function() {
        this.readOnly = true;
        handleValueChange(this);
    });

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            this.blur();
        }
    });
}

// 값 변경 처리
function handleValueChange(input) {
    const row = input.closest('.row');
    const label = row.querySelector('.label').textContent;
    const section = input.closest('.list-section').querySelector('h2').textContent;
    const newValue = input.value;

    console.log(`Section: ${section}, Field: ${label}, New Value: ${newValue}`);
}

// Row 관리 함수들
function addRowAfterLabel(sectionClass, targetLabel, newLabel, newValue = '') {
    const section = document.querySelector(`.list-section.${sectionClass} .content_inner`);
    if (!section) return false;

    const rows = section.querySelectorAll('.row');
    let targetRow = null;
    
    for (const row of rows) {
        const label = row.querySelector('.label');
        if (label && label.textContent === targetLabel) {
            targetRow = row;
            break;
        }
    }

    if (!targetRow) return false;

    const newRow = document.createElement('div');
    newRow.className = 'row';

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = newLabel;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'value';
    input.value = newValue;
    
    setupInputField(input);

    newRow.appendChild(label);
    newRow.appendChild(input);
    targetRow.insertAdjacentElement('afterend', newRow);

    return true;
}

// value 업데이트 함수들
function updateInputValue(sectionClass, labelText, newValue) {
    const section = document.querySelector(`.list-section.${sectionClass}`);
    if (!section) return false;

    const rows = section.querySelectorAll('.row');
    for (const row of rows) {
        const label = row.querySelector('.label');
        if (label && label.textContent === labelText) {
            const input = row.querySelector('input.value');
            if (input) {
                input.value = newValue;
                handleValueChange(input);
                return true;
            }
        }
    }

    return false;
}

function addMultipleRowsAfterLabel(sectionClass, targetLabel, newRows) {
    return newRows.every((row, index) => {
        const target = index === 0 ? targetLabel : newRows[index - 1].label;
        return addRowAfterLabel(sectionClass, target, row.label, row.value);
    });
}

function updateMultipleValues(sectionClass, updates) {
    return updates.every(update => 
        updateInputValue(sectionClass, update.label, update.value)
    );
}

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializePage);







// tab 코드

class TabManager {
    constructor() {
        this.tabList = document.getElementById('tabList');
        this.tabContent = document.getElementById('tabContent');
        
        // 기본 탭 설정
        this.tabs = [
            { id: 'tab1', title: '데이터사용량' },
            { id: 'tab2', title: '패킷분석' },
            { id: 'tab3', title: '제어이력' },
            { id: 'tab4', title: '오류로그' }
        ];
        
        this.init();
    }

    init() {
        // 초기 탭 생성
        this.renderTabs();
        
        // 첫 번째 탭 활성화
        if (this.tabs.length > 0) {
            this.activateTab(this.tabs[0].id);
        }

        // 탭 클릭 이벤트 리스너
        this.tabList.addEventListener('click', (e) => {
            const tabItem = e.target.closest('.tab-item');
            if (tabItem) {
                this.activateTab(tabItem.dataset.tab);
            }
        });
    }

    // 모든 탭 렌더링
    renderTabs() {
        // 탭 리스트 초기화
        this.tabList.innerHTML = '';
        this.tabContent.innerHTML = '';

        // 탭 생성
        this.tabs.forEach(tab => {
            // 탭 버튼 생성
            const tabItem = document.createElement('li');
            tabItem.className = 'tab-item';
            tabItem.dataset.tab = tab.id;
            tabItem.textContent = tab.title;
            this.tabList.appendChild(tabItem);

            // 탭 컨텐츠 생성
            const tabPane = document.createElement('div');
            tabPane.id = tab.id;
            tabPane.className = 'tab-pane';
            tabPane.textContent = `${tab.title} 내용`;
            this.tabContent.appendChild(tabPane);
        });
    }

    // 탭 활성화
    activateTab(tabId) {
        // 모든 탭 비활성화
        document.querySelectorAll('.tab-item').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        // 선택된 탭 활성화
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    // 새 탭 추가
    addTab(title) {
        const newId = `tab${this.tabs.length + 1}`;
        this.tabs.push({ id: newId, title });
        this.renderTabs();
        this.activateTab(newId);
    }

    // 탭 제거
    removeTab(tabId) {
        const index = this.tabs.findIndex(tab => tab.id === tabId);
        if (index !== -1) {
            this.tabs.splice(index, 1);
            this.renderTabs();
            
            // 삭제 후 남은 탭이 있다면 첫 번째 탭 활성화
            if (this.tabs.length > 0) {
                this.activateTab(this.tabs[0].id);
            }
        }
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    const tabManager = new TabManager();
    
    // 탭 추가 예시
    // tabManager.addTab('새로운 탭');
    
    // 탭 제거 예시
    // tabManager.removeTab('tab1');
});