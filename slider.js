

    const SliderSetting = {
        dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 3,
        arrow: true,
        lazyload: true,
        autoplay: false,
        autoplayTime: 3000,
        responsive: [
            {
                breakpoint: 1024,
                setting: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    infinite: false,
                }
            },
            {
                breakpoint: 600,
                setting: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    //if slidesToScroll is bigger than slidesToShow it will return slidesToShow for slidesToScroll
                    // slidesToShow: 2, //slidesToShow: 2
                    // slidesToScroll: 5 //slidesToScroll: slidesToShow
                    autoplay:false
                }
            },
            {
                breakpoint: 480,
                setting: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplayTime:10000,
                }
            }
        ]
    }

    document.querySelectorAll(".hmz-slider").forEach(Slider => {
        let slider = Slider.querySelector('.slider'),
            sliderItems = Slider.querySelector('.slides'),
            hamzehSlider = Slider,
            prev,
            next,
            dot = Slider.querySelector('.dot-wrapper'),
            end = false,
            responsive,
            lazyLoadS=false,
            slidesToScroll,
            slidesToShow,
            infinite,
            posX1 = 0,
            posX2 = 0,
            posInitial,
            dots = false,
            arrowS = false,
            autoplayS = false,
            autoplayTimeS=1000,
            posFinal,
            threshold,
            interval,
            index = 0,
            allowShift = true,
            touch,
            backwardSlide = false,
            outside = true,
            timeOutFunctionID

        const autoPlay = () => {
            console.log("autoplay")
            console.log(autoplayTimeS)
            interval = setInterval(() => {
                shiftSlide(1)
            }, autoplayTimeS)

            // hamzehSlider.addEventListener("mouseover", () => {
            //     clearInterval(interval)
            // })
            //
            // hamzehSlider.addEventListener("mouseout", () => {
            //     interval = setInterval(() => {
            //         shiftSlide(1)
            //     }, autoplayTime)
            // })
        }

        const unbindAutoPlay = () => {
            hamzehSlider.removeEventListener("mouseover", () => {
                clearInterval(interval)
            })
            hamzehSlider.removeEventListener("mouseout", () => {
                interval = setInterval(() => {
                    shiftSlide(1)
                }, 10000)
            })
        }

        const sliderWidth = () => sliderItems.querySelector(".slide").clientWidth
        const cursorStyle = (style) => sliderItems.style.cursor = style;

        const sliderItemsLength = () => sliderItems.getElementsByClassName('slide').length

        const sliderItem = () => sliderItems.getElementsByClassName('slide')

        const mainSlide = () => Slider.querySelectorAll(".slide:not(.slide.cloned)").length

        const splitSlides = () => {
            const mainSlideLength = mainSlide()
            const reminderSlide = mainSlideLength - slidesToShow


            if (reminderSlide - slidesToScroll < 0) {
                slidesToScroll = reminderSlide
            }

            if (slidesToShow < slidesToScroll) {
                slidesToScroll = slidesToShow
            }

            let maxStraightSlide = Math.floor(reminderSlide / slidesToScroll);
            let movementSlide = Math.ceil(reminderSlide / slidesToScroll);

            let reminderSlides = reminderSlide % slidesToScroll;

            return {maxStraightSlide, movementSlide, reminderSlides}
        }

        const thresholdCalculate = () => {
            threshold = 10 * sliderWidth() / 100;
        }

        const slideWidthLeft = () => {
            widthOfSlide()
            thresholdCalculate()
            if (infinite && possibleSlider() !== 0) {
                sliderItems.style.transform = `translate3d(${-sliderWidth() * slidesToShow}px,0,0)`
            } else {
                sliderItems.style.transform = `translate3d(0,0,0)`
            }
        }

        const hasReminderSlides = () => {
            const {reminderSlides} = splitSlides()
            return reminderSlides !== 0 ? reminderSlides : slidesToScroll
        }

        const isFirst = () => {
            const {movementSlide, reminderSlides} = splitSlides()
            if (index === 0 && backwardSlide) {
                console.log("1")
                return slidesToShow;
            } else {
                console.log("2")
                return index === movementSlide && reminderSlides !== 0 ? reminderSlides : slidesToScroll
            }
        }

        const isLast = (islast) => {
            if (islast) {
                return hasReminderSlides()
            } else {
                return index === 0 ? slidesToShow : slidesToScroll;
            }
        }

        const removeNotInfinityArowStyles = () => {
            console.log("remove not infinity styles")
            const prev = Slider.querySelector("#prev")
            const next = Slider.querySelector("#next")
            next.style.display = "block"
            next.classList.remove("disable")

            prev.style.display = "block"
            prev.classList.remove("disable")
        }

        const applyNotInfinityArrowStyles = () => {
            console.log("apply not infinity style")
            const {movementSlide} = splitSlides()
            const prev = document.querySelector("#prev")
            const next = document.querySelector("#next")
            removeNotInfinityArowStyles()
            if (index === 0 && prev) {
                prev.classList.add("disable")
                prev.style.display = "none"
            } else if (index === movementSlide && next) {
                next.classList.add("disable")
                next.style.display = "none"
            }
        }

        const offsetLeftPosition = () => {
            const active = Slider.querySelector(".active").getAttribute("data-index")
            const left = !infinite ? +0 : slidesToShow
            const currentLeft = -sliderItem()[+active + left].offsetLeft
            return currentLeft === -0 ? 0 : currentLeft
        }

        function shiftSlide(dir, action) {

            const {movementSlide} = splitSlides()

            sliderItems.classList.add('shifting');

            if (allowShift) {
                if(autoplayS)
                clearInterval(interval)
                allowShift = false
                if (!action) {
                    posInitial = sliderItems.getBoundingClientRect().left;
                }
                if (dir === 1) {
                    let isLastSlide

                    index = index + 1

                    backwardSlide = false

                    if (index === movementSlide) {
                        index = movementSlide
                        isLastSlide = true
                    } else if (index > movementSlide) {
                        index = 0
                    }

                    sliderItems.style.transform = `translate3d(${posInitial - sliderWidth() * isLast(isLastSlide)}px,0,0)`;

                } else if (dir === -1) {
                    backwardSlide = true;
                    console.log(posInitial)
                    sliderItems.style.transform = `translate3d(${posInitial + sliderWidth() * -dir * isFirst()}px,0,0)`;
                    if (index + dir < 0) {
                        index = movementSlide
                    } else {
                        index = index + dir;
                    }
                }
                if (!infinite) {
                    applyNotInfinityArrowStyles()
                }
                checkDot()
                if(autoplayS)
                autoPlay()
            }
        }

        function checkIndex() {
            const {movementSlide} = splitSlides()

            sliderItems.classList.remove('shifting');

            if (index === 0 && !infinite) {
                sliderItems.style.transform = `translate3d(0,0,0)`;
            }

            if (index === 0 && infinite) {
                sliderItems.style.transform = `translate3d(${-sliderWidth() * slidesToShow}px,0,0)`;
                end = false
            }

            if (index === movementSlide) {
                end = true
            }

            if (index === movementSlide && backwardSlide) {
                sliderItems.style.transform = `translate3d(${-(sliderItemsLength() - slidesToShow * 2) * sliderWidth()}px,0,0)`;
            }
            allowShift = true;
            removeActiveSlides()
            activeSlides()
            checkLazy()
        }

        const activeIndex = () => {
            const {reminderSlides, movementSlide} = splitSlides()
            if (!infinite || possibleSlider() !== 0) {
                return {
                    from: index === movementSlide ? mainSlide() - slidesToShow : index * possibleSlider() - (index === movementSlide && reminderSlides !== 0 ? reminderSlides : +0),
                    to: index === movementSlide ? mainSlide() - 1 : slidesToShow - 1 + index * possibleSlider()
                }
            }
            if (infinite || possibleSlider() === 0) {
                return {
                    from: index * possibleSlider(),
                    to: (index + 1) * (possibleSlider() === 0 ? sliderItemsLength() : slidesToShow) - 1
                }
            }
        }

        const checkLazy = () => {
            const {from, to} = activeIndex()
            let selector
            for (let i = from; i <= to; i++) {
                selector = `[class*="cloned"][data-index="${i}"]`;
                const dataSrc = Slider.querySelectorAll(selector)
                dataSrc.forEach(slide => {
                    const image = slide.querySelector("img")
                    const data = image.getAttribute("data-src")
                    if (image && data) {
                        image.setAttribute("src", data)
                        image.removeAttribute("data-src")
                        image.classList.remove("lazy")
                    }
                })
            }
        }

        const possibleSlider = () => {
            if (!infinite && mainSlide() > slidesToShow) {
                return slidesToScroll
            } else if (mainSlide() <= slidesToShow) {
                return 0
            } else {
                return slidesToShow
            }
        }

        const activeSlides = () => {
            let rr
            const slides = sliderItem()
            const {from, to} = activeIndex()
            if (possibleSlider() === 0 || !infinite) {
                rr = 0
            } else if (possibleSlider() !== 0) {
                rr = slidesToShow
            }
            for (let i = from; i <= to; i++) {
                slides[i + rr].classList.add("active")
            }
        }

        const removeActiveSlides = () => {
            Array.from(Slider.querySelectorAll(".slide.active")).forEach(slide => {
                slide.classList.remove("active")
            })
        }

        const dataIndex = () => {
            const slides = sliderItem()
            for (let i = 0; i < sliderItemsLength(); i++) {
                slides[i].setAttribute("data-index", i.toString())
            }
        }
        const cloneSlides = () => {

            const slides = sliderItem()

            dataIndex()

            for (let i = 0; i < slidesToShow; i++) {
                sliderItems.insertBefore(slides[slides.length - 1 - i].cloneNode(true), slides[0]);
                slides[0].classList.add("cloned")
            }

            for (let i = 0; i < slidesToShow; i++) {
                sliderItems.appendChild(slides[i + slidesToShow].cloneNode(true));
                slides[sliderItemsLength() - 1].classList.add("cloned")
            }


            activeSlides()

            checkLazy()
        }

        const widthOfSlide = () => {
            const slides = sliderItem()

            for (let i = 0; i < slides.length; i++) {
                slides[i].style.width = Math.ceil(slider.clientWidth / slidesToShow) + "px"
            }
        }

        const createDot = () => {
            console.log("create dot")
            const {movementSlide} = splitSlides()
            for (let i = 0; i <= movementSlide; i++) {
                Dot(i)
            }

        }

        function Dot(index) {
            const dotElement = document.createElement("span")
            if (index === 0) {
                dotElement.classList.add("dot", "active")
            }
            dotElement.classList.add("dot")
            dotElement.setAttribute("dot-index", index)
            dot.appendChild(dotElement)
        }

        const dotListener = () => {
            const {movementSlide} = splitSlides()

            const allDot = Slider.querySelectorAll(".dot")

            for (let i = 0; i < allDot.length; i++) {
                allDot[i].addEventListener("click", () => {
                        if (allowShift) {
                            if(autoplayS)
                            clearInterval(interval)
                            const to = allDot[i].getAttribute("dot-index");
                            if (Number(to) !== index) {
                                sliderItems.classList.add('shifting');

                                if (Number(to) === movementSlide) {
                                    if (!infinite) {
                                        sliderItems.style.transform = `translate3d(${-(mainSlide() - slidesToShow) * sliderWidth()}px,0,0)`;
                                    } else {
                                        sliderItems.style.transform = `translate3d(${-mainSlide() * sliderWidth()}px,0,0)`;
                                    }
                                } else {
                                    if (!infinite) {
                                        sliderItems.style.transform = `translate3d(${-(Number(to) * slidesToScroll) * sliderWidth()}px,0,0)`;
                                    } else {
                                        sliderItems.style.transform = `translate3d(${-(slidesToShow + (Number(to) * slidesToScroll)) * sliderWidth()}px,0,0)`;
                                    }
                                }
                                index = Number(to);
                                allowShift = false
                                if (!infinite) applyNotInfinityArrowStyles()
                                 checkDot()

                            }
                            if(autoplayS)
                            autoPlay()
                        }
                    }
                )
            }
        }

        function checkDot() {
            const allDot = Slider.querySelectorAll(".dot")
            for (let i = 0; i < allDot.length; i++) {
                const to = allDot[i].getAttribute("dot-index")
                if (index.toString() === to) {
                    Slider.querySelector(".dot.active").classList.remove("active")
                    allDot[index].classList.add("active")
                }
            }
        }

        const removeDot = () => {
            console.log("remove dot")
            const allDot = Slider.querySelectorAll(".dot")
            for (let i = 0; i < allDot.length; i++) {
                allDot[i].remove()
            }
        }

        const reCreateDot = () => {
            console.log("update dot")
            if (Slider.querySelector(".dot-wrapper").children.length > 0)
                removeDot()
            createDot()
        }

        const removeSlide = () => {
            const cloned = Slider.querySelectorAll(".slide.cloned")
            for (let i = 0; i < cloned.length; i++) {
                cloned[i].remove()
            }
        }

        const getSlider = () => {
            removeSlide()
            cloneSlides()
        }

        const lazy = () => {
            let lazyloadImages;

            lazyloadImages = Slider.querySelectorAll("[data-src]");

            let imageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const image = entry.target
                        let src = image.getAttribute("data-src");
                        if (!src) {
                            return;
                        }
                        image.src = src;
                        image.classList.remove("lazy");
                        image.removeAttribute("data-src");
                        imageObserver.unobserve(image);
                    }
                });
            },);

            lazyloadImages.forEach(function (image) {
                imageObserver.observe(image);
            });

        }

        function slide() {
            cursorStyle('grab')
            if(lazyLoadS)
            lazy()

            slideWidthLeft()

            if (possibleSlider() === 0) {
                slider.classList.add('wSlider');
                removeArrow()
                widthOfSlide()
                activeSlides()
            } else {
                slider.classList.add('loaded');


                if (infinite) {
                    cloneSlides()
                } else {
                    dataIndex()
                    activeSlides()
                    checkLazy()
                }

                if (dots) {
                    createDot()
                    dotListener()
                }

                if (autoplayS) autoPlay()

                bindlistener(sliderItems)

                if (arrowS) {
                    createArrow()
                    if (!infinite)
                        applyNotInfinityArrowStyles()
                }
            }
        }

        const arrow = (next, prev) => {
            next.addEventListener('click', () => shiftSlide(1));
            prev.addEventListener('click', () => shiftSlide(-1));
        }

        const bindlistener = () => {
            const slides = sliderItem()
            Array.from(slides).forEach(slide => {
                slide.querySelector("img").addEventListener('dragstart', (e) => {
                    e.preventDefault()
                })
            })

            sliderItems.addEventListener('touchstart', dragStart, {passive: true});
            sliderItems.addEventListener('mousedown', dragStart);
            sliderItems.addEventListener('touchend', dragEnd, {passive: true});
            sliderItems.addEventListener('touchmove', dragAction, {passive: true});
            sliderItems.addEventListener('mouseleave', dragEnd);
            sliderItems.addEventListener('transitionend', checkIndex);
        }

        const unbindListener = () => {
            const slides = sliderItem()
            Array.from(slides).forEach(slide => {
                slide.querySelector("img").removeEventListener('dragstart', (e) => {
                    e.preventDefault()
                })
            })
            sliderItems.removeEventListener('touchstart', dragStart);
            sliderItems.removeEventListener('mousedown', dragStart);
            sliderItems.removeEventListener('touchend', dragEnd);
            sliderItems.removeEventListener('touchmove', dragAction);
            sliderItems.removeEventListener('mouseleave', dragEnd);
            sliderItems.removeEventListener('transitionend', checkIndex);
        }

        function dragStart(e) {
            cursorStyle("grabbing")
            if(autoplayS)
            clearInterval(interval)
            if (allowShift) {

                touch = true
                posInitial = sliderItems.getBoundingClientRect().left;

                if (e.type === 'touchstart') {
                    posX1 = e.touches[0].clientX;

                } else {
                    posX1 = e.clientX;
                    document.addEventListener("mouseup", dragEnd)
                    document.addEventListener("mousemove", dragAction)
                }
                outside = false
            }
        }

        function dragAction(e) {
            if (allowShift && touch) {
                if (e.type === 'touchmove') {
                    posX2 = posX1 - e.touches[0].clientX;
                    posX1 = e.touches[0].clientX;
                } else {
                    console.log(posX1, e.clientX)
                    posX2 = posX1 - e.clientX;
                    posX1 = e.clientX;
                }
                sliderItems.style.transform = `translate3d(${(sliderItems.getBoundingClientRect().left - posX2)}px,0,0)`;
            }
        }

        function dragEnd() {
            if (!outside) {
                cursorStyle("grab")
                if(autoplayS)
                autoPlay()
                console.log("drag end")
                const {movementSlide} = splitSlides()
                posFinal = sliderItems.getBoundingClientRect().left;

                if (posFinal - posInitial < -threshold) {
                    if (!infinite && index === movementSlide)
                        sliderItems.style.transform = `translate3d(${posInitial}px,0,0)`;
                    else
                        shiftSlide(1, 'drag');
                } else if (posFinal - posInitial > threshold) {
                    if (!infinite && index === 0)
                        sliderItems.style.transform = `translate3d(${posInitial}px,0,0)`;
                    else
                        shiftSlide(-1, 'drag');
                } else if (posFinal - posInitial === 0) {
                    sliderItems.style.transform = `translate3d(${posInitial}px,0,0)`;
                } else {
                    sliderItems.classList.add('shifting');
                    allowShift = false
                    sliderItems.style.transform = `translate3d(${posInitial}px,0,0)`;
                }


                touch = false
                document.onmouseup = null;
                document.onmousemove = null;


            }
            outside = true;

        }

        const checkResponsive = () => {
            let i = 0
            SliderSetting.responsive.map(item => {
                    if (item.setting.arrow !== undefined ||
                        item.setting.dots !== undefined ||
                        item.setting.infinite !== undefined)
                        return true
                    else return false
                }
            ).map(item => {
                if (item === true) i++
            })
            return i === 0
        }

        const ck = (data, calculate, type) => {
            const {
                dots: Dots,
                infinite: Infinite,
                slidesToScroll: SlidesToScroll,
                slidesToShow: SlidesToShow,
                arrow: Arrow,
                autoplay: Autoplay,
                autoplayTime: AutoplayTime,
                lazyLoad: LazyLoad,
            } = data
            if (responsive !== type) {

                responsive = type
                dots = Dots ?? SliderSetting.dots
                arrowS = Arrow ?? SliderSetting.arrow
                infinite = Infinite ?? SliderSetting.infinite
                autoplayS = Autoplay ?? SliderSetting.autoplay
                autoplayTimeS = AutoplayTime ?? SliderSetting.autoplayTime
                lazyLoadS = LazyLoad ?? SliderSetting.lazyload

                slidesToShow = SlidesToShow
                slidesToScroll = SlidesToScroll ? SlidesToScroll : slidesToShow

                if (calculate === "responsive") {
                    reCalculate()
                } else {
                    if (checkResponsive()) {
                        dots = SliderSetting.dots ?? dots
                        infinite = SliderSetting.infinite ?? infinite
                        arrowS = SliderSetting.arrow ?? arrowS
                        autoplayS = SliderSetting.autoplay ?? autoplayS
                        autoplayTimeS = SliderSetting.autoplayTime ?? autoplayTimeS
                    }
                }
            }

        }
        const applySetting = (calculate) => {

            const jk = SliderSetting.responsive

            if (window.innerWidth > jk[0].breakpoint) {
                ck(SliderSetting, calculate, jk[0].breakpoint + 1)
            } else if (window.innerWidth <= jk[jk.length - 1].breakpoint) {
                ck(jk[jk.length - 1].setting, calculate, jk[jk.length - 1].breakpoint)
            } else {
                for (let i = 0; i < jk.length; i++) {
                    if (i + 1 < jk.length) {
                        if (window.innerWidth <= jk[i].breakpoint && window.innerWidth > jk[i + 1].breakpoint) {
                            ck(jk[i].setting, calculate, jk[i].breakpoint)
                        }
                    }
                }
            }
        }

        applySetting()

        const removeArrow = () => {
            console.log("remove arrow")
            const prev = Slider.querySelector("#prev")
            const next = Slider.querySelector("#next")
            prev.remove()
            next.remove()
        }

        const createArrow = () => {
            console.log("create arrow")
            const prevElement = document.createElement("a")
            const nextElement = document.createElement("a")

            prevElement.classList.add("control", "prev")
            prevElement.setAttribute("id", "prev")
            nextElement.classList.add("control", "next")
            nextElement.setAttribute("id", "next")

            slider.appendChild(prevElement)
            slider.appendChild(nextElement)
            slider.querySelector(".arrow").appendChild(nextElement)
            slider.querySelector(".arrow").appendChild(prevElement)

            arrow(nextElement, prevElement)
        }

        slide(slider, sliderItems);

        const reCalculate = () => {

            index = 0

            if (slider.classList.contains("wSlider") && possibleSlider() === slidesToShow) {
                slider.classList.remove("wSlider")
                slider.classList.add('loaded');
                bindlistener()
                arrow(next, prev)
            }

            if (!slider.classList.contains("wSlider")) {
                removeActiveSlides()
                if (possibleSlider() === 0) {
                    slider.classList.add("wSlider")
                    removeSlide()
                    removeArrow()
                    removeDot()
                    activeSlides()
                }

                if (!slider.classList.contains("wSlider")) {
                    if (infinite) {
                        getSlider()
                    } else {
                        removeSlide()
                    }

                    //arrow
                    if (!arrowS) {
                        if (Slider.querySelector("#prev")) {
                            removeArrow()
                        }
                    }

                    if (arrowS && infinite) {
                        if (!Slider.querySelector("#prev")) {
                            createArrow()
                        } else {
                            if (Slider.querySelector(".arrow .disable"))
                                removeNotInfinityArowStyles()
                        }
                    }

                    if (arrowS && !infinite) {
                        if (!Slider.querySelector("#prev")) {
                            createArrow()
                            applyNotInfinityArrowStyles()
                        } else {
                            applyNotInfinityArrowStyles()
                        }
                    }
                    if (dots) {
                        if (Slider.querySelectorAll(".dot").length - 1 !== Math.ceil((mainSlide() - slidesToShow) / slidesToScroll))
                            reCreateDot()
                        else checkDot()
                    } else {
                        removeDot()
                    }
                    dotListener()
                    activeSlides()
                }
            }
        }


        const recall = async () => {
            const {movementSlide, reminderSlides} = splitSlides()

            widthOfSlide()
            thresholdCalculate()

            if (!infinite) {
                sliderItems.style.transform =
                    `translate3d(${-(index * slidesToScroll - (index === movementSlide
                    && reminderSlides !== 0 ?
                        slidesToScroll - reminderSlides : +0)) * sliderWidth()}px,0,0)`
            } else if (possibleSlider() === 0) {
                sliderItems.style.transform = `translate3d(0,0,0)`
            } else if (index === movementSlide) {
                sliderItems.style.transform = `translate3d(${-mainSlide() * sliderWidth()}px,0,0)`;
            } else {
                sliderItems.style.transform = `translate3d(${-(slidesToShow + (index * slidesToScroll)) * sliderWidth()}px,0,0)`;
            }

        }

        const workAfterResizeDone = () => {
            applySetting("responsive")
            recall()
            if(autoplayS)
            autoPlay()
        }

        window.addEventListener("resize", () => {
            clearInterval(interval)
            clearTimeout(timeOutFunctionID);
            timeOutFunctionID = setTimeout(workAfterResizeDone, 50)
        })
    })

