const INIT_STATE = [];

const completeReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case 'COMPLETE':
            return [...state, ...action.payload]
    
        default:
            return state;
    }
}

export default completeReducer;