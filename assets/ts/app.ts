import { farallonHelper } from "./utils";
import farallonActions from "./action.ts";
import { farallonComment } from "./comment.ts";
import Douban from "./db.ts";
declare global {
    interface Window {
        actionDomain: string;
        timeFormat: string;
        dbAPIBase: string;
        zoom: string;
    }
}
class farallonBase extends farallonHelper {
    is_single: boolean = false;
    post_id: number = 0;
    is_archive: boolean = false;
    VERSION: string = "0.7.7";
    like_btn: any;
    selctor: string = ".like-btn";
    actionDomain: string = window.actionDomain;
    constructor() {
        super();
        this.initCopyright();
        this.initThemeSwitch();
        this.initBack2Top();
        this.initSearch();
    }

    initSearch() {
        document
            .querySelector('[data-action="show-search"]')!
            .addEventListener("click", () => {
                document
                    .querySelector(".fHeader--content .inner")!
                    .classList.toggle("search--active");
            });
    }

    initBack2Top() {
        if (document.querySelector(".fBackTop")) {
            const backToTop = document.querySelector(
                ".fBackTop"
            ) as HTMLElement;
            window.addEventListener("scroll", () => {
                const t = window.scrollY || window.pageYOffset;
                t > 200
                    ? backToTop!.classList.add("is-active")
                    : backToTop!.classList.remove("is-active");
            });

            backToTop.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    }

    initCopyright() {
        const copyright = `<div class="fFooter--info">
        Theme <a href="https://fatesinger.com/101971" target="_blank">farallon</a> by bigfa / version ${this.VERSION}
    </div>`;

        document
            .querySelector(".fFooter--content")!
            .insertAdjacentHTML("afterend", copyright);

        document
            .querySelector(".icon--copryrights")!
            .addEventListener("click", () => {
                document
                    .querySelector(".fFooter--info")!
                    .classList.toggle("active");
            });
    }

    initThemeSwitch() {
        const theme = localStorage.getItem("theme")
            ? localStorage.getItem("theme")
            : "auto";
        const html = `<div class="fThemeSwitcher">
        <span class="${
            theme == "dark" ? "is-active" : ""
        }" data-action-value="dark">
            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"
                style="color: currentcolor; width: 16px; height: 16px;">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
        </span>
        <span class="${
            theme == "light" ? "is-active" : ""
        }" data-action-value="light">
            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"
                style="color: currentcolor; width: 16px; height: 16px;">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2"></path>
                <path d="M12 21v2"></path>
                <path d="M4.22 4.22l1.42 1.42"></path>
                <path d="M18.36 18.36l1.42 1.42"></path>
                <path d="M1 12h2"></path>
                <path d="M21 12h2"></path>
                <path d="M4.22 19.78l1.42-1.42"></path>
                <path d="M18.36 5.64l1.42-1.42"></path>
            </svg>
        </span>
        <span class="${
            theme == "auto" ? "is-active" : ""
        }"  data-action-value="auto">
            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"
                style="color: currentcolor; width: 16px; height: 16px;">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M8 21h8"></path>
                <path d="M12 17v4"></path>
            </svg>
        </span>
    </div>`;

        document.querySelector("body")!.insertAdjacentHTML("beforeend", html);

        document.querySelectorAll(".fThemeSwitcher span").forEach((item) => {
            item.addEventListener("click", () => {
                if (item.classList.contains("is-active")) return;
                document
                    .querySelectorAll(".fThemeSwitcher span")
                    .forEach((item: Element) => {
                        item.classList.remove("is-active");
                    });
                if ((item as HTMLElement).dataset.actionValue == "dark") {
                    localStorage.setItem("theme", "dark");
                    document.querySelector("body")!.classList.remove("auto");
                    document.querySelector("body")!.classList.add("dark");
                    item.classList.add("is-active");
                } else if (
                    (item as HTMLElement).dataset.actionValue == "light"
                ) {
                    localStorage.setItem("theme", "light");
                    document.querySelector("body")!.classList.remove("auto");
                    document.querySelector("body")!.classList.remove("dark");
                    item.classList.add("is-active");
                } else if (
                    (item as HTMLElement).dataset.actionValue == "auto"
                ) {
                    localStorage.setItem("theme", "auto");
                    document.querySelector("body")!.classList.remove("dark");
                    document.querySelector("body")!.classList.add("auto");
                    item.classList.add("is-active");
                }
            });
        });
    }
}

new farallonActions({
    singleSelector: ".fArticle",
    articleSelector: ".fBlock--item,.fCard--item",
    termSelector: ".fTerm--header",
    likeButtonSelctor: ".like-btn",
    actionDomain: window.actionDomain,
});

new farallonBase();

new farallonComment({
    actionDomain: window.actionDomain,
    wrapper: ".fComment--area",
});

new Douban({
    baseAPI: window.dbAPIBase,
    container: ".db--container",
});
