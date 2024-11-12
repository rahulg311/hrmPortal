import React from 'react';


export const mapStateToProps = (state) => ({
    showAlert: state.projectR.showAlert,
    alertMsg:state.projectR.alertMsg,
    show_loading:state.projectR.show_loading,
    count :state.projectR.count,
    StateMasterView1:state.projectR.StateMasterView1
});
  
 
export const mapDispatchToProps = (dispatch) => {
    return {
        show_alert:(data)=>dispatch({type:'SHOW_ALERT',data:data}),
        show_loading:(data)=>dispatch({type:"Show_loading",data:data}),
        increment: () => dispatch({ type: 'INCREMENT' }),
        decrement:()=> dispatch({type:"decrement"}),
        StateMasterView:(data)=>dispatch({type:"STATE_MASTER_VIEW",data:data})


    }
} 

 
 