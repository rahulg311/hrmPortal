import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  mapDispatchToProps,
  mapStateToProps,
} from "../../src/constants/contextProvider";

const Loader = (props) => {
  const dispatch = useDispatch();
  console.log("counts-----", props.count);


  return (
    <>
      {/* <p>{props.count}</p>
    <button className='btn  w-25' onClick={props.increment}>inc</button>
    <button className='btn  w-25' onClick={props.decrement}>inc</button> */}
      <div class="loader">
        Loading
        <span></span>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
