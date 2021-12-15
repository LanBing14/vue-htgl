import {
    Message
} from 'element-ui';
let messageInstance = null;
const fxbMessage = (options) => {
    if (messageInstance) {
        messageInstance.close()
    }
    messageInstance = Message(options)
};
['error', 'success', 'info', 'warning'].forEach(type => {
    fxbMessage[type] = options => {
        if (typeof options === 'string') {
            options = {
                message: options
            }
        }
        if (options) {
            options.type = type
            return fxbMessage(options)
        } else {
            return options
        }


    }
})
export const message = fxbMessage;