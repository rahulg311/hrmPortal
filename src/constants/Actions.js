

export const Actions = (data) => async (dispatch) => {
  try {
    console.log("datttt", data)
    dispatch({
      type: "GET_SAMPLE",
      payload: data
    });
  } catch (error) {
    dispatch({
      type: "SAMPLE_ERROR",
      payload: "error message"
    });
  }
};