/* ============================================
   main.js — 首页逻辑
   ============================================ */

(function () {
    "use strict";

    /* ---- 轮播数据 ---- */
    var heroSlides = [
        {
            image: "images/Banner1.png",
            title: "智灌先锋",
            subtitle: "智能水肥灌溉一体化系统",
            desc: "面向山地果园、大棚、茶园等农业场景，提供水肥精准调控、智能监测、远程管理的一体化解决方案。",
            features: [
                { title: "精准灌溉", desc: "按需补水" },
                { title: "智能施肥", desc: "精准配比" },
                { title: "实时监测", desc: "远程可视" },
                { title: "远程管理", desc: "多端协同" }
            ],
            stats: [
                { value: "30%+", label: "节水效率提升" },
                { value: "25%+", label: "人工成本降低" },
                { value: "7×24h", label: "云端实时监控" },
                { value: "多场景", label: "园区灵活适配" }
            ]
        },
        {
            image: "images/Banner2.png",
            title: "智灌先锋",
            subtitle: "设施农业智慧控制方案",
            desc: "围绕温室种植环境，整合灌溉、施肥、感知与远程控制能力，打造高效稳定的大棚管理系统。",
            features: [
                { title: "水肥一体", desc: "精准施用" },
                { title: "环境联动", desc: "自动策略" },
                { title: "云端监测", desc: "数据留痕" },
                { title: "绿色增产", desc: "降本提效" }
            ],
            stats: [
                { value: "50+", label: "可接入终端类型" },
                { value: "420ppm", label: "示例实时数据" },
                { value: "75%", label: "灌溉进度掌控" },
                { value: "秒级", label: "远程指令响应" }
            ]
        },
        {
            image: "images/Banner3.png",
            title: "智灌先锋",
            subtitle: "数据驱动农业管理决策",
            desc: "通过感知设备、控制系统和平台数据联动，实现从现场感知到经营决策的全流程数字化闭环。",
            features: [
                { title: "水肥调控", desc: "精准执行" },
                { title: "智能监测", desc: "实时感知" },
                { title: "远程管理", desc: "随时随地" },
                { title: "数据驱动", desc: "科学决策" }
            ],
            stats: [
                { value: "98.6%", label: "设备在线率" },
                { value: "1.2EC", label: "水肥配比参考" },
                { value: "23%", label: "土壤墒情参考" },
                { value: "在线", label: "系统运行状态" }
            ]
        },
        {
            image: "images/Banner4.png",
            title: "智灌先锋",
            subtitle: "果园数字化升级场景",
            desc: "把传感器、控制器和农业物联网平台连接到果园现场，帮助管理者实现可视、可控、可追踪的生产管理。",
            features: [
                { title: "山地果园", desc: "精准补水" },
                { title: "大棚种植", desc: "稳定供给" },
                { title: "茶园管理", desc: "自动巡检" },
                { title: "平台联动", desc: "数据看板" }
            ],
            stats: [
                { value: "3类", label: "重点适配场景" },
                { value: "移动端", label: "掌上巡园管理" },
                { value: "远程", label: "在线控制终端" },
                { value: "全天候", label: "运行监测能力" }
            ]
        },
        {
            image: "images/Banner5.png",
            title: "智慧农业园区",
            subtitle: "可感知、可控制、可追溯的现代农业园区",
            desc: "结合无人机巡检、环境监测、产品追溯和灌溉控制，构建覆盖农事作业与园区运营的智慧农业体系。",
            features: [
                { title: "环境监测", desc: "多维感知" },
                { title: "灌溉控制", desc: "节水稳产" },
                { title: "农事管理", desc: "全程协同" },
                { title: "产品追溯", desc: "可信运营" }
            ],
            stats: [
                { value: "68%", label: "示例灌溉完成率" },
                { value: "320lx", label: "示例光照参数" },
                { value: "二维码", label: "产品追溯能力" },
                { value: "园区级", label: "综合管理方案" }
            ]
        }
    ];

    var caseImageFallbacks = [
        "images/案例一：智能水肥一体机.jpg",
        "images/案例二：大田智能灌溉系统实拍.jpg",
        "images/案例三：蔬菜大棚精准水肥管控场景.jpg",
        "images/案例四：脐橙果园数字化升级场景.jpg"
    ];

    var newsImageFallbacks = [
        "images/新闻一：湖北省智慧农业示范工程.jpg",
        "images/新闻二：智能滴灌系统应用场景.jpg",
        "images/新闻三：\u201c慧农云\u201d农业物联网管理平台.jpg"
    ];

    var currentSlideIndex = 0;
    var slideTimer = null;

    /* ---- 工具函数 ---- */
    function resolveImage(image, fallbacks, index) {
        if (!image || /images\/case\d+\.jpg$/i.test(image) || /images\/news\d+\.jpg$/i.test(image)) {
            return fallbacks[index % fallbacks.length];
        }
        return image;
    }

    function getWebsiteData() {
        var local = localStorage.getItem("websiteData");
        if (local) {
            try {
                var parsed = JSON.parse(local);
                if (parsed.version === '2.0' || parsed.version === '2.1') {
                    return Promise.resolve(parsed);
                }
            } catch(e) {}
            localStorage.removeItem("websiteData");
        }
        return fetch("data/content.json").then(function (r) { return r.json(); });
    }

    /* ---- Header 滚动阴影 ---- */
    function initHeaderScroll() {
        var header = document.querySelector(".header");
        if (!header) return;
        window.addEventListener("scroll", function () {
            header.classList.toggle("scrolled", window.scrollY > 20);
        }, { passive: true });
    }

    /* ---- Hero 轮播 ---- */
    function renderHero(idx) {
        var s = heroSlides[idx];
        document.getElementById("heroSlide").style.backgroundImage = 'url("' + s.image + '")';
        document.getElementById("heroTitle").textContent = s.title;
        document.getElementById("heroSubtitle").textContent = s.subtitle;
        document.getElementById("heroDesc").textContent = s.desc;

        document.getElementById("heroFeatures").innerHTML = s.features.map(function (f) {
            return '<div class="feature-item"><strong>' + f.title + '</strong><span>' + f.desc + '</span></div>';
        }).join("");

        document.getElementById("heroStats").innerHTML = s.stats.map(function (st) {
            return '<div class="stat-card"><strong>' + st.value + '</strong><span>' + st.label + '</span></div>';
        }).join("");

        document.querySelectorAll(".hero-dot").forEach(function (d, i) {
            d.classList.toggle("active", i === idx);
        });
    }

    function resetHeroTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(function () {
            currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
            renderHero(currentSlideIndex);
        }, 4500);
    }

    function startHeroSlider() {
        var dots = document.getElementById("heroDots");
        dots.innerHTML = heroSlides.map(function (_, i) {
            return '<button class="hero-dot' + (i === 0 ? " active" : "") +
                '" type="button" aria-label="切换到第' + (i + 1) + '张" data-index="' + i + '"></button>';
        }).join("");

        dots.addEventListener("click", function (e) {
            var dot = e.target.closest(".hero-dot");
            if (!dot) return;
            currentSlideIndex = Number(dot.dataset.index);
            renderHero(currentSlideIndex);
            resetHeroTimer();
        });

        renderHero(0);
        resetHeroTimer();
    }

    /* ---- 公司实力 统计数字动画 ---- */
    function renderStats(stats) {
        var row = document.getElementById("statsRow");
        if (!row || !stats) return;

        row.innerHTML = stats.map(function (s) {
            return '<div class="stat-item">' +
                '<div class="stat-number">' +
                    '<span class="num" data-target="' + s.value + '">0</span>' +
                    '<span class="unit">' + s.unit + '</span>' +
                '</div>' +
                '<span class="stat-label">' + s.label + '</span>' +
                '<span class="stat-desc">' + s.desc + '</span>' +
            '</div>';
        }).join("");

        // 数字滚动动画
        animateStats(row);
    }

    function animateStats(container) {
        var nums = container.querySelectorAll(".num");
        var animated = false;

        function doAnimate() {
            if (animated) return;
            animated = true;

            nums.forEach(function (el) {
                var raw = el.dataset.target;
                var target = parseInt(raw, 10);
                if (isNaN(target)) {
                    el.textContent = raw;
                    return;
                }

                var duration = 1200;
                var start = performance.now();

                function tick(now) {
                    var progress = Math.min((now - start) / duration, 1);
                    // ease-out cubic
                    var ease = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * ease);
                    if (progress < 1) requestAnimationFrame(tick);
                }

                requestAnimationFrame(tick);
            });
        }

        // IntersectionObserver 触发
        if ("IntersectionObserver" in window) {
            var observer = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    doAnimate();
                    observer.disconnect();
                }
            }, { threshold: 0.3 });
            observer.observe(container);
        } else {
            doAnimate();
        }
    }

    /* ---- 渲染函数 ---- */
    function renderCompanyInfo(data) {
        document.getElementById("aboutContent").innerHTML = data.about.split('\n\n').map(function(p){ return '<p>' + p + '</p>'; }).join('');
        document.getElementById("companyName").innerHTML = "<strong>" + data.companyName + "</strong>";
        document.getElementById("phone").textContent = "联系电话：" + data.phone;
        document.getElementById("address").textContent = "公司地址：" + data.address;
        document.getElementById("email").textContent = "电子邮箱：" + data.email;
    }

    function renderProducts(data) {
        var c = document.getElementById("productContainer");
        c.innerHTML = data.products.map(function (item, i) {
            var summary = item.summary || item.desc || "";
            var features = item.features || item.points || [];
            var pts = features.map(function (p) { return "<li>" + p + "</li>"; }).join("");
            return '<article class="product-card">' +
                '<a href="product-detail.html?id=' + i + '" style="display:block;text-decoration:none;color:inherit">' +
                '<img src="' + item.image + '" alt="' + item.name + '">' +
                '<div class="product-info">' +
                    '<span class="product-tag">' + (item.tag || "智慧农业设备") + '</span>' +
                    '<h3>' + item.name + '</h3>' +
                    '<p>' + summary + '</p>' +
                    (pts ? '<ul class="product-points">' + pts + '</ul>' : "") +
                    '<span class="card-link-hint">了解详情 →</span>' +
                '</div></a></article>';
        }).join("");
    }

    function renderCases(data) {
        var c = document.getElementById("caseContainer");
        c.innerHTML = data.cases.map(function (item, i) {
            var heroImg = item.heroImage || item.image || '';
            var tag = (item.tags && item.tags.length) ? item.tags[0] : (item.tag || '项目交付');
            return '<article class="case-card">' +
                '<a href="case-detail.html?id=' + i + '" style="display:block;text-decoration:none;color:inherit">' +
                '<img src="' + heroImg + '" alt="' + item.name + '">' +
                '<div class="case-info">' +
                    '<span class="case-tag">' + tag + '</span>' +
                    '<h3>' + item.name + '</h3>' +
                    '<p>' + (item.subtitle || item.desc || "") + '</p>' +
                '</div></a></article>';
        }).join("");
    }

    function renderNews(data) {
        var c = document.getElementById("newsContainer");
        c.innerHTML = data.news.map(function (item, i) {
            return '<article class="news-card">' +
                '<a href="news-detail.html?id=' + i + '" style="display:block;text-decoration:none;color:inherit">' +
                '<img src="' + resolveImage(item.image, newsImageFallbacks, i) + '" alt="' + item.title + '">' +
                '<div class="news-info">' +
                    '<div class="news-date">' + item.date + '</div>' +
                    '<h3>' + item.title + '</h3>' +
                    '<p>' + (item.summary || "围绕智慧农业建设实践，持续分享项目进展、技术应用与交付成果。") + '</p>' +
                    '<span class="card-link-hint">阅读全文 →</span>' +
                '</div></a></article>';
        }).join("");
    }

    /* ---- 启动 ---- */
    getWebsiteData().then(function (data) {
        initHeaderScroll();
        startHeroSlider();
        renderStats(data.stats);
        renderCompanyInfo(data);
        renderProducts(data);
        renderCases(data);
        renderNews(data);
    }).catch(function (err) {
        console.error("加载失败：", err);
    });

})();
