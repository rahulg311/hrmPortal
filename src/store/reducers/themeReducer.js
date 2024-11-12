import React from "react";

const initialState = {
    DarkMode: false
};

const themeReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_THEME':
            return {...state,DarkMode:action.DarkMode};
        default:
            return state;
    }
}
export default themeReducer;