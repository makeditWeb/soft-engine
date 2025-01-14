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
        } else {
            // dashboard.html용 (전체 문서에서 요소 선택)
            this.arrows = document.querySelectorAll('.arrow svg path');
            this.listItems = document.querySelectorAll('.list-model li');
        }
        this.currentStatus = 'normal';
    }

    changeStatus(status) {
        if (!STATUS_COLORS[status]) {
            console.error('Invalid status:', status);
            return;
        }

        const color = STATUS_COLORS[status];
        
        // SVG 색상 변경
        this.arrows.forEach(arrow => {
            arrow.setAttribute('fill', color);
        });

        // 리스트 아이템 배경색 변경
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
    // 현재 페이지 URL에서 페이지 타입 확인
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('dashboard')) {
        // dashboard.html 초기화
        initializeDashboard();
    } else if (currentPath.includes('antenna')) {
        // antenna.html 초기화
        initializeAntenna();
    }
}

// dashboard.html 초기화 함수
function initializeDashboard() {
    const statusIndicator = new StatusIndicator();
    
    function checkStatus() {
        // 여기서 상태 확인 및 변경
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
    
    function checkStatus() {
        // 각 인디케이터의 상태 확인 및 변경
        indicator1.changeStatus('normal');
        indicator2.changeStatus('normal');
    }

    checkStatus();
    setInterval(checkStatus, 30000);
}

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializePage);


// drag & drap

document.addEventListener('DOMContentLoaded', () => {
    // 드래그 앤 드롭 기능
    const container = document.querySelector('.content__right');
    const sections = document.querySelectorAll('.list-section');

    sections.forEach(section => {
        section.addEventListener('dragstart', handleDragStart);
        section.addEventListener('dragend', handleDragEnd);
        section.addEventListener('dragover', handleDragOver);
        section.addEventListener('drop', handleDrop);
    });

    function handleDragStart(e) {
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.id);
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        sections.forEach(section => {
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
            // Get all sections as array for index calculation
            const allSections = [...container.querySelectorAll('.list-section')];
            const draggingIndex = allSections.indexOf(draggingElement);
            const dropIndex = allSections.indexOf(dropTarget);

            // Determine new position
            if (draggingIndex < dropIndex) {
                dropTarget.parentNode.insertBefore(draggingElement, dropTarget.nextSibling);
            } else {
                dropTarget.parentNode.insertBefore(draggingElement, dropTarget);
            }
        }

        // Remove drag-over styling
        this.classList.remove('drag-over');
        return false;
    }

    // 입력 필드 관리 기능
    const inputs = document.querySelectorAll('.content__right input.value');
    
    inputs.forEach(input => {
        // 초기 상태를 읽기 전용으로 설정
        input.readOnly = true;
        
        // 더블클릭 이벤트 리스너 추가
        input.addEventListener('dblclick', function() {
            this.readOnly = false;
            this.focus();
            const len = this.value.length;
            this.setSelectionRange(len, len);
        });

        // blur(포커스 아웃) 이벤트 리스너 추가
        input.addEventListener('blur', function() {
            this.readOnly = true;
            handleValueChange(this);
        });

        // 엔터 키 이벤트 리스너 추가
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.blur();
            }
        });
    });
});

// 값 변경 처리 함수
// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 드래그 앤 드롭 기능
    const container = document.querySelector('.content__right');
    const sections = document.querySelectorAll('.list-section');

    sections.forEach(section => {
        section.addEventListener('dragstart', handleDragStart);
        section.addEventListener('dragend', handleDragEnd);
        section.addEventListener('dragover', handleDragOver);
        section.addEventListener('drop', handleDrop);
    });

    // 입력 필드 초기화
    initializeInputFields();
});

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
        const container = document.querySelector('.content__right');
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

// 입력 필드 초기화 함수
function initializeInputFields() {
    const inputs = document.querySelectorAll('.content__right input.value');
    
    inputs.forEach(input => {
        setupInputField(input);
    });
}

// 입력 필드 설정 함수
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

// 값 변경 처리 함수
function handleValueChange(input) {
    const row = input.closest('.row');
    const label = row.querySelector('.label').textContent;
    const section = input.closest('.list-section').querySelector('h2').textContent;
    const newValue = input.value;

    console.log(`Section: ${section}, Field: ${label}, New Value: ${newValue}`);
}

// 특정 label 다음에 새로운 row 추가 함수
function addRowAfterLabel(sectionClass, targetLabel, newLabel, newValue = '') {
    const section = document.querySelector(`.list-section.${sectionClass} .content_inner`);
    if (!section) {
        console.error(`Section ${sectionClass} not found`);
        return false;
    }

    // 타겟 label을 찾음
    const rows = section.querySelectorAll('.row');
    let targetRow = null;
    
    for (const row of rows) {
        const label = row.querySelector('.label');
        if (label && label.textContent === targetLabel) {
            targetRow = row;
            break;
        }
    }

    if (!targetRow) {
        console.error(`Target label "${targetLabel}" not found in section ${sectionClass}`);
        return false;
    }

    // 새로운 row 생성
    const newRow = document.createElement('div');
    newRow.className = 'row';

    // label div 생성
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = newLabel;

    // input 생성
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'value';
    input.value = newValue;
    
    // 입력 필드 설정
    setupInputField(input);

    // row에 요소들 추가
    newRow.appendChild(label);
    newRow.appendChild(input);

    // 타겟 row 다음에 새로운 row 삽입
    targetRow.insertAdjacentElement('afterend', newRow);

    return true;
}

// value 값 업데이트 함수
function updateInputValue(sectionClass, labelText, newValue) {
    const section = document.querySelector(`.list-section.${sectionClass}`);
    if (!section) {
        console.error(`Section ${sectionClass} not found`);
        return false;
    }

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

    console.error(`Label "${labelText}" not found in section ${sectionClass}`);
    return false;
}

// 여러 row 한번에 추가
function addMultipleRowsAfterLabel(sectionClass, targetLabel, newRows) {
    return newRows.every((row, index) => {
        // 첫 번째 항목은 targetLabel 다음에, 나머지는 이전에 추가된 항목 다음에 추가
        const target = index === 0 ? targetLabel : newRows[index - 1].label;
        return addRowAfterLabel(sectionClass, target, row.label, row.value);
    });
}

// 여러 value 한번에 업데이트
function updateMultipleValues(sectionClass, updates) {
    return updates.every(update => 
        updateInputValue(sectionClass, update.label, update.value)
    );
}

// 예시 1: 단일 row 추가
// GNSS 섹션의 '최근 ZDA 시간' 다음에 새로운 필드 추가
// addRowAfterLabel('gnss', '최근 ZDA 시간', '새로운필드', '초기값');

// 예시 2: 여러 row 한번에 추가
// const newGnssRows = [
//     { label: '수신감도', value: '-75dBm' },
//     { label: '위성상태', value: '정상' },
//     { label: '업데이트주기', value: '1초' }
// ];

// addMultipleRowsAfterLabel('gnss', '최근 ZDA 시간', newGnssRows);

// 예시 3: 추가된 필드의 value만 업데이트
// updateInputValue('gnss', '수신감도', '-80dBm');

// '받아낸 위성수량(GLO)' 다음에 추가하고 싶을 경우
// addRowAfterLabel('gnss', '받아낸 위성수량(GLO)', '새로운필드', '초기값');









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