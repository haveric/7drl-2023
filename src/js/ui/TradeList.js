import html from "../../html/ui/TradeList.html";
import _UIElement from "./_UIElement";

class TradeList extends _UIElement {
    constructor() {
        super(html);

        this.titleDom = this.dom.getElementsByClassName("trade-list__title")[0];
        this.leftOptionsDom = this.dom.getElementsByClassName("trade-list__left-options")[0];
        this.rightOptionsDom = this.dom.getElementsByClassName("trade-list__right-options")[0];
    }

    setTitle(title) {
        this.titleDom.innerText = title;
    }

    setOptions(leftOptions, rightOptions) {
        this.leftOptionsDom.innerHTML = "";
        let index = 0;
        for (const option of leftOptions) {
            const li = document.createElement("li");
            li.classList.add("trade-list__option");
            li.dataset.index = index.toString();
            if (index === 0) {
                li.classList.add("active");
            }
            if (option) {
                li.innerText = option.name;
            } else {
                li.innerText = "<empty>";
            }
            this.leftOptionsDom.appendChild(li);
            index ++;
        }

        this.rightOptionsDom.innerHTML = "";
        index = 0;
        for (const option of rightOptions) {
            const li = document.createElement("li");
            li.classList.add("trade-list__option");
            li.dataset.index = index.toString();
            if (option) {
                li.innerText = option.name;
            } else {
                li.innerText = "<empty>";
            }
            this.rightOptionsDom.appendChild(li);
            index ++;
        }
    }

    moveActiveUp() {
        let activeElement = this.leftOptionsDom.getElementsByClassName("active")[0];
        if (activeElement) {
            const previousElement = activeElement.previousElementSibling;
            if (previousElement) {
                if (previousElement !== activeElement) {
                    previousElement.classList.add("active");
                    activeElement.classList.remove("active");
                }
            } else {
                const lastElement = this.leftOptionsDom.lastElementChild;
                if (lastElement !== activeElement) {
                    lastElement.classList.add("active");
                    activeElement.classList.remove("active");
                }
            }
        } else {
            activeElement = this.rightOptionsDom.getElementsByClassName("active")[0];
            if (activeElement) {
                const previousElement = activeElement.previousElementSibling;
                if (previousElement) {
                    if (previousElement !== activeElement) {
                        previousElement.classList.add("active");
                        activeElement.classList.remove("active");
                    }
                } else {
                    const lastElement = this.rightOptionsDom.lastElementChild;
                    if (lastElement !== activeElement) {
                        lastElement.classList.add("active");
                        activeElement.classList.remove("active");
                    }
                }
            }
        }
    }

    moveActiveDown() {
        let activeElement = this.leftOptionsDom.getElementsByClassName("active")[0];
        if (activeElement) {
            const nextElement = activeElement.nextElementSibling;
            if (nextElement) {
                if (nextElement !== activeElement) {
                    nextElement.classList.add("active");
                    activeElement.classList.remove("active");
                }
            } else {
                const firstElement = this.leftOptionsDom.firstElementChild;
                if (firstElement !== activeElement) {
                    firstElement.classList.add("active");
                    activeElement.classList.remove("active");
                }
            }
        } else {
            activeElement = this.rightOptionsDom.getElementsByClassName("active")[0];
            if (activeElement) {
                const nextElement = activeElement.nextElementSibling;
                if (nextElement) {
                    if (nextElement !== activeElement) {
                        nextElement.classList.add("active");
                        activeElement.classList.remove("active");
                    }
                } else {
                    const firstElement = this.rightOptionsDom.firstElementChild;
                    if (firstElement !== activeElement) {
                        firstElement.classList.add("active");
                        activeElement.classList.remove("active");
                    }
                }
            }
        }
    }

    moveActiveLeftRight() {
        let activeElement = this.leftOptionsDom.getElementsByClassName("active")[0];
        if (activeElement) {
            const firstElement = this.rightOptionsDom.firstElementChild;
            firstElement.classList.add("active");
            activeElement.classList.remove("active");
        } else {
            activeElement = this.rightOptionsDom.getElementsByClassName("active")[0];
            const firstElement = this.leftOptionsDom.firstElementChild;
            firstElement.classList.add("active");
            activeElement.classList.remove("active");
        }
    }

    getLeftActiveIndex() {
        let index = -1;
        const activeElement = this.leftOptionsDom.getElementsByClassName("active")[0];
        if (activeElement) {
            index = parseInt(activeElement.dataset.index);
        }
        return index;
    }

    getRightActiveIndex() {
        let index = -1;
        const activeElement = this.rightOptionsDom.getElementsByClassName("active")[0];
        if (activeElement) {
            index = parseInt(activeElement.dataset.index);
        }
        return index;
    }

    open(x, y) {
        this.dom.style.left = x + "px";
        this.dom.style.top = y + "px";

        super.open();
    }
}

const tradeList = new TradeList();
export default tradeList;