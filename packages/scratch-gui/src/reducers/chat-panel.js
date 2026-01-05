const SET_CHAT_PANEL = "scratch-gui/chatPanel/SET_CHAT_PANEL";
const SET_INPUT_VALUE = "scratch-gui/chatPanel/SET_INPUT_VALUE";
const SET_MESSAGES = "scratch-gui/chatPanel/SET_MESSAGES";
const SET_LOADING = "scratch-gui/chatPanel/SET_LOADING";
const SET_SESSION_ID = "scratch-gui/chatPanel/SET_SESSION_ID";
const SET_SESSIONS = "scratch-gui/chatPanel/SET_SESSIONS";
const SET_SESSION_TITLE = "scratch-gui/chatPanel/SET_SESSION_TITLE";

const initialState = {
    chatPanel: false,
    inputValue: "",
    messages: [],
    loading: false,
    sessionId: null,
    sessions: [],
    sessionTitle: "新对话"
};

const reducer = function (state, action) {
    if (typeof state === "undefined") state = initialState;
    switch (action.type) {
        case SET_CHAT_PANEL:
            return {
                ...state,
                chatPanel: action.chatPanel,
            };
        case SET_INPUT_VALUE:
            return {
                ...state,
                inputValue: action.inputValue,
            };
        case SET_MESSAGES:
            return {
                ...state,
                messages: action.messages,
            };
        case SET_LOADING:
            return {
                ...state,
                loading: action.loading,
            };
        case SET_SESSION_ID:
            return {
                ...state,
                sessionId: action.sessionId,
            };
        case SET_SESSIONS:
            return {
                ...state,
                sessions: action.sessions,
            };
        case SET_SESSION_TITLE:
            return {
                ...state,
                sessionTitle: action.sessionTitle
            }
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

const setInputValue = function (value) {
    return {
        type: SET_INPUT_VALUE,
        inputValue: value,
    };
};

const setMessages = function (messages) {
    return {
        type: SET_MESSAGES,
        messages: messages,
    };
};

const setLoading = function (loading) {
    return {
        type: SET_LOADING,
        loading: loading,
    };
};

const setSessionId = function (sessionId) {
    return {
        type: SET_SESSION_ID,
        sessionId: sessionId,
    };
};

const setSessions = function (sessions) {
    return {
        type: SET_SESSIONS,
        sessions: sessions,
    };
};

const setSessionTitle = function (sessionTitle) {
    return {
        type: SET_SESSION_TITLE,
        sessionTitle: sessionTitle
    }
}

export {
    reducer as default,
    initialState as chatPanelInitialState,
    setChatPanel,
    setInputValue,
    setMessages,
    setLoading,
    setSessionId,
    setSessions,
    setSessionTitle
};