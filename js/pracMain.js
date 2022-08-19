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
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                // messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageA_opacity_out: [0, 1, { start: 0.25, end: 0.3 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                // messageB_opacity_out: [1, 0, { start: 0.45, end: 0.1 }],
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
  console.log(sceneInfo[0].objs.container.offsetHeight)

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
            if (sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
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
        const scrollHeight = sceneInfo[currentScene].scrollHeight
        const scrollRatio = currentYOffset / scrollHeight

        if (values.length === 3) {
            // start ~ end 사이에 애내메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0]
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];

            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0]
        }
        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[0].objs
        const values = sceneInfo[0].values
        const currentYOffset = yOffset - prevScrollHeight
        const scrollHeight = sceneInfo[currentScene].scrollHeight // 현재씬의 스크롤 높이
        const scrollRatio = currentYOffset / scrollHeight

        switch (currentScene) {
            case 0:
                // const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset)
                // const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset)
                // const messageA_translate_in = calcValues(values.messageA_translateY_in, currentYOffset)
                // const messageA_translate_out = calcValues(values.messageA_translateY_out, currentYOffset)
                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset)
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset)
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`

                }
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

