import html from "../../html/ui/SelectList.html";
import _UIElement from "./_UIElement";

class SelectList extends _UIElement {
    constructor() {
        super(html);

        this.titleDom = this.dom.getElementsByClassName("select-list__title")[0];
        this.optionsDom = this.dom.getElementsByClassName("select-list__options")[0];
    }

    setTitle(title) {
        this.titleDom.innerText = title;
    }

    setOptions(options) {
        this.optionsDom.innerHTML = "";
        let index = 0;
        for (const option of options) {
            const li = document.createElement("li");
            li.classList.add("select-list__option");
            li.dataset.index = index.toString();
            if (index === 0) {
                li.classList.add("active");
            }
            li.innerText = option;
            this.optionsDom.appendChild(li);
            index ++;
        }
    }

    moveActiveUp() {
        const activeElement = this.optionsDom.getElementsByClassName("active")[0];
        const previousElement = activeElement.previousElementSibling;
        if (previousElement) {
            if (previousElement !== activeElement) {
                previousElement.classList.add("active");
                activeElement.classList.remove("active");
            }
        } else {
            const lastElement = this.optionsDom.lastElementChild;
            if (lastElement !== activeElement) {
                lastElement.classList.add("active");
                activeElement.classList.remove("active");
            }
        }
    }

    moveActiveDown() {
        const activeElement = this.optionsDom.getElementsByClassName("active")[0];
        const nextElement = activeElement.nextElementSibling;
        if (nextElement) {
            if (nextElement !== activeElement) {
                nextElement.classList.add("active");
                activeElement.classList.remove("active");
            }
        } else {
            const firstElement = this.optionsDom.firstElementChild;
            if (firstElement !== activeElement) {
                firstElement.classList.add("active");
                activeElement.classList.remove("active");
            }
        }
    }

    getActiveIndex() {
        const activeElement = this.optionsDom.getElementsByClassName("active")[0];
        return parseInt(activeElement.dataset.index);
    }

    open(x, y) {
        this.dom.style.left = x + "px";
        this.dom.style.top = y + "px";

        super.open();
    }
}

const selectList = new SelectList();
export default selectList;