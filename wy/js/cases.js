/* ============================================
   cases.js — 服务项目页
   sidebar 用案例的 tag 做分类过滤
   兼容新旧数据格式（heroImage/image, tags/tag）
   ============================================ */

(function () {
    "use strict";

    var allCases = [];
    var activeTag = null;

    /* sidebar 分类：每个 tag 对应一组关键词 */
    var CATEGORIES = [
        { id: "all", name: "全部项目", keywords: [] },
        { id: "smart", name: "智慧农业项目", keywords: ["示范园", "智慧农业", "物联网", "数字化"] },
        { id: "saving", name: "节水灌溉项目", keywords: ["节水灌溉", "大田", "太阳能", "滴灌"] },
        { id: "fertigation", name: "水肥一体化项目", keywords: ["水肥一体化", "蔬菜大棚", "精准灌溉"] }
    ];

    /* 兼容新旧格式：取图片路径 */
    function getCaseImage(c) {
        return c.heroImage || c.image || "";
    }

    /* 兼容新旧格式：取标签数组 */
    function getCaseTags(c) {
        if (c.tags && c.tags.length) return c.tags;
        if (c.tag) return [c.tag];
        return [];
    }

    function getWebsiteData() {
        var localData = localStorage.getItem("websiteData");
        if (localData) {
            try {
                var parsed = JSON.parse(localData);
                if (parsed.version === '2.0' || parsed.version === '2.1') {
                    return Promise.resolve(parsed);
                }
            } catch(e) {}
            localStorage.removeItem("websiteData");
        }
        return fetch("data/content.json").then(function (r) { return r.json(); });
    }

    /* ---- 渲染左侧分类导航 ---- */
    function renderSidebar() {
        var nav = document.getElementById("sidebarNav");
        var html = "";

        CATEGORIES.forEach(function (cat) {
            var isActive = (activeTag === cat.id);
            html += '<a href="#" class="sidebar-link' + (isActive ? " active" : "") +
                '" data-id="' + cat.id + '">' +
                '<span class="sidebar-link-dot">\u00b7</span> ' + cat.name +
                '<svg class="sidebar-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 6 15 12 9 18"/></svg>' +
                '</a>';
        });

        nav.innerHTML = html;

        nav.addEventListener("click", function (e) {
            var link = e.target.closest(".sidebar-link");
            if (!link) return;
            e.preventDefault();
            activeTag = link.dataset.id;

            nav.querySelectorAll(".sidebar-link").forEach(function (el) {
                el.classList.toggle("active", el.dataset.id === activeTag);
            });

            renderCases();
        });
    }

    /* ---- 过滤案例 ---- */
    function getFilteredCases(filterText) {
        var filtered = allCases;

        /* 按分类过滤 */
        if (activeTag && activeTag !== "all") {
            var cat = CATEGORIES.find(function (c) { return c.id === activeTag; });
            if (cat && cat.keywords.length > 0) {
                filtered = filtered.filter(function (c) {
                    var text = (c.name || "") + " " + (c.subtitle || "") + " " + getCaseTags(c).join(" ");
                    return cat.keywords.some(function (kw) { return text.indexOf(kw) !== -1; });
                });
            }
        }

        /* 搜索过滤 */
        if (filterText) {
            var kw = filterText.toLowerCase();
            filtered = filtered.filter(function (c) {
                return (c.name && c.name.toLowerCase().indexOf(kw) !== -1) ||
                       (c.subtitle && c.subtitle.toLowerCase().indexOf(kw) !== -1) ||
                       (getCaseTags(c).join(" ").toLowerCase().indexOf(kw) !== -1);
            });
        }

        return filtered;
    }

    /* ---- 渲染案例网格 ---- */
    function renderCases(filterText) {
        var grid = document.getElementById("casesGrid");
        var empty = document.getElementById("casesEmpty");
        var tabTitle = document.getElementById("casesTabTitle");

        var filtered = getFilteredCases(filterText);

        /* 更新 tab 标题 */
        if (activeTag && activeTag !== "all") {
            var cat = CATEGORIES.find(function (c) { return c.id === activeTag; });
            tabTitle.textContent = cat ? cat.name : "筛选结果";
        } else {
            tabTitle.textContent = "服务项目";
        }

        if (filtered.length === 0) {
            grid.innerHTML = "";
            empty.style.display = "";
            return;
        }
        empty.style.display = "none";

        grid.innerHTML = filtered.map(function (c) {
            var idx = allCases.indexOf(c);
            var img = getCaseImage(c);
            var tags = getCaseTags(c).map(function (t) {
                return '<span class="case-project-tag">' + t + '</span>';
            }).join("");

            return '<article class="case-project-card">' +
                '<a href="case-detail.html?id=' + idx + '" class="case-project-link">' +
                '<div class="case-project-img">' +
                    '<img src="' + img + '" alt="' + c.name + '" class="case-project-photo">' +
                    '<div class="case-project-photo-overlay"></div>' +
                    '<div class="case-project-brand">' +
                        '<span class="brand-logo">HG</span>' +
                        '<span class="brand-name">\u6167\u8015\u519c\u4e1a\u79d1\u6280</span>' +
                    '</div>' +
                    '<h3 class="case-project-name">' + c.name + '</h3>' +
                '</div>' +
                '<div class="case-project-info">' +
                    '<div class="case-project-tags">' + tags + '</div>' +
                    (c.subtitle ? '<p class="case-project-subtitle">' + c.subtitle + '</p>' : '') +
                    '<span class="case-project-linktext">\u67e5\u770b\u8be6\u60c5 \u2192</span>' +
                '</div>' +
                '</a>' +
            '</article>';
        }).join("");
    }

    /* ---- 初始化 ---- */
    getWebsiteData().then(function (data) {
        allCases = data.cases || [];
        activeTag = "all";

        renderSidebar();
        renderCases();

        var searchInput = document.getElementById("caseSearch");
        var debounceTimer = null;
        searchInput.addEventListener("input", function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
                renderCases(searchInput.value.trim());
            }, 250);
        });
    }).catch(function (err) {
        console.error("\u52a0\u8f7d\u9871\u76ee\u6570\u636e\u5931\u8d25\uff1a", err);
    });
})();
