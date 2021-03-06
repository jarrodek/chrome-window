'use strict';
Polymer({
  is: 'chrome-window',
  /**
   * Fired when a new window has been created but before load event is called
   * in created window.
   * Details object will contain a "createdWindow" key with a reference
   * to created window object. You can access it's JS's window via
   * createdWindow.contentWindow
   *
   * @event created
   */
  properties: {
    /**
     * The URL for new window.
     * New window will be created each time the url atributte is changed
     *
     * @type String
     */
    url: {
      type: String,
      observer: '_urlChanged'
    },

    /**
     * Id to identify the window. This will be used to remember the size and
     * position of the window and restore that geometry when a window with
     * the same id is later opened. If a window with a given id is created
     * while another window with the same id already exists,
     * the currently opened window will be focused instead of creating a new window.
     *
     * @type String
     */
    name: String,
    /**
     * Frame type: none or chrome (defaults to chrome).
     * For none, the -webkit-app-region CSS property can be used to apply
     * draggability to the app's window. -webkit-app-region: drag can be used
     * to mark regions draggable. no-drag can be used to disable this style
     * on nested elements.
     *
     * You can also pass an object of FrameOptions which is available since Chrome 35.
     * See more at https://developer.chrome.com/apps/app_window#type-FrameOptions
     *
     * @type String|Object
     */
    frame: Object,
    /**
     * The initial state of the window, allowing it to be created already
     * fullscreen, maximized, or minimized. Defaults to 'normal'.
     *
     * Possible values are: "normal", "fullscreen", "maximized", or "minimized"
     *
     * @type String
     */
    state: {
      type: String,
      value: 'normal'
    },
    /**
     * If true, the window will be created in a windowhidden state.
     * Call show() on the window to show it once it has been created.
     * Defaults to false.
     *
     * @type boolean
     */
    windowHidden: {
      type: Boolean,
      value: false,
      observer: '_windowHiddenChanged'
    },
    /**
     * If true the window is maximized.
     * You can also call maximize().
     *
     * @type boolean
     */
    maximized: {
      type: Boolean,
      value: false,
      observer: '_maximizedChanged'
    },
    /**
     * If true the window is minimized.
     * You can also call minimize().
     *
     * @type boolean
     */
    minimized: {
      type: Boolean,
      value: false,
      observer: '_minimizedChanged'
    },
    /**
     * Created window object.
     * For more details see https://developer.chrome.com/apps/app_window#type-AppWindow
     *
     * @type {Object}
     */
    window: {
      type: Object,
      readOnly: true
    }
  },

  /**
   * Create a new window when URL has changed.
   */
  _urlChanged: function() {
    //TODO: create a new window
    if (this.url && this.url.trim() !== '') {
      this.create();
    }
  },

  _windowHiddenChanged: function() {
    if (!this.window) {
      this.fire('error', {
        'message': 'No active window available'
      });
      return;
    }

    if (this.windowHidden) {
      this.window.hide();
    } else {
      this.window.show();
    }
  },

  _maximizedChanged: function() {
    if (!this.window) {
      this._reportMissingWindow();
      return;
    }
    if (this.maximized) {
      this.maximize();
    } else {
      this.restore();
    }
  },

  _minimizedChanged: function() {
    if (!this.window) {
      this._reportMissingWindow();
      return;
    }
    if (this.minimized) {
      this.minimize();
    } else {
      this.restore();
    }
  },

  /**
   * Create a new window.
   *
   * The size and position of a window can be specified in a number of different ways.
   * The most simple option is not specifying anything at all,
   * in which case a default size and platform dependent position will be used.
   *
   * To automatically remember the positions of windows you can give them ids (name attribute).
   * If a window has an id, This id is used to remember the size and position
   * of the window whenever it is moved or resized. This size and position is
   * then used instead of the specified bounds on subsequent opening of a window
   * with the same id. If you need to open a window with an id at a location
   * other than the remembered default, you can create it hidden,
   * move it to the desired location, then show it.
   *
   * @param options {Object} a create window options.
   * See https://developer.chrome.com/apps/app_window#type-CreateWindowOptions
   * for more details. If this object is not passed to the function default values from
   * element's atributtes will be used.
   */
  create: function(options) {
    if (!options) {
      options = {};
    }
    if (this.name) {
      options.id = options.id || this.name;
    }
    if (this.frame) {
      options.frame = options.frame || this.frame;
    }
    if (this.state) {
      options.state = options.state || this.state;
    }

    options.hidden = this.windowHidden;

    var context = this;
    chrome.app.window.create(this.url, options, function(createdWindow) {
      context._setWindow(createdWindow);
      context.fire('created', {
        createdWindow: createdWindow
      });
    });
  },

  /**
   * Query for opened by the app windows.
   * If `name` atributte is set it will return a window opbject for selected id.
   *
   * @return an array of AppWindow objects
   * (https://developer.chrome.com/apps/app_window#type-AppWindow)
   */
  query: function() {
    var result = [];
    if (this.name) {
      var _win = chrome.app.window.get(this.name);
      if (_win !== null) {
        result.push(_win);
      }
    } else {
      result = chrome.app.window.getAll();
    }
    return result;
  },

  /**
   * Focus on current window.
   */
  focus: function() {
    if (!this.window) {
      this._reportMissingWindow();
      return;
    }
    this.window.focus();
  },

  get fullscreen() {
    if (!this.window) {
      this._reportMissingWindow();
      return undefined;
    }

    return this.window.isFullscreen();
  },

  set fullscreen(state) {
    if (!this.window) {
      this._reportMissingWindow();
      return;
    }

    if (state) {
      this.window.fullscreen();
    } else {

      // it looks like code below doeasn't work. TODO: cancel fullscreen programatically.

      var defaultview = this.window.contentWindow.document.defaultView;
      var keyboardEvent = document.createEvent('KeyboardEvent');
      Object.defineProperty(keyboardEvent, 'keyCode', {
        get: function() {
          return this.keyCodeVal;
        }
      });
      Object.defineProperty(keyboardEvent, 'which', {
        get: function() {
          return this.keyCodeVal;
        }
      });
      keyboardEvent.initKeyboardEvent('keydown', true, true, defaultview,
        false, false, false, false, 27, 27);
      keyboardEvent.keyCodeVal = 27;
      this.window.contentWindow.document.body.dispatchEvent(keyboardEvent);
    }
  },

  maximize: function() {
    if (!this.window) {
      this._reportMissingWindow();
      return;
    }
    this.window.maximize();
  },

  minimize: function() {
    if (!this.window) {
      this._reportMissingWindow();
      return;
    }
    this.window.minimize();
  },

  restore: function() {
    if (!this.window) {
      this._reportMissingWindow();
      return;
    }
    this.window.restore();
  },

  get alwaysOnTop() {
    if (!this.window) {
      this._reportMissingWindow();
      return undefined;
    }
    return this.window.isAlwaysOnTop();
  },

  set alwaysOnTop(state) {
    if (!this.window) {
      this._reportMissingWindow();
      return;
    }

    this.window.setAlwaysOnTop(state);
  },

  _reportMissingWindow: function() {
    console.error('There\'s no widnow object');
    this.fire('error', {
      'message': 'No active window available'
    });
  }
});
