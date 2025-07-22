---
title: "FAQ"
description: "Frequently Asked Questions"
index: 1000
---

> [!NOTE]
> This page is being actively expanded upon as more common questions come up.
>
> Make sure to also read the [Item Size and Position](/docs/guide/size-position) and
> [QML Language](/docs/guide/qml-language) pages for questions related to
> item sizing/positioning and QML in general.

## Misc

### What will breaking changes look like
Quickshell will have breaking changes in future releases. These changes can
span the APIs exposed by Quickshell, as well as best practice across all
APIs, but will not change the language syntax or anything exposed by Qt.

Most changes will be relatively trivial, though you may have to make the same
trivial change a considerable amount of times if you have a large configuration.

Migration guides will be provided between each release version.

### Should I use a process per widget
No. Using a process per widget will use significantly more memory than using a
single process.

## How do I

### Make a rounded window
Rounded windows are simply transparent, square windows, with a rounded rectangle
inside of them.

```qml
@@Quickshell.PanelWindow {
  color: "transparent"

  @@QtQuick.Rectangle {
    // match the size of the window
    anchors.fill: parent

    radius: 5
    color: "white" // your actual color
  }
}
```

### Make a list of widgets
If you have a short list of items to display, such as a list of active music
players or system tray items, you want a @@QtQuick.Repeater, which is
usually combined with a @@QtQuick.Layouts.RowLayout or @@QtQuick.Layouts.ColumnLayout.

If you have a longer list, such as a list of entries in an application launcher
or a list that needs to be scrolled, you want a @@QtQuick.ListView instead.

### Run a program or script
Use @@Quickshell.Io.Process.

If you want the entire output of the process as a single string, use
@@Quickshell.Io.StdioCollector to collect the Process's stdio.

If the process is intended to run for a long time and stream in data,
e.g. a command that listens to window manager IPC commands, use
@@Quickshell.Io.SplitParser to return each datum as it arrives.

### Show widgets conditionally
Conditionally showing widgets can be done in two ways, simply using the @@QtQuick.Item.visible property,
or by using a @@QtQuick.Loader.

Depending on your use case, both the @@QtQuick.Loader and the @@QtQuick.Item.visible property
may make sense at equal complexity. If you want to unload a widget tree to save memory or
speed up load times, then you should use Loaders.

Note that you can also change out a Loader's component conditionally:

```qml
@@QtQuick.Loader {
  readonly property Component thing1: ...
  readonly property Component thing2: ...

  sourceComponent: condition ? thing1 : thing2
}
```

### Round an image
The easiest way to round an image is with @@Quickshell.Widgets.ClippingWrapperRectangle,
which is a [MarginWrapper] component. This component will attempt to match the size of
its contained item.

```qml
@@Quickshell.Widgets.ClippingWrapperRectangle {
  radius: 10

  @@Quickshell.Widgets.IconImage { // or a normal @@QtQuick.Image
    source: ...
    implicitSize: ...
  }
}
```

[MarginWrapper]: /docs/guide/size-position#marginwrapper-components

### Reference images and resources
By default, paths passed to components such as @@QtQuick.Image or
@@Quickshell.Io.FileView as strings are relative to Quickshell's working
directory. Usually, this is not the desired behavior.

To get a file path relative to the current QML file, you can use @@QtQml.Qt.resolvedUrl().

To get a file path relative to your shell's reserved cache, data, or state directories,
you can use @@Quickshell.Quickshell.cachePath(), @@Quickshell.Quickshell.dataPath() or
@@Quickshell.Quickshell.statePath(),

### Add a drop-shadow
Use @@QtQuick.Effects.RectangularShadow if you want a *rectangular*, *round rectangular*,
or *circular* drop shadow.

For any other shape, you will have to use a @@QtQuick.Effects.MultiEffect and set
@@QtQuick.Effects.MultiEffect.shadowEnabled, as well as its other shadow and blur
related properties.

### Get rid of the purple/black icons
The @@Quickshell.Quickshell.iconPath() function has three variants:
- One draws a purple/black square if the icon is missing.
- One allows you to specify a fallback icon if the desired one is missing.
- One returns an empty string if the icon is missing.

Either of the last two variants can be used to avoid the purple/black square.

### Work with an unsupported WM
Quickshell currently only bundles interfaces for working with Hyprland and i3,
however you can implement your own using @@Quickshell.Io.Socket or @@Quickshell.Io.Process,
which can be used to parse and send IPC messages.

### Open/close windows with commands
Quickshell doesn't come with a command to open or close a window; however, you can
make your own using @@Quickshell.Io.IpcHandler, allowing you to call functions
inside of Quickshell with a command. Said functions can change the
@@Quickshell.QsWindow.visible property of a window, or load/unload it using a
@@Quickshell.LazyLoader.

### Reduce memory usage
The main thing you can do to reduce the memory usage of a given configuration
is to use Loaders.

Loaders can be used to create objects only when needed, and destroy them when not needed.

@@QtQuick.Loader should be used if the component being loaded inherits from @@QtQuick.Item,
otherwise, a @@Quickshell.LazyLoader should be used.

## Something is broken

### There is a hole in my window
If you set a Rectangle's color to `"transparent"` and touch its `border` property,
you'll hit [QTBUG-137166](https://bugreports.qt.io/browse/QTBUG-137166), which
causes everything under the transparent rectangle to become invisible.

Adding a definition like `border.width: 0` seems to work around it, especially
if the only border property you wanted to set was radius.

### My window should not be opaque
If a window is created with an opaque background color, Quickshell will use
a window surface format that is opaque. This is done to reduce the amount of
processing the gpu must do to draw it.

If you change the background color of your window between opaque and transparent colors,
then this may affect you.

To tell Quickshell that you want to create a window capable of showing transparency,
use @@Quickshell.QsWindow.surfaceFormat to set `opaque` to false.
