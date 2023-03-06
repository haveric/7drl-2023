import SubMessage from "./SubMessage";
import Message from "./Message";
import MessageConsole from "../ui/MessageConsole";

class MessageManager {
    constructor() {
        this.messages = [];
        this.builder = [];
    }

    text(text, color, options) {
        this.builder.push(new SubMessage(text, color, options));
        return this; // Allow chaining
    }

    build(stack = true) {
        this.addMessage(this.builder.slice(0), stack);
        this.builder = [];
    }

    clear() {
        this.messages = [];
        MessageConsole.clear();
    }

    addMessage(subMessages, stack = true) {
        if (stack && this.messages.length > 0) {
            const lastMessage = this.messages[this.messages.length - 1];
            if (lastMessage.isEqual(subMessages)) {
                lastMessage.count += 1;
                MessageConsole.updateLastMessageCount(lastMessage);
            } else {
                this.addNewMessage(subMessages);
            }
        } else {
            this.addNewMessage(subMessages);
        }
    }

    addNewMessage(subMessages) {
        const newMessage = new Message(subMessages);
        this.messages.push(newMessage);
        MessageConsole.addMessage(newMessage.getHtml());
    }
}

const messageManager = new MessageManager();
export default messageManager;