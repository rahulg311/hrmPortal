import React from "react";
import PropTypes from "prop-types";
import { default as ReactSelect } from "react-select";

const SelectDropdown = (props) => {
  if (props.allowSelectAll) {
    return (
      <ReactSelect
        {...props}
        options={[props.allOption, ...props.options]}
        // onChange={selected => {
        //   if (
        //     selected !== null &&
        //     selected.length > 0 &&
        //     selected[selected.length - 1].value === props.allOption.value
        //   ) {
        //     return props.onChange(props.options);
        //   }
        //   // console.log("props.---------",props)
        //   return props.onChange(props.options);
        // }}
      />
    );
  }

  return <ReactSelect {...props} />;
};

SelectDropdown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  allowSelectAll: PropTypes.bool,
  allOption: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
};

SelectDropdown.defaultProps = {
  allOption: {
    label: "Select all",
    value: "*",
  },
};

export default SelectDropdown;
