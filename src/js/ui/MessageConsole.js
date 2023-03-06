import html from "../../html/ui/MessageConsole.html";
import _UIElement from "./_UIElement";

class MessageConsole extends _UIElement {
    constructor() {
        super(html);

        this.messagesInnerDom = this.dom.getElementsByClassName("messages__inn")[0];
    }

    updateLastMessageCount(lastMessage) {
        const lastMessageDom = document.querySelectorAll(".message:last-child")[0];
        const amountDom = lastMessageDom.querySelectorAll(".message__amount")[0];

        if (amountDom) {
            amountDom.innerText = "x" + lastMessage.count;
        } else {
            lastMessageDom.appendChild(lastMessage.getCountHtml());
        }
    }

    addMessage(messageHtml) {
        this.messagesInnerDom.appendChild(messageHtml);
    }

    clear() {
        this.messagesInnerDom.innerHTML = "";
    }
}

const messageConsole = new MessageConsole();
export default messageConsole;