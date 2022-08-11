(() => {
    // 각 scene에 대한 정보를 담고있는 배열
    // 길수록 스크롤을 많이 올리면서 재생해야되니까 애니매이션 속도가 느려짐
    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0')
            }
        } ,
        {
            // 1
            type: 'normal',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        } ,
        {
            // 2
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        }  ,
        {
            // 3
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];


    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위히보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된 섹션 (현재 보고있는 scroll-section)

    function setLayout() {
        // 각 스크롤 섹션의 높이 셋팅
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset){
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

    }


    function scrollLoop() {
        // 활성화 시킬 섹션은?
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene++;
        }

        if  (yOffset < prevScrollHeight) {
            // 위로 스크롤 최대한 올리고 튕겼을 경우 사파리 브라우저에서는 스크롤 마이너스가 되기 때문에 방어코드를 넣음
            if (currentScene === 0) return
            currentScene--;
        }

        document.body.setAttribute('id', `show-scene-${currentScene}`);

    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset
        scrollLoop()
    })

    // load => 모든 컨텐츠가 다 로드되면,
    // DOMContentLoaded => html에서 그리는 dom만 로드되면,
    window.addEventListener('load', setLayout)
    window.addEventListener('resize', setLayout)

})();

