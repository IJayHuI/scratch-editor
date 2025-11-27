const SET_CHAT_PANEL = "scratch-gui/chatPanel/SET_CHAT_PANEL";

const initialState = {
    chatPanel: false,
};

const reducer = function (state, action) {
    if (typeof state === "undefined") state = initialState;
    switch (action.type) {
        case SET_CHAT_PANEL:
            return {
                chatPanel: action.chatPanel,
            };
        default:
            return state;
    }
};

const setChatPanel = function (status) {
    return {
        type: SET_CHAT_PANEL,
        chatPanel: status,
    };
};

export { reducer as default, initialState as chatPanelInitialState, setChatPanel };
