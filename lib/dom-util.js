var renew;

if (typeof window !== 'undefined') {
  exports.normalizeDomElement = function(domElement) {
    if (typeof domElement === 'string') {
      domElement = document.querySelector(domElement);
    }
    return domElement;
  };
}

exports.getBindProp = function(component) {
  var tagName;
  tagName = component.tagName;
  if (!tagName) {
    throw new Error('trying to bind a Component which is not a Tag');
  } else if (tagName === 'textarea' || tagName === 'select') {
    return 'value';
  } else if (component.props.type === 'checkbox') {
    return 'checked';
  } else {
    return 'value';
  }
};

if (typeof window !== 'undefined') {
  if (document.addEventListener) {
    exports.addEventListener = function(node, name, handler) {
      node.addEventListener(name, handler, false);
    };
    exports.removeEventListener = function(node, name, handler) {
      node.removeEventListener(name, handler);
    };
  } else {
    exports.addEventListener = function(node, name, handler) {
      node.attachEvent(name, handler);
    };
    exports.removeEventListener = function(node, name, handler) {
      node.detachEvent(name, handler);
    };
  }
  exports.isElement = function(item) {
    if (typeof HTMLElement === "object") {
      return item instanceof HTMLElement;
    } else {
      return item && typeof item === "object" && item !== null && item.nodeType === 1 && typeof item.nodeName === "string";
    }
  };
}

renew = require('lazy-flow').renew;

exports.domField = function(value) {
  var fn;
  if (value == null) {
    return '';
  }
  if (typeof value !== 'function') {
    if (value.then && value["catch"]) {
      fn = react(function() {
        return fn.promiseResult;
      });
      value.then(function(result) {
        fn.promiseResult = result;
        return fn.invalidate();
      })["catch"](function(error) {
        fn.promiseResult = error;
        return fn.invalidate();
      });
      return fn;
    } else {
      return value;
    }
  }
  if (!value.invalidate) {
    return renew(value);
  }
  return value;
};

exports.domValue = function(value) {
  if (value == null) {
    return '';
  } else if (typeof value !== 'function') {
    return value;
  } else {
    value = value();
    if (value == null) {
      return '';
    } else {
      return value;
    }
  }
};

exports.extendChildFamily = function(family, child) {
  var dcid;
  for (dcid in child.family) {
    if (family[dcid]) {
      throw new Error('do not allow to have the same component to be referenced in different location of one List');
    }
    family[dcid] = true;
  }
};
