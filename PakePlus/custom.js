// 原有点击劫持代码保持不变
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })

// ========== 新增左划返回功能 ==========

let startX = 0;
let startY = 0;
let startTime = 0;
const SWIPE_THRESHOLD = 100; // 滑动阈值（像素）
const MAX_VERTICAL_DEVIATION = 50; // 最大垂直偏差
const MAX_TIME = 500; // 最大时间（毫秒）

// 触摸开始
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
});

// 触摸结束
document.addEventListener('touchend', (e) => {
    if (startX === 0 || startY === 0) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const endTime = Date.now();
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;
    
    // 检查是否为有效的左划手势
    if (
        deltaX < -SWIPE_THRESHOLD && // 向左滑动足够距离
        Math.abs(deltaY) < MAX_VERTICAL_DEVIATION && // 垂直偏差不大
        deltaTime < MAX_TIME && // 滑动时间较短
        Math.abs(deltaX) > Math.abs(deltaY) // 主要是水平滑动
    ) {
        // 阻止默认行为
        e.preventDefault();
        
        console.log('左划手势检测到，尝试返回');
        
        // 尝试返回上一页
        if (history.length > 1) {
            history.back();
        } else {
            console.log('无法返回：历史记录为空');
            // 可以在这里添加其他处理，比如提示用户
        }
    }
    
    // 重置起始位置
    startX = 0;
    startY = 0;
    startTime = 0;
});

// 可选：添加视觉反馈
const addSwipeFeedback = () => {
    const style = document.createElement('style');
    style.textContent = `
        .swipe-back-indicator {
            position: fixed;
            left: 0;
            top: 0;
            height: 100%;
            width: 10px;
            background: rgba(0, 122, 255, 0.3);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        .swipe-back-active {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    const indicator = document.createElement('div');
    indicator.className = 'swipe-back-indicator';
    document.body.appendChild(indicator);
    
    // 可选：在滑动时显示视觉反馈
    document.addEventListener('touchmove', (e) => {
        if (startX === 0) return;
        
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        
        if (deltaX < 0) {
            indicator.classList.add('swipe-back-active');
        } else {
            indicator.classList.remove('swipe-back-active');
        }
    });
    
    document.addEventListener('touchend', () => {
        indicator.classList.remove('swipe-back-active');
    });
};

// 启用视觉反馈（可选）
// addSwipeFeedback();

console.log('左划返回功能已加载');