"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_components_public_loginportal_components_LoginLoader_js"],{

/***/ "./resources/js/components/public/loginportal/components/LoginLoader.js":
/*!******************************************************************************!*\
  !*** ./resources/js/components/public/loginportal/components/LoginLoader.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/spin/index.js");
/* harmony import */ var _public_images_loaderlogo_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../public/images/loaderlogo.svg */ "./public/images/loaderlogo.svg");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/LoadingOutlined.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

 // Ant Design spinner
 // Your logo
 // Alternative spinner from Ant Design

var LoginLoader = function LoginLoader() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      // Stack the logo and spinner vertically
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      // Slight overlay for loader
      zIndex: 10 // Ensure it's on top of the background
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
      src: _public_images_loaderlogo_svg__WEBPACK_IMPORTED_MODULE_1__["default"],
      alt: "Loading...",
      style: {
        width: '100px',
        // You can adjust the size of the logo here
        height: '100px',
        animation: 'beat 1.5s ease-in-out infinite' // Apply the beating animation
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(antd__WEBPACK_IMPORTED_MODULE_3__["default"], {
      indicator: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_ant_design_icons__WEBPACK_IMPORTED_MODULE_4__["default"], {
        style: {
          fontSize: 40
        }
      }) // Custom spinner
      ,
      spinning: true,
      style: {
        marginTop: '20px' // Add space between the logo and the spinner
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("style", {
      children: "\n          @keyframes beat {\n            0% {\n              transform: scale(1);\n            }\n            50% {\n              transform: scale(1.1); /* The size of the logo increases */\n            }\n            100% {\n              transform: scale(1);\n            }\n          }\n        "
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LoginLoader);

/***/ }),

/***/ "./public/images/loaderlogo.svg":
/*!**************************************!*\
  !*** ./public/images/loaderlogo.svg ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/images/loaderlogo.svg?835dfa1364bfaa3e851fd800c053c914");

/***/ })

}]);