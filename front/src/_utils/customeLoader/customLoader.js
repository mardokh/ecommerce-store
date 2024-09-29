import React from "react"
import './customeLoader.css'

const CustomLoader = () => {
    return (
      <div className="custom-loader">
        <svg className="spinner" viewBox="0 0 50 50">
          <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
        </svg>
      </div>
    );
};


export default CustomLoader