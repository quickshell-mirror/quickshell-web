---
title: "Introduction"
index: 2
---
This page will walk you through the process of creating a simple bar/panel, and
introduce you to all the basic concepts involved. You can use the
[QML Language Reference](@docs/guide/qml-language) to learn about the syntax
of the QML language.

> [!NOTE]
> All the <a>Green Links</a> in code blocks will take you to the documentation,
> listing their respective types.

## Config Files
Quickshell searches the `quickshell` subfolder of every XDG standard config path
for configs. Usually, this is `~/.config/quickshell`.

Each named subfolder containing a `shell.qml` file is considered to be a config.
If the base `quickshell` folder contains a `shell.qml` file, subfolders will
not be considered.

A specific configuration can be picked using the `--config` or `-c` argument to Quickshell.

Configs located at other paths outside XDG standard, including raw qml files,
can be run with `--path` or `-p`.

> [!CAUTION]
> Many users use root imports, in the form `import "root:/path/to/module"`. These are an old
> Quickshell feature that will break the LSP and singletons. Keep that in mind if you decide
> to use them.
>
> A replacement without these issues is planned.

## Creating Windows

Quickshell has two main window types available:
- @@Quickshell.PanelWindow for bars, widgets, and overlays
- @@Quickshell.FloatingWindow for standard desktop windows

We'll start with an example:

```qml
import Quickshell // for PanelWindow
import QtQuick // for Text

@@Quickshell.PanelWindow {
  anchors {
    top: true
    left: true
    right: true
  }

  implicitHeight: 30

  @@QtQuick.Text {
    // center the bar in its parent component (the window)
    anchors.centerIn: parent

    text: "hello world"
  }
}
```

The above example creates a bar/panel on your currently focused monitor with
a centered piece of [text](https://doc.qt.io/qt-6/qml-qtquick-text.html).
It will also reserve space for itself on your monitor.

More information about available properties is available in the [type reference](@docs/types/Quickshell/PanelWindow).

## Running a process

Now that we have a piece of text, what if it did something useful?
To start with, let's make a clock. To get the time, we'll use the `date` command.

> [!note/Note]
> Quickshell can do more than just run processes. Read until the end for more information.

We can use a [Process](@docs/types/quickshell.io/process) object to run commands
and a @@Quickshell.Io.StdioCollector to read their output.

We'll listen to the @@Quickshell.Io.StdioCollector.streamFinished(s) signal with
a [signal handler](@docs/guide/qml-language/#signal-handlers)
to update the text on the clock.

> [!note/Note]
> Quickshell live-reloads your code. You can leave it open and edit the
> original file. The panel will reload when you save it.

```qml
import Quickshell
import Quickshell.Io // for Process
import QtQuick

@@Quickshell.PanelWindow {
  anchors {
    top: true
    left: true
    right: true
  }

  implicitHeight: 30

  @@QtQuick.Text {
    // give the text an ID we can refer to elsewhere in the file
    id: clock

    anchors.centerIn: parent

    // create a process management object
    @@Quickshell.Io.Process {
      // the command it will run, every argument is its own string
      command: ["date"]

      // run the command immediately
      running: true

      // process the stdout stream using a StdioCollector
      // Use StdioCollector to retrieve the text the process sends
      // to stdout.
      stdout: @@Quickshell.Io.StdioCollector {
        // Listen for the streamFinished signal, which is sent
        // when the process closes stdout or exits.
        onStreamFinished: clock.text = this.text // `this` can be omitted
      }
    }
  }
}
```

## Running code at an interval

With the above example, your bar should now display the time, but it isn't updating!
Let's use a @@QtQml.Timer to fix that.

```qml
import Quickshell
import Quickshell.Io
import QtQuick

@@Quickshell.PanelWindow {
  anchors {
    top: true
    left: true
    right: true
  }

  implicitHeight: 30

  @@QtQuick.Text {
    id: clock
    anchors.centerIn: parent

    @@Quickshell.Io.Process {
      // give the process object an id so we can talk
      // about it from the timer
      id: dateProc

      command: ["date"]
      running: true

      stdout: @@Quickshell.Io.StdioCollector {
        onStreamFinished: clock.text = this.text
      }
    }

    // use a timer to rerun the process at an interval
    @@QtQml.Timer {
      // 1000 milliseconds is 1 second
      interval: 1000

      // start the timer immediately
      running: true

      // run the timer again when it ends
      repeat: true

      // when the timer is triggered, set the running property of the
      // process to true, which reruns it if stopped.
      onTriggered: dateProc.running = true
    }
  }
}
```

## Reusable components

If you have multiple monitors, you might have noticed that your bar
is only on one of them. If not, you'll still want to **follow this section
to make sure your bar doesn't disappear if your monitor disconnects**.

We can use a @@Quickshell.Variants object to create instances of _non-widget items_.
(See @@QtQuick.Repeater for doing something similar with visual items.)

The @@Quickshell.Variants type creates instances of a @@QtQml.Component based on
a data model you supply. (A component is a re-usable tree of objects.)

The most common use of @@Quickshell.Variants in a shell is to create instances of
a window (your bar) based on your monitor list (the data model).

@@Quickshell.Variants will inject the values in the data model into each new
component's `modelData` property, which means we can easily pass each screen
to its own component. (See @@Quickshell.QsWindow.screen.)

```qml
import Quickshell
import Quickshell.Io
import QtQuick

@@Quickshell.Variants {
  model: Quickshell.screens;

  delegate: @@QtQml.Component {
    @@Quickshell.PanelWindow {
      // the screen from the screens list will be injected into this
      // property
      required property var modelData

      // we can then set the window's screen to the injected property
      screen: modelData

      anchors {
        top: true
        left: true
        right: true
      }

      implicitHeight: 30

      @@QtQuick.Text {
        id: clock
        anchors.centerIn: parent

        @@Quickshell.Io.Process {
          id: dateProc
          command: ["date"]
          running: true

          stdout: @@Quickshell.Io.StdioCollector {
            onStreamFinished: clock.text = this.text
          }
        }

        @@QtQml.Timer {
          interval: 1000
          running: true
          repeat: true
          onTriggered: dateProc.running = true
        }
      }
    }
  }
}
```

See also: [Property Bindings](@docs/guide/qml-language#property-bindings),
[Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

With this example, bars will be created and destroyed as you plug and unplug them,
due to the reactive nature of the @@Quickshell.Quickshell.screens property.
(See: [Reactive Bindings](@docs/guide/qml-language#reactive-bindings).)

Now there's an important problem you might have noticed: when the window
is created multiple times, we also make a new Process and Timer, which makes the
bar less efficient than it could be. We can fix this by moving the
Process and Timer outside of the window using @@Quickshell.Scope.

> [!caution/Error]
> This code will not work correctly.

```qml
import Quickshell
import Quickshell.Io
import QtQuick

@@Quickshell.Scope {
  @@Quickshell.Variants {
    model: Quickshell.screens

    delegate: @@QtQml.Component {
      @@Quickshell.PanelWindow {
        required property var modelData
        screen: modelData

        anchors {
          top: true
          left: true
          right: true
        }

        implicitHeight: 30

        @@QtQuick.Text {
          id: clock
          anchors.centerIn: parent
        }
      }
    }
  }

  @@Quickshell.Io.Process {
    id: dateProc
    command: ["date"]
    running: true

    stdout: @@Quickshell.Io.StdioCollector {
      onStreamFinished: clock.text = this.text
    }
  }

  @@QtQml.Timer {
    interval: 1000
    running: true
    repeat: true
    onTriggered: dateProc.running = true
  }
}
```

However, there is a problem with naively moving the Process and Timer out of the component.
_What about the `clock` that the process references?_

If you run the above example, you'll see something like this in the console every second:

```
WARN scene: **/shell.qml[36:-1]: ReferenceError: clock is not defined
WARN scene: **/shell.qml[36:-1]: ReferenceError: clock is not defined
WARN scene: **/shell.qml[36:-1]: ReferenceError: clock is not defined
WARN scene: **/shell.qml[36:-1]: ReferenceError: clock is not defined
WARN scene: **/shell.qml[36:-1]: ReferenceError: clock is not defined
```

This is because the `clock` object, even though it has an ID, cannot be referenced
outside of its component. Remember, components can be created _any number of times_,
including zero, so `clock` may not exist or there may be more than one, meaning
there isn't an object to refer to from here.

We can fix it with a [Property Definition](@docs/guide/qml-language#property-definitions).

We can define a property inside of the ShellRoot and reference it from the clock
text instead. Due to QML's [Reactive Bindings](@docs/guide/qml-language#reactive-bindings),
the clock text will be updated when we update the property for every clock that
currently exists.

```qml
import Quickshell
import Quickshell.Io
import QtQuick

@@Quickshell.Scope {
  id: root

  // add a property in the root
  property string time

  @@Quickshell.Variants {
    model: Quickshell.screens

    delegate: @@QtQml.Component {
      @@Quickshell.PanelWindow {
        required property var modelData
        screen: modelData

        anchors {
          top: true
          left: true
          right: true
        }

        implicitHeight: 30

        @@QtQuick.Text {
          // remove the id as we don't need it anymore

          anchors.centerIn: parent

          // bind the text to the root object's time property
          text: root.time
        }
      }
    }
  }

  @@Quickshell.Io.Process {
    id: dateProc
    command: ["date"]
    running: true

    stdout: @@Quickshell.Io.StdioCollector {
      // update the property instead of the clock directly
      onStreamFinished: root.time = this.text
    }
  }

  @@QtQml.Timer {
    interval: 1000
    running: true
    repeat: true
    onTriggered: dateProc.running = true
  }
}
```

Now we've fixed the problem, so there's nothing actually wrong with the
above code; however, we can make it more concise:

1. `Component`s can be defined implicitly, meaning we can remove the
   component wrapping the window and place the window directly into the
   `delegate` property.
2. The @@Quickshell.Variants.delegate property is a
   [Default Property](@docs/guide/qml-language#the-default-property),
   which means we can skip the `delegate:` part of the assignment.
   We're already using the default property of @@Quickshell.ShellRoot to store our
   Variants, Process, and Timer components among other things.

This is what our shell looks like with the above (optional) cleanup:

```qml
import Quickshell
import Quickshell.Io
import QtQuick

@@Quickshell.Scope {
  id: root
  property string time

  @@Quickshell.Variants {
    model: Quickshell.screens

    @@Quickshell.PanelWindow {
      required property var modelData
      screen: modelData

      anchors {
        top: true
        left: true
        right: true
      }

      implicitHeight: 30

      @@QtQuick.Text {
        anchors.centerIn: parent
        text: root.time
      }
    }
  }

  @@Quickshell.Io.Process {
    id: dateProc
    command: ["date"]
    running: true

    stdout: @@Quickshell.Io.StdioCollector {
      onStreamFinished: root.time = this.text
    }
  }

  @@QtQml.Timer {
    interval: 1000
    running: true
    repeat: true
    onTriggered: dateProc.running = true
  }
}
```

## Multiple files

In an example as small as this, it isn't a problem, but as the shell
grows it might be preferable to separate it into multiple files.

To start with, let's move the entire bar into a new file.

```qml
// shell.qml
import Quickshell

@@Quickshell.Scope {
  Bar {}
}
```

```qml Bar.qml
// Bar.qml
import Quickshell
import Quickshell.Io
import QtQuick

@@Quickshell.Scope {
  id: root
  property string time

  @@Quickshell.Variants {
    model: Quickshell.screens

    @@Quickshell.PanelWindow {
      required property var modelData
      screen: modelData

      anchors {
        top: true
        left: true
        right: true
      }

      implicitHeight: 30

      @@QtQuick.Text {
        anchors.centerIn: parent
        text: root.time
      }
    }
  }

  @@Quickshell.Io.Process {
    id: dateProc
    command: ["date"]
    running: true

    stdout: @@Quickshell.Io.StdioCollector {
      onStreamFinished: root.time = this.text
    }
  }

  @@QtQml.Timer {
    interval: 1000
    running: true
    repeat: true
    onTriggered: dateProc.running = true
  }
}
```

See also: @@Quickshell.Scope

Any qml file that starts with an uppercase letter can be referenced this way.
We can bring in other folders as well using
[import statements](@docs/guide/qml-language#explicit-imports).

Now what about breaking out the clock? This is a bit more complex because
the clock component in the bar need to be dealt with, as well as the necessary
processes that make up the actual clock.

To start with, we can move the clock widget to a new file. For now, it's just a
single @@QtQuick.Text object, but the same concepts apply regardless of complexity.

```qml
// ClockWidget.qml
import QtQuick

@@QtQuick.Text {
  // A property the creator of this type is required to set.
  // Note that we could just set `text` instead, but don't because your
  // clock probably will not be this simple.
  required property string time

  text: time
}
```

```qml
// Bar.qml
import Quickshell
import Quickshell.Io
import QtQuick

@@Quickshell.Scope {
  id: root
  property string time

  @@Quickshell.Variants {
    model: Quickshell.screens

    @@Quickshell.PanelWindow {
      required property var modelData
      screen: modelData

      anchors {
        top: true
        left: true
        right: true
      }

      implicitHeight: 30

      // the ClockWidget type we just created
      ClockWidget {
        anchors.centerIn: parent
        time: root.time
      }
    }
  }

  @@Quickshell.Io.Process {
    id: dateProc
    command: ["date"]
    running: true

    stdout: @@Quickshell.Io.StdioCollector {
      onStreamFinished: root.time = this.text
    }
  }

  @@QtQml.Timer {
    interval: 1000
    running: true
    repeat: true
    onTriggered: dateProc.running = true
  }
}
```

While this example is larger than what we had before, we can now expand
on the clock widget without cluttering the bar file.

Let's deal with the clock's update logic now:

```qml
// Time.qml
import Quickshell
import Quickshell.Io
import QtQuick

@@Quickshell.Scope {
  id: root
  property string time

  @@Quickshell.Io.Process {
    id: dateProc
    command: ["date"]
    running: true

    stdout: @@Quickshell.Io.StdioCollector {
      onStreamFinished: root.time = this.text
    }
  }

  @@QtQml.Timer {
    interval: 1000
    running: true
    repeat: true
    onTriggered: dateProc.running = true
  }
}
```

```qml
// Bar.qml
import Quickshell

@@Quickshell.Scope {
  // the Time type we just created
  Time { id: timeSource }

  @@Quickshell.Variants {
    model: Quickshell.screens

    @@Quickshell.PanelWindow {
      required property var modelData
      screen: modelData

      anchors {
        top: true
        left: true
        right: true
      }

      implicitHeight: 30

      ClockWidget {
        anchors.centerIn: parent
        // now using the time from timeSource
        time: timeSource.time
      }
    }
  }
}
```

## Singletons

Now you might be thinking, why do we need the `Time` type in
our bar file, and the answer is we don't. We can make `Time`
a [Singleton](@docs/guide/qml-language#singletons).

A singleton object has only one instance, and is accessible from
any scope.

```qml
// Time.qml

// with this line our type becomes a Singleton
pragma Singleton

import Quickshell
import Quickshell.Io
import QtQuick

// your singletons should always have Singleton as the type
@@Quickshell.Singleton {
  id: root
  property string time

  @@Quickshell.Io.Process {
    id: dateProc
    command: ["date"]
    running: true

    stdout: @@Quickshell.Io.StdioCollector {
      onStreamFinished: root.time = this.text
    }
  }

  @@QtQml.Timer {
    interval: 1000
    running: true
    repeat: true
    onTriggered: dateProc.running = true
  }
}
```

```qml
// ClockWidget.qml
import QtQuick

@@QtQuick.Text {
  // we no longer need time as an input

  // directly access the time property from the Time singleton
  text: Time.time
}
```

```qml
// Bar.qml
import Quickshell

@@Quickshell.Scope {
  // no more time object

  @@Quickshell.Variants {
    model: Quickshell.screens

    @@Quickshell.PanelWindow {
      required property var modelData
      screen: modelData

      anchors {
        top: true
        left: true
        right: true
      }

      implicitHeight: 30

      ClockWidget {
        anchors.centerIn: parent

        // no more time binding
      }
    }
  }
}
```

## Quickshell Support Libraries
In addition to calling external processes, Quickshell comes with a large set of support libraries
for common OS integrations and tasks. These libraries are indexed on the left sidebar.

One of these integrations is @@Quickshell.SystemClock, which exposes the system time in an easy to
use way.

We can use @@Quickshell.SystemClock.date to get a Date object to display. The
@@QtQml.Qt.formatDateTime() function can be used to easily format the date
as shown below.

@@Quickshell.SystemClock.precision can be set to `Minutes` to improve battery life if you don't
show seconds on your clock, as Quickshell will have less work to do.

```qml
// Time.qml
pragma Singleton

import Quickshell
import QtQuick

@@Quickshell.Singleton {
  id: root
  // an expression can be broken across multiple lines using {}
  readonly property string time: {
    // The passed format string matches the default output of
    // the `date` command.
    Qt.formatDateTime(clock.date, "ddd MMM d hh:mm:ss AP t yyyy")
  }

  @@Quickshell.SystemClock {
    id: clock
    precision: SystemClock.Seconds
  }
}
```
