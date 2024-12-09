"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_components_public_dashboard_components_MobileSidebarToggle_js"],{

/***/ "./node_modules/antd/es/drawer/DrawerPanel.js":
/*!****************************************************!*\
  !*** ./node_modules/antd/es/drawer/DrawerPanel.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _util_hooks_useClosable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_util/hooks/useClosable */ "./node_modules/antd/es/_util/hooks/useClosable.js");
/* harmony import */ var _config_provider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config-provider */ "./node_modules/antd/es/config-provider/context.js");
/* harmony import */ var _skeleton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../skeleton */ "./node_modules/antd/es/skeleton/index.js");
"use client";






const DrawerPanel = props => {
  var _a, _b;
  const {
    prefixCls,
    title,
    footer,
    extra,
    loading,
    onClose,
    headerStyle,
    bodyStyle,
    footerStyle,
    children,
    classNames: drawerClassNames,
    styles: drawerStyles
  } = props;
  const {
    drawer: drawerContext
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(_config_provider__WEBPACK_IMPORTED_MODULE_2__.ConfigContext);
  const customCloseIconRender = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(icon => (/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Close",
    className: `${prefixCls}-close`
  }, icon)), [onClose]);
  const [mergedClosable, mergedCloseIcon] = (0,_util_hooks_useClosable__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_util_hooks_useClosable__WEBPACK_IMPORTED_MODULE_3__.pickClosable)(props), (0,_util_hooks_useClosable__WEBPACK_IMPORTED_MODULE_3__.pickClosable)(drawerContext), {
    closable: true,
    closeIconRender: customCloseIconRender
  });
  const headerNode = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    var _a, _b;
    if (!title && !mergedClosable) {
      return null;
    }
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      style: Object.assign(Object.assign(Object.assign({}, (_a = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.styles) === null || _a === void 0 ? void 0 : _a.header), headerStyle), drawerStyles === null || drawerStyles === void 0 ? void 0 : drawerStyles.header),
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(`${prefixCls}-header`, {
        [`${prefixCls}-header-close-only`]: mergedClosable && !title && !extra
      }, (_b = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.classNames) === null || _b === void 0 ? void 0 : _b.header, drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.header)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: `${prefixCls}-header-title`
    }, mergedCloseIcon, title && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: `${prefixCls}-title`
    }, title)), extra && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: `${prefixCls}-extra`
    }, extra));
  }, [mergedClosable, mergedCloseIcon, extra, headerStyle, prefixCls, title]);
  const footerNode = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    var _a, _b;
    if (!footer) {
      return null;
    }
    const footerClassName = `${prefixCls}-footer`;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(footerClassName, (_a = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.classNames) === null || _a === void 0 ? void 0 : _a.footer, drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.footer),
      style: Object.assign(Object.assign(Object.assign({}, (_b = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.styles) === null || _b === void 0 ? void 0 : _b.footer), footerStyle), drawerStyles === null || drawerStyles === void 0 ? void 0 : drawerStyles.footer)
    }, footer);
  }, [footer, footerStyle, prefixCls]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, headerNode, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(`${prefixCls}-body`, drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.body, (_a = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.classNames) === null || _a === void 0 ? void 0 : _a.body),
    style: Object.assign(Object.assign(Object.assign({}, (_b = drawerContext === null || drawerContext === void 0 ? void 0 : drawerContext.styles) === null || _b === void 0 ? void 0 : _b.body), bodyStyle), drawerStyles === null || drawerStyles === void 0 ? void 0 : drawerStyles.body)
  }, loading ? (/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_skeleton__WEBPACK_IMPORTED_MODULE_4__["default"], {
    active: true,
    title: false,
    paragraph: {
      rows: 5
    },
    className: `${prefixCls}-body-skeleton`
  })) : children), footerNode);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DrawerPanel);

/***/ }),

/***/ "./node_modules/antd/es/drawer/index.js":
/*!**********************************************!*\
  !*** ./node_modules/antd/es/drawer/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var rc_drawer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rc-drawer */ "./node_modules/rc-drawer/es/index.js");
/* harmony import */ var _util_ContextIsolator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../_util/ContextIsolator */ "./node_modules/antd/es/_util/ContextIsolator.js");
/* harmony import */ var _util_hooks_useZIndex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../_util/hooks/useZIndex */ "./node_modules/antd/es/_util/hooks/useZIndex.js");
/* harmony import */ var _util_motion__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_util/motion */ "./node_modules/antd/es/_util/motion.js");
/* harmony import */ var _util_warning__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_util/warning */ "./node_modules/antd/es/_util/warning.js");
/* harmony import */ var _util_zindexContext__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../_util/zindexContext */ "./node_modules/antd/es/_util/zindexContext.js");
/* harmony import */ var _config_provider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config-provider */ "./node_modules/antd/es/config-provider/context.js");
/* harmony import */ var _watermark_context__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../watermark/context */ "./node_modules/antd/es/watermark/context.js");
/* harmony import */ var _DrawerPanel__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./DrawerPanel */ "./node_modules/antd/es/drawer/DrawerPanel.js");
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style */ "./node_modules/antd/es/drawer/style/index.js");
"use client";

var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};












const _SizeTypes = ['default', 'large'];
const defaultPushState = {
  distance: 180
};
const Drawer = props => {
  var _a;
  const {
      rootClassName,
      width,
      height,
      size = 'default',
      mask = true,
      push = defaultPushState,
      open,
      afterOpenChange,
      onClose,
      prefixCls: customizePrefixCls,
      getContainer: customizeGetContainer,
      style,
      className,
      // Deprecated
      visible,
      afterVisibleChange,
      maskStyle,
      drawerStyle,
      contentWrapperStyle
    } = props,
    rest = __rest(props, ["rootClassName", "width", "height", "size", "mask", "push", "open", "afterOpenChange", "onClose", "prefixCls", "getContainer", "style", "className", "visible", "afterVisibleChange", "maskStyle", "drawerStyle", "contentWrapperStyle"]);
  const {
    getPopupContainer,
    getPrefixCls,
    direction,
    drawer
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(_config_provider__WEBPACK_IMPORTED_MODULE_3__.ConfigContext);
  const prefixCls = getPrefixCls('drawer', customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = (0,_style__WEBPACK_IMPORTED_MODULE_4__["default"])(prefixCls);
  const getContainer =
  // 有可能为 false，所以不能直接判断
  customizeGetContainer === undefined && getPopupContainer ? () => getPopupContainer(document.body) : customizeGetContainer;
  const drawerClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
    'no-mask': !mask,
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, rootClassName, hashId, cssVarCls);
  // ========================== Warning ===========================
  if (true) {
    const warning = (0,_util_warning__WEBPACK_IMPORTED_MODULE_5__.devUseWarning)('Drawer');
    [['visible', 'open'], ['afterVisibleChange', 'afterOpenChange'], ['headerStyle', 'styles.header'], ['bodyStyle', 'styles.body'], ['footerStyle', 'styles.footer'], ['contentWrapperStyle', 'styles.wrapper'], ['maskStyle', 'styles.mask'], ['drawerStyle', 'styles.content']].forEach(_ref => {
      let [deprecatedName, newName] = _ref;
      warning.deprecated(!(deprecatedName in props), deprecatedName, newName);
    });
    if (getContainer !== undefined && ((_a = props.style) === null || _a === void 0 ? void 0 : _a.position) === 'absolute') {
       true ? warning(false, 'breaking', '`style` is replaced by `rootStyle` in v5. Please check that `position: absolute` is necessary.') : 0;
    }
  }
  // ============================ Size ============================
  const mergedWidth = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => width !== null && width !== void 0 ? width : size === 'large' ? 736 : 378, [width, size]);
  const mergedHeight = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => height !== null && height !== void 0 ? height : size === 'large' ? 736 : 378, [height, size]);
  // =========================== Motion ===========================
  const maskMotion = {
    motionName: (0,_util_motion__WEBPACK_IMPORTED_MODULE_6__.getTransitionName)(prefixCls, 'mask-motion'),
    motionAppear: true,
    motionEnter: true,
    motionLeave: true,
    motionDeadline: 500
  };
  const panelMotion = motionPlacement => ({
    motionName: (0,_util_motion__WEBPACK_IMPORTED_MODULE_6__.getTransitionName)(prefixCls, `panel-motion-${motionPlacement}`),
    motionAppear: true,
    motionEnter: true,
    motionLeave: true,
    motionDeadline: 500
  });
  // ============================ Refs ============================
  // Select `ant-modal-content` by `panelRef`
  const panelRef = (0,_watermark_context__WEBPACK_IMPORTED_MODULE_7__.usePanelRef)();
  // ============================ zIndex ============================
  const [zIndex, contextZIndex] = (0,_util_hooks_useZIndex__WEBPACK_IMPORTED_MODULE_8__.useZIndex)('Drawer', rest.zIndex);
  // =========================== Render ===========================
  const {
    classNames: propClassNames = {},
    styles: propStyles = {}
  } = rest;
  const {
    classNames: contextClassNames = {},
    styles: contextStyles = {}
  } = drawer || {};
  return wrapCSSVar(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_util_ContextIsolator__WEBPACK_IMPORTED_MODULE_9__["default"], {
    form: true,
    space: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_util_zindexContext__WEBPACK_IMPORTED_MODULE_10__["default"].Provider, {
    value: contextZIndex
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(rc_drawer__WEBPACK_IMPORTED_MODULE_2__["default"], Object.assign({
    prefixCls: prefixCls,
    onClose: onClose,
    maskMotion: maskMotion,
    motion: panelMotion
  }, rest, {
    classNames: {
      mask: classnames__WEBPACK_IMPORTED_MODULE_1___default()(propClassNames.mask, contextClassNames.mask),
      content: classnames__WEBPACK_IMPORTED_MODULE_1___default()(propClassNames.content, contextClassNames.content),
      wrapper: classnames__WEBPACK_IMPORTED_MODULE_1___default()(propClassNames.wrapper, contextClassNames.wrapper)
    },
    styles: {
      mask: Object.assign(Object.assign(Object.assign({}, propStyles.mask), maskStyle), contextStyles.mask),
      content: Object.assign(Object.assign(Object.assign({}, propStyles.content), drawerStyle), contextStyles.content),
      wrapper: Object.assign(Object.assign(Object.assign({}, propStyles.wrapper), contentWrapperStyle), contextStyles.wrapper)
    },
    open: open !== null && open !== void 0 ? open : visible,
    mask: mask,
    push: push,
    width: mergedWidth,
    height: mergedHeight,
    style: Object.assign(Object.assign({}, drawer === null || drawer === void 0 ? void 0 : drawer.style), style),
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(drawer === null || drawer === void 0 ? void 0 : drawer.className, className),
    rootClassName: drawerClassName,
    getContainer: getContainer,
    afterOpenChange: afterOpenChange !== null && afterOpenChange !== void 0 ? afterOpenChange : afterVisibleChange,
    panelRef: panelRef,
    zIndex: zIndex
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_DrawerPanel__WEBPACK_IMPORTED_MODULE_11__["default"], Object.assign({
    prefixCls: prefixCls
  }, rest, {
    onClose: onClose
  }))))));
};
/** @private Internal Component. Do not use in your production. */
const PurePanel = props => {
  const {
      prefixCls: customizePrefixCls,
      style,
      className,
      placement = 'right'
    } = props,
    restProps = __rest(props, ["prefixCls", "style", "className", "placement"]);
  const {
    getPrefixCls
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(_config_provider__WEBPACK_IMPORTED_MODULE_3__.ConfigContext);
  const prefixCls = getPrefixCls('drawer', customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = (0,_style__WEBPACK_IMPORTED_MODULE_4__["default"])(prefixCls);
  const cls = classnames__WEBPACK_IMPORTED_MODULE_1___default()(prefixCls, `${prefixCls}-pure`, `${prefixCls}-${placement}`, hashId, cssVarCls, className);
  return wrapCSSVar(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: cls,
    style: style
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_DrawerPanel__WEBPACK_IMPORTED_MODULE_11__["default"], Object.assign({
    prefixCls: prefixCls
  }, restProps))));
};
Drawer._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
if (true) {
  Drawer.displayName = 'Drawer';
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Drawer);

/***/ }),

/***/ "./node_modules/antd/es/drawer/style/index.js":
/*!****************************************************!*\
  !*** ./node_modules/antd/es/drawer/style/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   prepareComponentToken: () => (/* binding */ prepareComponentToken)
/* harmony export */ });
/* harmony import */ var _ant_design_cssinjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ant-design/cssinjs */ "./node_modules/@ant-design/cssinjs/es/index.js");
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../style */ "./node_modules/antd/es/style/index.js");
/* harmony import */ var _theme_internal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../theme/internal */ "./node_modules/antd/es/theme/util/genStyleUtils.js");
/* harmony import */ var _theme_internal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../theme/internal */ "./node_modules/@ant-design/cssinjs-utils/es/index.js");
/* harmony import */ var _motion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./motion */ "./node_modules/antd/es/drawer/style/motion.js");




// =============================== Base ===============================
const genDrawerStyle = token => {
  const {
    borderRadiusSM,
    componentCls,
    zIndexPopup,
    colorBgMask,
    colorBgElevated,
    motionDurationSlow,
    motionDurationMid,
    paddingXS,
    padding,
    paddingLG,
    fontSizeLG,
    lineHeightLG,
    lineWidth,
    lineType,
    colorSplit,
    marginXS,
    colorIcon,
    colorIconHover,
    colorBgTextHover,
    colorBgTextActive,
    colorText,
    fontWeightStrong,
    footerPaddingBlock,
    footerPaddingInline,
    calc
  } = token;
  const wrapperCls = `${componentCls}-content-wrapper`;
  return {
    [componentCls]: {
      position: 'fixed',
      inset: 0,
      zIndex: zIndexPopup,
      pointerEvents: 'none',
      color: colorText,
      '&-pure': {
        position: 'relative',
        background: colorBgElevated,
        display: 'flex',
        flexDirection: 'column',
        [`&${componentCls}-left`]: {
          boxShadow: token.boxShadowDrawerLeft
        },
        [`&${componentCls}-right`]: {
          boxShadow: token.boxShadowDrawerRight
        },
        [`&${componentCls}-top`]: {
          boxShadow: token.boxShadowDrawerUp
        },
        [`&${componentCls}-bottom`]: {
          boxShadow: token.boxShadowDrawerDown
        }
      },
      '&-inline': {
        position: 'absolute'
      },
      // ====================== Mask ======================
      [`${componentCls}-mask`]: {
        position: 'absolute',
        inset: 0,
        zIndex: zIndexPopup,
        background: colorBgMask,
        pointerEvents: 'auto'
      },
      // ==================== Content =====================
      [wrapperCls]: {
        position: 'absolute',
        zIndex: zIndexPopup,
        maxWidth: '100vw',
        transition: `all ${motionDurationSlow}`,
        '&-hidden': {
          display: 'none'
        }
      },
      // Placement
      [`&-left > ${wrapperCls}`]: {
        top: 0,
        bottom: 0,
        left: {
          _skip_check_: true,
          value: 0
        },
        boxShadow: token.boxShadowDrawerLeft
      },
      [`&-right > ${wrapperCls}`]: {
        top: 0,
        right: {
          _skip_check_: true,
          value: 0
        },
        bottom: 0,
        boxShadow: token.boxShadowDrawerRight
      },
      [`&-top > ${wrapperCls}`]: {
        top: 0,
        insetInline: 0,
        boxShadow: token.boxShadowDrawerUp
      },
      [`&-bottom > ${wrapperCls}`]: {
        bottom: 0,
        insetInline: 0,
        boxShadow: token.boxShadowDrawerDown
      },
      [`${componentCls}-content`]: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        background: colorBgElevated,
        pointerEvents: 'auto'
      },
      // Header
      [`${componentCls}-header`]: {
        display: 'flex',
        flex: 0,
        alignItems: 'center',
        padding: `${(0,_ant_design_cssinjs__WEBPACK_IMPORTED_MODULE_0__.unit)(padding)} ${(0,_ant_design_cssinjs__WEBPACK_IMPORTED_MODULE_0__.unit)(paddingLG)}`,
        fontSize: fontSizeLG,
        lineHeight: lineHeightLG,
        borderBottom: `${(0,_ant_design_cssinjs__WEBPACK_IMPORTED_MODULE_0__.unit)(lineWidth)} ${lineType} ${colorSplit}`,
        '&-title': {
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          minWidth: 0,
          minHeight: 0
        }
      },
      [`${componentCls}-extra`]: {
        flex: 'none'
      },
      [`${componentCls}-close`]: Object.assign({
        display: 'inline-flex',
        width: calc(fontSizeLG).add(paddingXS).equal(),
        height: calc(fontSizeLG).add(paddingXS).equal(),
        borderRadius: borderRadiusSM,
        justifyContent: 'center',
        alignItems: 'center',
        marginInlineEnd: marginXS,
        color: colorIcon,
        fontWeight: fontWeightStrong,
        fontSize: fontSizeLG,
        fontStyle: 'normal',
        lineHeight: 1,
        textAlign: 'center',
        textTransform: 'none',
        textDecoration: 'none',
        background: 'transparent',
        border: 0,
        cursor: 'pointer',
        transition: `all ${motionDurationMid}`,
        textRendering: 'auto',
        '&:hover': {
          color: colorIconHover,
          backgroundColor: colorBgTextHover,
          textDecoration: 'none'
        },
        '&:active': {
          backgroundColor: colorBgTextActive
        }
      }, (0,_style__WEBPACK_IMPORTED_MODULE_1__.genFocusStyle)(token)),
      [`${componentCls}-title`]: {
        flex: 1,
        margin: 0,
        fontWeight: token.fontWeightStrong,
        fontSize: fontSizeLG,
        lineHeight: lineHeightLG
      },
      // Body
      [`${componentCls}-body`]: {
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        padding: paddingLG,
        overflow: 'auto',
        [`${componentCls}-body-skeleton`]: {
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center'
        }
      },
      // Footer
      [`${componentCls}-footer`]: {
        flexShrink: 0,
        padding: `${(0,_ant_design_cssinjs__WEBPACK_IMPORTED_MODULE_0__.unit)(footerPaddingBlock)} ${(0,_ant_design_cssinjs__WEBPACK_IMPORTED_MODULE_0__.unit)(footerPaddingInline)}`,
        borderTop: `${(0,_ant_design_cssinjs__WEBPACK_IMPORTED_MODULE_0__.unit)(lineWidth)} ${lineType} ${colorSplit}`
      },
      // ====================== RTL =======================
      '&-rtl': {
        direction: 'rtl'
      }
    }
  };
};
const prepareComponentToken = token => ({
  zIndexPopup: token.zIndexPopupBase,
  footerPaddingBlock: token.paddingXS,
  footerPaddingInline: token.padding
});
// ============================== Export ==============================
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_theme_internal__WEBPACK_IMPORTED_MODULE_2__.genStyleHooks)('Drawer', token => {
  const drawerToken = (0,_theme_internal__WEBPACK_IMPORTED_MODULE_3__.mergeToken)(token, {});
  return [genDrawerStyle(drawerToken), (0,_motion__WEBPACK_IMPORTED_MODULE_4__["default"])(drawerToken)];
}, prepareComponentToken));

/***/ }),

/***/ "./node_modules/antd/es/drawer/style/motion.js":
/*!*****************************************************!*\
  !*** ./node_modules/antd/es/drawer/style/motion.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const getMoveTranslate = direction => {
  const value = '100%';
  return {
    left: `translateX(-${value})`,
    right: `translateX(${value})`,
    top: `translateY(-${value})`,
    bottom: `translateY(${value})`
  }[direction];
};
const getEnterLeaveStyle = (startStyle, endStyle) => ({
  '&-enter, &-appear': Object.assign(Object.assign({}, startStyle), {
    '&-active': endStyle
  }),
  '&-leave': Object.assign(Object.assign({}, endStyle), {
    '&-active': startStyle
  })
});
const getFadeStyle = (from, duration) => Object.assign({
  '&-enter, &-appear, &-leave': {
    '&-start': {
      transition: 'none'
    },
    '&-active': {
      transition: `all ${duration}`
    }
  }
}, getEnterLeaveStyle({
  opacity: from
}, {
  opacity: 1
}));
const getPanelMotionStyles = (direction, duration) => [getFadeStyle(0.7, duration), getEnterLeaveStyle({
  transform: getMoveTranslate(direction)
}, {
  transform: 'none'
})];
const genMotionStyle = token => {
  const {
    componentCls,
    motionDurationSlow
  } = token;
  return {
    [componentCls]: {
      // ======================== Mask ========================
      [`${componentCls}-mask-motion`]: getFadeStyle(0, motionDurationSlow),
      // ======================= Panel ========================
      [`${componentCls}-panel-motion`]: ['left', 'right', 'top', 'bottom'].reduce((obj, direction) => Object.assign(Object.assign({}, obj), {
        [`&-${direction}`]: getPanelMotionStyles(direction, motionDurationSlow)
      }), {})
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (genMotionStyle);

/***/ }),

/***/ "./resources/js/components/public/dashboard/components/MobileSidebarToggle.js":
/*!************************************************************************************!*\
  !*** ./resources/js/components/public/dashboard/components/MobileSidebarToggle.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/button/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/drawer/index.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/MenuOutlined.js");
/* harmony import */ var _SideBar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SideBar */ "./resources/js/components/public/dashboard/components/SideBar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");



 // Import the Sidebar component

var MobileSidebarToggle = function MobileSidebarToggle(_ref) {
  var userRole = _ref.userRole,
    mobileSidebarVisible = _ref.mobileSidebarVisible,
    toggleMobileSidebar = _ref.toggleMobileSidebar;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(antd__WEBPACK_IMPORTED_MODULE_3__["default"], {
      className: "menu-icon",
      icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_ant_design_icons__WEBPACK_IMPORTED_MODULE_4__["default"], {}),
      onClick: toggleMobileSidebar,
      style: {
        display: 'none',
        // Hide by default
        position: 'absolute',
        // Position the button on the top-left
        top: '20px',
        // Set top margin for the button
        left: '20px',
        // Set left margin for the button
        zIndex: 1000 // Ensure the button is on top
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(antd__WEBPACK_IMPORTED_MODULE_5__["default"], {
      placement: "left",
      closable: false,
      onClose: toggleMobileSidebar,
      visible: mobileSidebarVisible,
      width: 250,
      style: {
        zIndex: 1000 // Ensure it's on top of other content
      },
      bodyStyle: {
        padding: 0,
        // Remove any padding inside the body
        height: '100vh' // Make the drawer fill the entire height of the screen
      },
      wrapperStyle: {
        height: '100vh' // Make the drawer wrapper take full height
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_SideBar__WEBPACK_IMPORTED_MODULE_1__["default"], {
        userRole: userRole
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MobileSidebarToggle);

/***/ }),

/***/ "./node_modules/rc-drawer/es/Drawer.js":
/*!*********************************************!*\
  !*** ./node_modules/rc-drawer/es/Drawer.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _rc_component_portal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @rc-component/portal */ "./node_modules/@rc-component/portal/es/index.js");
/* harmony import */ var rc_util_es_hooks_useLayoutEffect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rc-util/es/hooks/useLayoutEffect */ "./node_modules/rc-util/es/hooks/useLayoutEffect.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./context */ "./node_modules/rc-drawer/es/context.js");
/* harmony import */ var _DrawerPopup__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DrawerPopup */ "./node_modules/rc-drawer/es/DrawerPopup.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util */ "./node_modules/rc-drawer/es/util.js");








var Drawer = function Drawer(props) {
  var _props$open = props.open,
    open = _props$open === void 0 ? false : _props$open,
    _props$prefixCls = props.prefixCls,
    prefixCls = _props$prefixCls === void 0 ? 'rc-drawer' : _props$prefixCls,
    _props$placement = props.placement,
    placement = _props$placement === void 0 ? 'right' : _props$placement,
    _props$autoFocus = props.autoFocus,
    autoFocus = _props$autoFocus === void 0 ? true : _props$autoFocus,
    _props$keyboard = props.keyboard,
    keyboard = _props$keyboard === void 0 ? true : _props$keyboard,
    _props$width = props.width,
    width = _props$width === void 0 ? 378 : _props$width,
    _props$mask = props.mask,
    mask = _props$mask === void 0 ? true : _props$mask,
    _props$maskClosable = props.maskClosable,
    maskClosable = _props$maskClosable === void 0 ? true : _props$maskClosable,
    getContainer = props.getContainer,
    forceRender = props.forceRender,
    afterOpenChange = props.afterOpenChange,
    destroyOnClose = props.destroyOnClose,
    onMouseEnter = props.onMouseEnter,
    onMouseOver = props.onMouseOver,
    onMouseLeave = props.onMouseLeave,
    onClick = props.onClick,
    onKeyDown = props.onKeyDown,
    onKeyUp = props.onKeyUp,
    panelRef = props.panelRef;
  var _React$useState = react__WEBPACK_IMPORTED_MODULE_4__.useState(false),
    _React$useState2 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_React$useState, 2),
    animatedVisible = _React$useState2[0],
    setAnimatedVisible = _React$useState2[1];

  // ============================= Warn =============================
  if (true) {
    (0,_util__WEBPACK_IMPORTED_MODULE_7__.warnCheck)(props);
  }

  // ============================= Open =============================
  var _React$useState3 = react__WEBPACK_IMPORTED_MODULE_4__.useState(false),
    _React$useState4 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_React$useState3, 2),
    mounted = _React$useState4[0],
    setMounted = _React$useState4[1];
  (0,rc_util_es_hooks_useLayoutEffect__WEBPACK_IMPORTED_MODULE_3__["default"])(function () {
    setMounted(true);
  }, []);
  var mergedOpen = mounted ? open : false;

  // ============================ Focus =============================
  var popupRef = react__WEBPACK_IMPORTED_MODULE_4__.useRef();
  var lastActiveRef = react__WEBPACK_IMPORTED_MODULE_4__.useRef();
  (0,rc_util_es_hooks_useLayoutEffect__WEBPACK_IMPORTED_MODULE_3__["default"])(function () {
    if (mergedOpen) {
      lastActiveRef.current = document.activeElement;
    }
  }, [mergedOpen]);

  // ============================= Open =============================
  var internalAfterOpenChange = function internalAfterOpenChange(nextVisible) {
    var _popupRef$current;
    setAnimatedVisible(nextVisible);
    afterOpenChange === null || afterOpenChange === void 0 || afterOpenChange(nextVisible);
    if (!nextVisible && lastActiveRef.current && !((_popupRef$current = popupRef.current) !== null && _popupRef$current !== void 0 && _popupRef$current.contains(lastActiveRef.current))) {
      var _lastActiveRef$curren;
      (_lastActiveRef$curren = lastActiveRef.current) === null || _lastActiveRef$curren === void 0 || _lastActiveRef$curren.focus({
        preventScroll: true
      });
    }
  };

  // =========================== Context ============================
  var refContext = react__WEBPACK_IMPORTED_MODULE_4__.useMemo(function () {
    return {
      panel: panelRef
    };
  }, [panelRef]);

  // ============================ Render ============================
  if (!forceRender && !animatedVisible && !mergedOpen && destroyOnClose) {
    return null;
  }
  var eventHandlers = {
    onMouseEnter: onMouseEnter,
    onMouseOver: onMouseOver,
    onMouseLeave: onMouseLeave,
    onClick: onClick,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp
  };
  var drawerPopupProps = (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props), {}, {
    open: mergedOpen,
    prefixCls: prefixCls,
    placement: placement,
    autoFocus: autoFocus,
    keyboard: keyboard,
    width: width,
    mask: mask,
    maskClosable: maskClosable,
    inline: getContainer === false,
    afterOpenChange: internalAfterOpenChange,
    ref: popupRef
  }, eventHandlers);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(_context__WEBPACK_IMPORTED_MODULE_5__.RefContext.Provider, {
    value: refContext
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(_rc_component_portal__WEBPACK_IMPORTED_MODULE_2__["default"], {
    open: mergedOpen || forceRender || animatedVisible,
    autoDestroy: false,
    getContainer: getContainer,
    autoLock: mask && (mergedOpen || animatedVisible)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4__.createElement(_DrawerPopup__WEBPACK_IMPORTED_MODULE_6__["default"], drawerPopupProps)));
};
if (true) {
  Drawer.displayName = 'Drawer';
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Drawer);

/***/ }),

/***/ "./node_modules/rc-drawer/es/DrawerPanel.js":
/*!**************************************************!*\
  !*** ./node_modules/rc-drawer/es/DrawerPanel.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./context */ "./node_modules/rc-drawer/es/context.js");
/* harmony import */ var rc_util_es_pickAttrs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rc-util/es/pickAttrs */ "./node_modules/rc-util/es/pickAttrs.js");
/* harmony import */ var rc_util_es_ref__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rc-util/es/ref */ "./node_modules/rc-util/es/ref.js");


var _excluded = ["prefixCls", "className", "containerRef"];





var DrawerPanel = function DrawerPanel(props) {
  var prefixCls = props.prefixCls,
    className = props.className,
    containerRef = props.containerRef,
    restProps = (0,_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(props, _excluded);
  var _React$useContext = react__WEBPACK_IMPORTED_MODULE_3__.useContext(_context__WEBPACK_IMPORTED_MODULE_4__.RefContext),
    panelRef = _React$useContext.panel;
  var mergedRef = (0,rc_util_es_ref__WEBPACK_IMPORTED_MODULE_6__.useComposeRef)(panelRef, containerRef);

  // =============================== Render ===============================

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("".concat(prefixCls, "-content"), className),
    role: "dialog",
    ref: mergedRef
  }, (0,rc_util_es_pickAttrs__WEBPACK_IMPORTED_MODULE_5__["default"])(props, {
    aria: true
  }), {
    "aria-modal": "true"
  }, restProps));
};
if (true) {
  DrawerPanel.displayName = 'DrawerPanel';
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DrawerPanel);

/***/ }),

/***/ "./node_modules/rc-drawer/es/DrawerPopup.js":
/*!**************************************************!*\
  !*** ./node_modules/rc-drawer/es/DrawerPopup.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var rc_motion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rc-motion */ "./node_modules/rc-motion/es/index.js");
/* harmony import */ var rc_util_es_KeyCode__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rc-util/es/KeyCode */ "./node_modules/rc-util/es/KeyCode.js");
/* harmony import */ var rc_util_es_pickAttrs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rc-util/es/pickAttrs */ "./node_modules/rc-util/es/pickAttrs.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./context */ "./node_modules/rc-drawer/es/context.js");
/* harmony import */ var _DrawerPanel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./DrawerPanel */ "./node_modules/rc-drawer/es/DrawerPanel.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./util */ "./node_modules/rc-drawer/es/util.js");












var sentinelStyle = {
  width: 0,
  height: 0,
  overflow: 'hidden',
  outline: 'none',
  position: 'absolute'
};
function DrawerPopup(props, ref) {
  var _ref, _pushConfig$distance, _pushConfig;
  var prefixCls = props.prefixCls,
    open = props.open,
    placement = props.placement,
    inline = props.inline,
    push = props.push,
    forceRender = props.forceRender,
    autoFocus = props.autoFocus,
    keyboard = props.keyboard,
    drawerClassNames = props.classNames,
    rootClassName = props.rootClassName,
    rootStyle = props.rootStyle,
    zIndex = props.zIndex,
    className = props.className,
    id = props.id,
    style = props.style,
    motion = props.motion,
    width = props.width,
    height = props.height,
    children = props.children,
    mask = props.mask,
    maskClosable = props.maskClosable,
    maskMotion = props.maskMotion,
    maskClassName = props.maskClassName,
    maskStyle = props.maskStyle,
    afterOpenChange = props.afterOpenChange,
    onClose = props.onClose,
    onMouseEnter = props.onMouseEnter,
    onMouseOver = props.onMouseOver,
    onMouseLeave = props.onMouseLeave,
    onClick = props.onClick,
    onKeyDown = props.onKeyDown,
    onKeyUp = props.onKeyUp,
    styles = props.styles,
    drawerRender = props.drawerRender;

  // ================================ Refs ================================
  var panelRef = react__WEBPACK_IMPORTED_MODULE_8__.useRef();
  var sentinelStartRef = react__WEBPACK_IMPORTED_MODULE_8__.useRef();
  var sentinelEndRef = react__WEBPACK_IMPORTED_MODULE_8__.useRef();
  react__WEBPACK_IMPORTED_MODULE_8__.useImperativeHandle(ref, function () {
    return panelRef.current;
  });
  var onPanelKeyDown = function onPanelKeyDown(event) {
    var keyCode = event.keyCode,
      shiftKey = event.shiftKey;
    switch (keyCode) {
      // Tab active
      case rc_util_es_KeyCode__WEBPACK_IMPORTED_MODULE_6__["default"].TAB:
        {
          if (keyCode === rc_util_es_KeyCode__WEBPACK_IMPORTED_MODULE_6__["default"].TAB) {
            if (!shiftKey && document.activeElement === sentinelEndRef.current) {
              var _sentinelStartRef$cur;
              (_sentinelStartRef$cur = sentinelStartRef.current) === null || _sentinelStartRef$cur === void 0 || _sentinelStartRef$cur.focus({
                preventScroll: true
              });
            } else if (shiftKey && document.activeElement === sentinelStartRef.current) {
              var _sentinelEndRef$curre;
              (_sentinelEndRef$curre = sentinelEndRef.current) === null || _sentinelEndRef$curre === void 0 || _sentinelEndRef$curre.focus({
                preventScroll: true
              });
            }
          }
          break;
        }

      // Close
      case rc_util_es_KeyCode__WEBPACK_IMPORTED_MODULE_6__["default"].ESC:
        {
          if (onClose && keyboard) {
            event.stopPropagation();
            onClose(event);
          }
          break;
        }
    }
  };

  // ========================== Control ===========================
  // Auto Focus
  react__WEBPACK_IMPORTED_MODULE_8__.useEffect(function () {
    if (open && autoFocus) {
      var _panelRef$current;
      (_panelRef$current = panelRef.current) === null || _panelRef$current === void 0 || _panelRef$current.focus({
        preventScroll: true
      });
    }
  }, [open]);

  // ============================ Push ============================
  var _React$useState = react__WEBPACK_IMPORTED_MODULE_8__.useState(false),
    _React$useState2 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_React$useState, 2),
    pushed = _React$useState2[0],
    setPushed = _React$useState2[1];
  var parentContext = react__WEBPACK_IMPORTED_MODULE_8__.useContext(_context__WEBPACK_IMPORTED_MODULE_9__["default"]);

  // Merge push distance
  var pushConfig;
  if (typeof push === 'boolean') {
    pushConfig = push ? {} : {
      distance: 0
    };
  } else {
    pushConfig = push || {};
  }
  var pushDistance = (_ref = (_pushConfig$distance = (_pushConfig = pushConfig) === null || _pushConfig === void 0 ? void 0 : _pushConfig.distance) !== null && _pushConfig$distance !== void 0 ? _pushConfig$distance : parentContext === null || parentContext === void 0 ? void 0 : parentContext.pushDistance) !== null && _ref !== void 0 ? _ref : 180;
  var mergedContext = react__WEBPACK_IMPORTED_MODULE_8__.useMemo(function () {
    return {
      pushDistance: pushDistance,
      push: function push() {
        setPushed(true);
      },
      pull: function pull() {
        setPushed(false);
      }
    };
  }, [pushDistance]);

  // ========================= ScrollLock =========================
  // Tell parent to push
  react__WEBPACK_IMPORTED_MODULE_8__.useEffect(function () {
    if (open) {
      var _parentContext$push;
      parentContext === null || parentContext === void 0 || (_parentContext$push = parentContext.push) === null || _parentContext$push === void 0 || _parentContext$push.call(parentContext);
    } else {
      var _parentContext$pull;
      parentContext === null || parentContext === void 0 || (_parentContext$pull = parentContext.pull) === null || _parentContext$pull === void 0 || _parentContext$pull.call(parentContext);
    }
  }, [open]);

  // Clean up
  react__WEBPACK_IMPORTED_MODULE_8__.useEffect(function () {
    return function () {
      var _parentContext$pull2;
      parentContext === null || parentContext === void 0 || (_parentContext$pull2 = parentContext.pull) === null || _parentContext$pull2 === void 0 || _parentContext$pull2.call(parentContext);
    };
  }, []);

  // ============================ Mask ============================
  var maskNode = mask && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(rc_motion__WEBPACK_IMPORTED_MODULE_5__["default"], (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    key: "mask"
  }, maskMotion, {
    visible: open
  }), function (_ref2, maskRef) {
    var motionMaskClassName = _ref2.className,
      motionMaskStyle = _ref2.style;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
      className: classnames__WEBPACK_IMPORTED_MODULE_4___default()("".concat(prefixCls, "-mask"), motionMaskClassName, drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.mask, maskClassName),
      style: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__["default"])({}, motionMaskStyle), maskStyle), styles === null || styles === void 0 ? void 0 : styles.mask),
      onClick: maskClosable && open ? onClose : undefined,
      ref: maskRef
    });
  });

  // =========================== Panel ============================
  var motionProps = typeof motion === 'function' ? motion(placement) : motion;
  var wrapperStyle = {};
  if (pushed && pushDistance) {
    switch (placement) {
      case 'top':
        wrapperStyle.transform = "translateY(".concat(pushDistance, "px)");
        break;
      case 'bottom':
        wrapperStyle.transform = "translateY(".concat(-pushDistance, "px)");
        break;
      case 'left':
        wrapperStyle.transform = "translateX(".concat(pushDistance, "px)");
        break;
      default:
        wrapperStyle.transform = "translateX(".concat(-pushDistance, "px)");
        break;
    }
  }
  if (placement === 'left' || placement === 'right') {
    wrapperStyle.width = (0,_util__WEBPACK_IMPORTED_MODULE_11__.parseWidthHeight)(width);
  } else {
    wrapperStyle.height = (0,_util__WEBPACK_IMPORTED_MODULE_11__.parseWidthHeight)(height);
  }
  var eventHandlers = {
    onMouseEnter: onMouseEnter,
    onMouseOver: onMouseOver,
    onMouseLeave: onMouseLeave,
    onClick: onClick,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp
  };
  var panelNode = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(rc_motion__WEBPACK_IMPORTED_MODULE_5__["default"], (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
    key: "panel"
  }, motionProps, {
    visible: open,
    forceRender: forceRender,
    onVisibleChanged: function onVisibleChanged(nextVisible) {
      afterOpenChange === null || afterOpenChange === void 0 || afterOpenChange(nextVisible);
    },
    removeOnLeave: false,
    leavedClassName: "".concat(prefixCls, "-content-wrapper-hidden")
  }), function (_ref3, motionRef) {
    var motionClassName = _ref3.className,
      motionStyle = _ref3.style;
    var content = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_DrawerPanel__WEBPACK_IMPORTED_MODULE_10__["default"], (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
      id: id,
      containerRef: motionRef,
      prefixCls: prefixCls,
      className: classnames__WEBPACK_IMPORTED_MODULE_4___default()(className, drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.content),
      style: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__["default"])({}, style), styles === null || styles === void 0 ? void 0 : styles.content)
    }, (0,rc_util_es_pickAttrs__WEBPACK_IMPORTED_MODULE_7__["default"])(props, {
      aria: true
    }), eventHandlers), children);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_1__["default"])({
      className: classnames__WEBPACK_IMPORTED_MODULE_4___default()("".concat(prefixCls, "-content-wrapper"), drawerClassNames === null || drawerClassNames === void 0 ? void 0 : drawerClassNames.wrapper, motionClassName),
      style: (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__["default"])({}, wrapperStyle), motionStyle), styles === null || styles === void 0 ? void 0 : styles.wrapper)
    }, (0,rc_util_es_pickAttrs__WEBPACK_IMPORTED_MODULE_7__["default"])(props, {
      data: true
    })), drawerRender ? drawerRender(content) : content);
  });

  // =========================== Render ===========================
  var containerStyle = (0,_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__["default"])({}, rootStyle);
  if (zIndex) {
    containerStyle.zIndex = zIndex;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement(_context__WEBPACK_IMPORTED_MODULE_9__["default"].Provider, {
    value: mergedContext
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_4___default()(prefixCls, "".concat(prefixCls, "-").concat(placement), rootClassName, (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({}, "".concat(prefixCls, "-open"), open), "".concat(prefixCls, "-inline"), inline)),
    style: containerStyle,
    tabIndex: -1,
    ref: panelRef,
    onKeyDown: onPanelKeyDown
  }, maskNode, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
    tabIndex: 0,
    ref: sentinelStartRef,
    style: sentinelStyle,
    "aria-hidden": "true",
    "data-sentinel": "start"
  }), panelNode, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.createElement("div", {
    tabIndex: 0,
    ref: sentinelEndRef,
    style: sentinelStyle,
    "aria-hidden": "true",
    "data-sentinel": "end"
  })));
}
var RefDrawerPopup = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_8__.forwardRef(DrawerPopup);
if (true) {
  RefDrawerPopup.displayName = 'DrawerPopup';
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RefDrawerPopup);

/***/ }),

/***/ "./node_modules/rc-drawer/es/context.js":
/*!**********************************************!*\
  !*** ./node_modules/rc-drawer/es/context.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RefContext: () => (/* binding */ RefContext),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var DrawerContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
var RefContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext({});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DrawerContext);

/***/ }),

/***/ "./node_modules/rc-drawer/es/index.js":
/*!********************************************!*\
  !*** ./node_modules/rc-drawer/es/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Drawer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Drawer */ "./node_modules/rc-drawer/es/Drawer.js");
// export this package's api

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_Drawer__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./node_modules/rc-drawer/es/util.js":
/*!*******************************************!*\
  !*** ./node_modules/rc-drawer/es/util.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseWidthHeight: () => (/* binding */ parseWidthHeight),
/* harmony export */   warnCheck: () => (/* binding */ warnCheck)
/* harmony export */ });
/* harmony import */ var rc_util_es_warning__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rc-util/es/warning */ "./node_modules/rc-util/es/warning.js");
/* harmony import */ var rc_util_es_Dom_canUseDom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rc-util/es/Dom/canUseDom */ "./node_modules/rc-util/es/Dom/canUseDom.js");


function parseWidthHeight(value) {
  if (typeof value === 'string' && String(Number(value)) === value) {
    (0,rc_util_es_warning__WEBPACK_IMPORTED_MODULE_0__["default"])(false, 'Invalid value type of `width` or `height` which should be number type instead.');
    return Number(value);
  }
  return value;
}
function warnCheck(props) {
  (0,rc_util_es_warning__WEBPACK_IMPORTED_MODULE_0__["default"])(!('wrapperClassName' in props), "'wrapperClassName' is removed. Please use 'rootClassName' instead.");
  (0,rc_util_es_warning__WEBPACK_IMPORTED_MODULE_0__["default"])((0,rc_util_es_Dom_canUseDom__WEBPACK_IMPORTED_MODULE_1__["default"])() || !props.open, "Drawer with 'open' in SSR is not work since no place to createPortal. Please move to 'useEffect' instead.");
}

/***/ })

}]);