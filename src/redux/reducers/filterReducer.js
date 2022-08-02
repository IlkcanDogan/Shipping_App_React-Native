import moment from 'moment';

const INIT_STATE = {
    startDate: moment(new Date()).format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
    status: 'wait'
};

const filterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case 'FILTER':
            return {...state, ...action.payload}
    
        default:
            return state;
    }
}

export default filterReducer;