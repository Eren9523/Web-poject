const caseImages = [
    "images/案例一：智能水肥一体机.jpg",
    "images/案例二：大田智能灌溉系统实拍.jpg",
    "images/案例三：蔬菜大棚精准水肥管控场景.jpg",
    "images/案例四：脐橙果园数字化升级场景.jpg"
];

const newsImages = [
    "images/新闻一：湖北省智慧农业示范工程.jpg",
    "images/新闻二：智能滴灌系统应用场景.jpg",
    "images/新闻三：“慧农云”农业物联网管理平台.jpg"
];

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        loadData();
    } else {
        alert("用户名或密码错误");
    }
}

function logout() {
    location.reload();
}

function loadData() {
    const localData = localStorage.getItem("websiteData");

    if (localData) {
        fillForm(JSON.parse(localData));
        return;
    }

    fetch("data/content.json")
        .then(res => res.json())
        .then(data => {
            fillForm(data);
        });
}

function fillForm(data) {
    document.getElementById("aboutInput").value = data.about;
    document.getElementById("phoneInput").value = data.phone;
    document.getElementById("emailInput").value = data.email;
    document.getElementById("addressInput").value = data.address;

    document.getElementById("productInput").value = data.products
        .map(item => `${item.name}|${item.desc}`)
        .join("\n");

    document.getElementById("caseInput").value = data.cases
        .map(item => item.name)
        .join("\n");

    document.getElementById("newsInput").value = data.news
        .map(item => `${item.title}|${item.date}`)
        .join("\n");
}

function saveData() {
    fetch("data/content.json")
        .then(res => res.json())
        .then(data => {
            data.about = document.getElementById("aboutInput").value;
            data.phone = document.getElementById("phoneInput").value;
            data.email = document.getElementById("emailInput").value;
            data.address = document.getElementById("addressInput").value;

            const productLines = document.getElementById("productInput")
                .value
                .split("\n")
                .filter(line => line.trim() !== "");

            data.products = productLines.map((line, index) => {
                const arr = line.split("|");
                const oldItem = data.products[index] || {};

                return {
                    name: arr[0] || "",
                    desc: arr[1] || "",
                    image: `images/product${index + 1}.jpg`,
                    tag: oldItem.tag || "智慧农业设备",
                    points: oldItem.points || []
                };
            });

            const caseLines = document.getElementById("caseInput")
                .value
                .split("\n")
                .filter(line => line.trim() !== "");

            data.cases = caseLines.map((line, index) => {
                const oldItem = data.cases[index] || {};

                return {
                    name: line,
                    image: caseImages[index] || caseImages[caseImages.length - 1],
                    tag: oldItem.tag || "项目交付",
                    desc: oldItem.desc || "根据不同地块、作物和管理模式提供定制化灌溉与数字化管控方案。"
                };
            });

            const newsLines = document.getElementById("newsInput")
                .value
                .split("\n")
                .filter(line => line.trim() !== "");

            data.news = newsLines.map((line, index) => {
                const arr = line.split("|");
                const oldItem = data.news[index] || {};

                return {
                    title: arr[0] || "",
                    date: arr[1] || "",
                    image: newsImages[index] || newsImages[newsImages.length - 1],
                    summary: oldItem.summary || "围绕智慧农业建设实践，持续分享项目进展、技术应用与交付成果。"
                };
            });

            data.version = '2.1';
            localStorage.setItem("websiteData", JSON.stringify(data));
            alert("保存成功！\n\n刷新首页即可查看最新内容。");
        });
}
