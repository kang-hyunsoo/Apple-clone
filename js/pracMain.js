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
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
            },
            values: {
                messageA_opacity: [0, 1],
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

    // 씬이 0 -> 1, 1 -> 0 으로 스크롤했을 때 잠시 음수값이 나옴
    // 스크롤 속도 등에 의해 영향을 받아서 음수값이 잠깐 나올 수 있는데, 이를 방지하기 위해 체크함
    // 씬을 바꾸는 함수에서 동작하도록 함
    let enterNewScene = false;


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

    function calcValues(values, currentYOffset) {
    // 각 변화의 시작값과 끝값 => opacity 변화를 나타내는 함수
    // 현재 스크롤이 얼마나 됐는지 필요
    // 각 섹션마다 얼마나 스크롤이 됐는지가 필요 => 비율로 나타내서 opacity 중간값을 구해줘야함
        let rv;
        // 현재 섹션에서 스크롤된 범위를 비율로 내타램
        let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight

        rv = scrollRatio * (values[1] - values[0]) + values[0]
        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[0].objs
        const values = sceneInfo[0].values
        const currentYOffset = yOffset - prevScrollHeight

        console.log(currentScene)

        switch (currentScene) {
            case 0:
                let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset)
                objs.messageA.style.opacity = messageA_opacity_in
                console.log(messageA_opacity_in)
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    function scrollLoop() {
        // 활성화 시킬 섹션은?
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);

        }

        if  (yOffset < prevScrollHeight) {
            // 위로 스크롤 최대한 올리고 튕겼을 경우(브라우저 바운스 효과 - 모바일) 사파리 브라우저에서는 스크롤 마이너스가 되기 때문에 방어코드를 넣음
            if (currentScene === 0) return
            enterNewScene = true
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);

        }

        if (enterNewScene) return;
        playAnimation()
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

