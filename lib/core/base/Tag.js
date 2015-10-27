var BaseComponent, List, Tag, Text, attrToPropName, classFn, cloneObject, dc, directiveRegistry, domValue, eventHandlerFromArray, extend, flow, funcString, newLine, styleFrom, toComponent, updating, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

extend = require('../../extend');

dc = require('../../dc');

_ref = require('../property'), classFn = _ref.classFn, styleFrom = _ref.styleFrom, eventHandlerFromArray = _ref.eventHandlerFromArray, attrToPropName = _ref.attrToPropName, updating = _ref.updating;

BaseComponent = require('./BaseComponent');

Text = require('./Text');

List = require('./List');

_ref1 = require('../../util'), funcString = _ref1.funcString, newLine = _ref1.newLine, cloneObject = _ref1.cloneObject;

directiveRegistry = require('../../config').directiveRegistry;

flow = require('../../flow').flow;

domValue = require('../../dom-util').domValue;

toComponent = require('./toComponent');

module.exports = Tag = (function(_super) {
  __extends(Tag, _super);

  function Tag(tagName, attrs, children) {
    if (attrs == null) {
      attrs = {};
    }
    Tag.__super__.constructor.call(this, children);
    delete this.isList;
    this.isTag = true;
    this.tagName = tagName = tagName.toLowerCase();
    this.namespace = attrs.namespace;
    if (!this.namespace) {
      if (tagName === 'svg') {
        this.namespace = "http://www.w3.org/2000/svg";
      } else if (tagName === 'math') {
        this.namespace = "http://www.w3.org/1998/Math/MathML";
      }
    }
    this.attrs = attrs;
    this.processAttrs();
    return;
  }

  Tag.prototype.processAttrs = function() {
    var attrStyle, attrs, className, directive, directives, events, generator, handler, key, me, props, style, value, _i, _len;
    me = this;
    this.hasActiveProperties = false;
    attrs = this.attrs;
    this.cacheClassName = "";
    this.className = className = classFn(attrs.className, attrs["class"]);
    delete attrs.className;
    delete attrs['class'];
    if (!className.valid) {
      this.hasActiveProperties = true;
    }
    className.onInvalidate(function() {
      if (className.valid) {
        me.hasActiveProperties = true;
        return me.invalidate();
      }
    });
    this.hasActiveProps = false;
    this.cacheProps = {};
    this.props = props = {};
    this['invalidateProps'] = {};
    this.hasActiveStyle = false;
    this.cacheStyle = {};
    this.style = style = {};
    this['invalidateStyle'] = {};
    attrStyle = styleFrom(attrs.style);
    for (key in attrStyle) {
      value = attrStyle[key];
      this.setProp(key, value, style, 'Style');
    }
    delete attrs.style;
    this.hasActiveEvents = false;
    this.cacheEvents = {};
    this.events = events = {};
    this.eventUpdateConfig = {};
    directives = [];
    for (key in attrs) {
      value = attrs[key];
      if (key.slice(0, 2) === 'on') {
        if (typeof value === 'function') {
          events[key] = [value];
        } else {
          events[key] = value;
        }
        this.hasActiveEvents = true;
        this.hasActiveProperties = true;
      } else if (key[0] === '$') {
        generator = directiveRegistry[key];
        if (value instanceof Array) {
          handler = generator.apply(null, value);
        } else {
          handler = generator.apply(null, [value]);
        }
        directives.push(handler);
      } else {
        this.setProp(key, value, props, 'Props');
      }
    }
    for (_i = 0, _len = directives.length; _i < _len; _i++) {
      directive = directives[_i];
      directive(this);
    }
  };

  Tag.prototype.prop = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._prop(args, this.props, 'Props');
  };

  Tag.prototype.css = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._prop(args, this.style, 'Style');
  };

  Tag.prototype._prop = function(args, props, type) {
    var key, prop, v;
    if (args.length === 0) {
      return props;
    }
    if (args.length === 1) {
      prop = args[0];
      if (typeof prop === 'string') {
        return props[prop];
      }
      for (key in prop) {
        v = prop[key];
        this.setProp(key, v, props, type);
      }
    } else if (args.length === 2) {
      this.setProp(args[0], args[1], props, type);
    }
    return this;
  };

  Tag.prototype.setProp = function(prop, value, props, type) {
    var fn, me, oldValue;
    prop = attrToPropName(prop);
    value = domValue(value);
    oldValue = props[prop];
    if (oldValue == null) {
      if (typeof value === 'function') {
        this.addActivity(props, prop, type);
      } else if (value !== this['cache' + type][prop]) {
        this.addActivity(props, prop, type);
      }
    } else {
      if (typeof oldValue === 'function') {
        oldValue.offInvalidate(this['invalidate' + type][prop]);
      }
    }
    if (typeof value === 'function') {
      me = this;
      this['invalidate' + type][prop] = fn = function() {
        me.addActivity(props, prop, type, true);
        return props[prop] = value;
      };
      value.onInvalidate(fn);
    }
    props[prop] = value;
  };

  Tag.prototype.addActivity = function(props, prop, type) {
    this['hasActive' + type] = true;
    this.hasActiveProperties = true;
    if (!this.node) {
      return;
    }
    return this.invalidate();
  };

  Tag.prototype.bind = function(eventNames, handler, before) {
    var name, names, _i, _len;
    names = eventNames.split('\s+');
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      this._addEventProp(name, handler, before);
    }
    return this;
  };

  Tag.prototype._addEventProp = function(prop, handler, before) {
    var events;
    if (prop.slice(0, 2) !== 'on') {
      prop = 'on' + prop;
    }
    events = this.events;
    if (typeof handler === 'function') {
      handler = [handler];
    }
    if (!events[prop]) {
      this.addActivity(events, prop, 'Events');
      events[prop] = handler;
    } else {
      if (before) {
        events[prop] = handler.concat(events[prop]);
      } else {
        events[prop] = events[prop].concat(handler);
      }
    }
    return this;
  };

  Tag.prototype.unbind = function(eventNames, handler) {
    var name, names, _i, _len;
    names = eventNames.split('\s+');
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      this._removeEventHandlers(name, handler);
    }
    return this;
  };

  Tag.prototype._removeEventHandlers = function(eventName, handler) {
    var eventHandlers, events, index;
    if (!this.hasActiveEvents) {
      return this;
    }
    if (eventName.slice(0, 2) !== 'on') {
      eventName = 'on' + eventName;
    }
    events = this.events;
    eventHandlers = events[eventName];
    if (!eventHandlers) {
      return this;
    }
    index = eventHandlers.indexOf(handler);
    if (index >= 0) {
      eventHandlers.splice(index, 1);
    }
    if (!eventHandlers.length) {
      delete events[eventName];
    }
    return this;
  };

  Tag.prototype.addClass = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.className.extend(items);
    if (!this.className.valid) {
      this.hasActiveProperties = true;
      this.invalidate();
    }
    return this;
  };

  Tag.prototype.removeClass = function() {
    var items, _ref2;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    (_ref2 = this.className).removeClass.apply(_ref2, items);
    if (!this.className.valid) {
      this.hasActiveProperties = true;
      this.invalidate();
    }
    return this;
  };

  Tag.prototype.show = function(display) {
    if (typeof display === 'function') {
      display = display();
      if (display == null) {
        display = '';
      }
    }
    if (display == null) {
      this.setProp('display', 'block', this.style, 'Style');
    } else if (display === 'visible') {
      this.setProp('visibility', 'visible', this.style, 'Style');
    } else {
      this.setProp('display', display, this.style, 'Style');
    }
    this.update();
    return this;
  };

  Tag.prototype.hide = function(display) {
    if (typeof display === 'function') {
      display = display();
      if (display == null) {
        display = '';
      }
    }
    if (!display) {
      this.setProp('display', 'none', this.style, 'Style');
    } else if (display === 'hidden') {
      this.setProp('visibility', 'hidden', this.style, 'Style');
    } else {
      this.setProp('display', display, this.style, 'Style');
    }
    this.update();
    return this;
  };

  Tag.prototype.showHide = function(status, test, display) {
    var fn, me, method, oldDisplay, style;
    style = this.style;
    test = domValue(test);
    oldDisplay = style.display;
    if (!oldDisplay) {
      this.addActivity(style, 'display', 'Style', this.node);
    } else if (typeof oldDisplay === 'function' && oldDisplay.offInvalidate) {
      oldDisplay.offInvalidate(this.invalidateStyle.display);
    }
    style.display = method = flow(test, oldDisplay, function() {
      var d;
      if ((typeof test === 'function' ? !!test() : !!test) === status) {
        if (display) {
          if (typeof display === 'function') {
            return display();
          } else {
            return display;
          }
        } else if (oldDisplay != null) {
          if (typeof oldDisplay === 'function') {
            d = oldDisplay();
          } else {
            d = oldDisplay;
          }
          if (d !== 'none') {
            return d;
          } else {
            return 'block';
          }
        } else {
          return oldDisplay = 'block';
        }
      } else {
        return 'none';
      }
    });
    me = this;
    this.invalidateStyle.display = fn = function() {
      me.addActivity(style, 'display', 'Style', true);
      return style.display = method;
    };
    method.onInvalidate(fn);
    this.style = style;
    return this;
  };

  Tag.prototype.showOn = function(test, display) {
    return this.showHide(true, test, display);
  };

  Tag.prototype.hideOn = function(test, display) {
    return this.showHide(false, test, display);
  };

  Tag.prototype.createDom = function() {
    var child, children, length, node, _i, _len;
    this.node = node = this.namespace ? document.createElementNS(this.namespace, this.tagName) : document.createElement(this.tagName);
    this.hasActiveProperties && this.updateProperties();
    children = this.children;
    for (_i = 0, _len = children.length; _i < _len; _i++) {
      child = children[_i];
      child.parentNode = node;
    }
    if (length = children.length) {
      children[length - 1].nextNode = null;
    }
    this.childNodes = [];
    this.createChildrenDom();
    this.firstNode = node;
    return node;
  };

  Tag.prototype.updateDom = function() {
    var children, index, invalidIndexes, node, _i, _len;
    this.hasActiveProperties && this.updateProperties();
    children = this.children, node = this.node, invalidIndexes = this.invalidIndexes;
    for (_i = 0, _len = invalidIndexes.length; _i < _len; _i++) {
      index = invalidIndexes[_i];
      children[index].parentNode = node;
    }
    this.updateChildrenDom();
    return this.firstNode = this.node;
  };

  Tag.prototype.removeDom = function() {
    this.removeNode();
    this.emit('afterRemoveDom');
    return this;
  };

  Tag.prototype.attachNode = function() {
    var node;
    node = this.node;
    if (this.parentNode === node.parentNode) {
      return node;
    }
    this.parentNode.insertBefore(node, this.nextNode);
    return node;
  };

  Tag.prototype.removeNode = function() {
    return this.node.parentNode.removeChild(this.node);
  };

  Tag.prototype.updateProperties = function() {
    var cacheEvents, cacheProps, cacheStyle, callbackList, className, classValue, elementStyle, eventName, events, node, prop, props, style, value;
    this.hasActiveProperties = false;
    node = this.node, className = this.className;
    if (!className.valid) {
      classValue = className();
      if (classValue !== this.cacheClassName) {
        this.cacheClassName = node.className = classValue;
      }
    }
    if (this.hasActiveProps) {
      props = this.props, cacheProps = this.cacheProps;
      this.hasActiveProps = false;
      for (prop in props) {
        value = props[prop];
        delete props[prop];
        if (typeof value === 'function') {
          value = value();
        }
        if (value == null) {
          value = '';
        }
        cacheProps[prop] = node[prop] = value;
      }
    }
    if (this.hasActiveStyle) {
      style = this.style, cacheStyle = this.cacheStyle;
      this.hasActiveStyle = false;
      elementStyle = node.style;
      for (prop in style) {
        value = style[prop];
        delete style[prop];
        if (typeof value === 'function') {
          value = value();
        }
        if (value == null) {
          value = '';
        }
        cacheStyle[prop] = elementStyle[prop] = value;
      }
    }
    if (this.hasActiveEvents) {
      events = this.events, cacheEvents = this.cacheEvents;
      for (eventName in events) {
        callbackList = events[eventName];
        cacheEvents[eventName] = events[eventName];
        delete events[eventName];
        node[eventName] = eventHandlerFromArray(callbackList, eventName, this);
      }
    }
    this.hasActiveEvents = false;
  };

  Tag.prototype.clone = function() {
    var child, children, _i, _len, _ref2;
    children = [];
    _ref2 = this.children;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      child = _ref2[_i];
      children.push(child.clone());
    }
    return new Tag(this.tagName, this.attrs, children).copyEventListeners(this);
  };

  Tag.prototype.toString = function(indent, addNewLine) {
    var child, children, key, s, v, value, _i, _len, _ref2, _ref3, _ref4;
    if (indent == null) {
      indent = 0;
    }
    s = newLine("<" + this.tagName, indent, addNewLine);
    _ref2 = this.props;
    for (key in _ref2) {
      value = _ref2[key];
      s += ' ' + key + '=' + funcString(value);
    }
    if (this.hasActiveStyle) {
      s += ' style={';
      _ref3 = this.style;
      for (key in _ref3) {
        value = _ref3[key];
        if (typeof value === 'string') {
          s += value;
        } else {
          for (key in value) {
            v = value[key];
            s += ' ' + key + '=' + funcString(v);
          }
        }
      }
      s += '}';
    }
    s += '>';
    children = this.children;
    if (children.length > 1) {
      _ref4 = this.children;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        child = _ref4[_i];
        s += child.toString(indent + 2, true);
      }
      return s += newLine("</" + this.tagName + ">", indent + 2, true);
    } else {
      if (children.length === 1) {
        s += children[0].toString(indent + 2);
      }
      return s += newLine("</" + this.tagName + ">", indent + 2);
    }
  };

  return Tag;

})(List);