# chrome-window
Use the chrome.app.window API to create windows.

Windows have an optional frame with title bar and size controls. They are not associated with any Chrome browser windows. See the Window State Sample for a demonstration of these options.

Use the chrome.app.window API to create windows. Windows have an optional frame
with title bar and size controls. They are not associated with any Chrome
browser windows. See the Window State Sample for a demonstration of these
options.

## Permissions
You don't need to declare any additional permissions to use this API.

## Example:
    
    <chrome-window id="window"
      url="/demo-app/elements/window-demo/demo.html"
      name="demo-window"
      frame="{{frameOption}}"
      state="{{windowState}}"
      windowhidden="{{windowhidden}}"
      maximized="{{windowmaximized}}"
      minimized="{{windowminimized}}"
      on-created="{{onCreated}}"
      on-error="{{onError}}"></chrome-window>
      
## API

### created event
Fired when a new window has been created but before load event is called in created window.

Details object will contain a "createdWindow" key with a reference to created window object. 
You can access it's JS's window via createdWindow.contentWindow

### url
The URL for new window.
New window will be created each time the url atributte is changed

### name
Id to identify the window. This will be used to remember the size and position of the window and restore that geometry when a window with the same id is later opened. If a window with a given id is created while another window with the same id already exists, the currently opened window will be focused instead of creating a new window.

### frame
Frame type: none or chrome (defaults to chrome).
For none, the -webkit-app-region CSS property can be used to apply draggability to the app's window. -webkit-app-region: drag can be used to mark regions draggable. no-drag can be used to disable this style on nested elements.

You can also pass an object of FrameOptions which is available since Chrome 35.
See more at https://developer.chrome.com/apps/app_window#type-FrameOptions

### state
The initial state of the window, allowing it to be created already fullscreen, maximized, or minimized. Defaults to 'normal'.

Possible values are: "normal", "fullscreen", "maximized", or "minimized"

### windowhidden
If true, the window will be created in a windowhidden state.
Call show() on the window to show it once it has been created.
Defaults to false.

### maximized
If true the window is maximized.
You can also call maximize().

### minimized
If true the window is minimized.
You can also call minimize().

### window property
Created window object.
For more details see https://developer.chrome.com/apps/app_window#type-AppWindow