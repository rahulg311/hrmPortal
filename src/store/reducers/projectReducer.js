import React from "react";

const initialState = {
    showAlert:true,
    alertMsg:'',
    sideClick:true,
    showProject:true,
    show_loading:true,
    count:0,
    StateMasterView1:[],
    sample: "",
    loading: true,
    
};

const projectReducer = (state = initialState, action) => {

    switch(action.type) {
        case "GET_SAMPLE":
      return {...state,sample: action.data,loading: false,};

    case "SAMPLE_ERROR":
      return {loading: false,error: action.payload,};
        case "STATE_MASTER_VIEW" :
            console.log("satateee---2",state,action.data)
            return {...state, StateMasterView1:action.data};
        case 'SHOW_ALERT':
            return {...state,showAlert:action.data.showAlert,alertMsg:action.data.alertMsg};
        case 'SIDE_CLICK':
            return {...state,sideClick:action.payload};
        case 'Show_Project':
            return {...state,showProject:action.payload};
        case 'Show_loading':
            return {...state, show_loading:action.payload }
        case "INCREMENT" :
            return {...state ,count :state.count+1 }
        case "decrement" :
            return {...state, count:state.count-1}
      

        default:

            return state;
    }
}
export default projectReducer;

