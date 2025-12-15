---
title: "QML Language"
index: 10
---

Quickshell is configured using the Qt Modeling Language, or QML.
This page explains what you need to know about QML to start using Quickshell.

See also: [Qt Documentation: QML Tutorial](https://doc.qt.io/qt-6/qml-tutorial.html)

## Structure

Below is a QML document showing most of the syntax.
Keep it in mind as you read the detailed descriptions below.

> [!note/Notes:]
>
> - Semicolons are permitted basically everywhere, and recommended in
>   functions and expressions.
> - While types can often be elided, we recommend you use them where
>   possible to catch problems early instead of running into them unexpectedly later on.

```qml
// QML Import statement
import QtQuick 6.0

// Javascript import statement
import "myjs.js" as MyJs

// Root Object
@@QtQuick.Item {
  // Id assignment

  id: root
  // Property declaration
  property int myProp: 5;

  // Property binding
  width: 100

  // Property binding
  height: width

  // Multiline property binding
  prop: {
    // ...
    5
  }

  // Object assigned to a property
  objProp: Object {
    // ...
  }

  // Object assigned to the parent's default property
  AnotherObject {
    // ...
  }

  // Signal declaration
  signal foo(bar: int)

  // Signal handler
  onSignal: console.log("received signal!")

  // Property change signal handler
  onWidthChanged: console.log(`width is now ${width}!`)

  // Multiline signal handler
  onOtherSignal: {
    console.log("received other signal!");
    console.log(`5 * 2 is ${dub(5)}`);
    // ...
  }

  // Attached property signal handler
  Component.onCompleted: MyJs.myfunction()

  // Function
  function dub(x: int): int {
    return x * 2
  }

  // Inline component
  component MyComponent: Object {
    // ...
  }
}
```

### Imports

#### Manual imports

Every QML File begins with a list of imports.
Import statements tell the QML engine where
to look for types you can create [objects](#objects) from.

A module import statement looks like this:

```qml
import <Module> [Major.Minor] [as <Namespace>]
```

- `Module` is the name of the module you want to import, such as `QtQuick`.
- `Major.Minor` is the version of the module you want to import.
- `Namespace` is an optional namespace to import types from the module under.

A relative import statement looks like this:

```qml
import "<directory>" [as <Namespace>]
```

- `directory` is the directory to import, relative to the current file.
- `Namespace` is an optional namespace to import types from the folder under.

A Quickshell module import (new in v0.2.0) looks like this:

```qml
import qs.<path> [as <Namespace>]
```

- `path` is the path to the directory to import, relative to the folder `shell.qml` is in.
`qs` can be used to import the shell root folder. Dotted paths can be used to access nested
subfolders, e.g. `qs.foo.bar`.
- `Namepsace` is an optional namespace to import types from the module under.

> [!TIP]
> Quickshell module imports are preferable to relative path imports as they are much more LSP friendly.

A javascript import statement looks like this:

```qml
import "<filename>" as <Namespace>
```

- `filename` is the name of the javascript file to import.
- `Namespace` is the namespace functions and variables from the javascript
  file will be made available under.

> [!NOTE]
> All _Module_ and _Namespace_ names must start with an uppercase letter.
> Attempting to use a lowercase namespace will result in an error.

##### Examples

```qml
import QtQuick
import QtQuick.Controls 6.0
import Quickshell as QS
import QtQuick.Layouts 6.0 as L
import "jsfile.js" as JsFile
```

See also: [Qt Documentation: Import syntax](https://doc.qt.io/qt-6/qtqml-syntax-imports.html)

#### Implicit imports

The QML engine will automatically import any [types](#creating-types) in neighboring files
with names that start with an uppercase letter.

```
root
|-MyButton.qml
|-shell.qml
```

In this example, `MyButton` will automatically be imported as a type usable from `shell.qml`
or any other neighboring files.

### Objects

Objects are instances of a type from an imported module.
The name of an object must start with an uppercase letter.
This will always distinguish an object from a property.

An object looks like this:

```qml
Name {
  id: foo
  // properties, functions, signals, etc...
}
```

Every object can contain [properties](#properties), [functions](#functions),
and [signals](#signals). You can find out what properties are available for a type
by looking it up in the [Type Reference](@docs/types/).

#### Properties

Every object may have any number of property assignment, with only one assignment per specific property.
Each assignment binds the named property to the given value/expression.

##### Property bindings

Expressions are snippets of javascript code assigned to a property.
The last line can serve as the return value.
Alternatively, an explicit return statement can also be used for multi-line expressions.

```qml
@@QtQuick.Item {
  // simple expression
  property: 5

  // complex expression
  property: 5 * 20 + this.otherProperty

  // multiline expression
  property: {
    const foo = 5;
    const bar = 10;
    foo * bar
  }

  // multiline expression with return
  property: {
    // ...
    return 5;
  }
}
```

Semicolons, while optional, can be included on any line of a single or multi-line expression,
including the last line.

All property bindings are [_reactive_](#reactive-bindings). This means that whenever any
property the expression depends on is updated, the expression is re-evaluated and the property
is updated accordingly.

See also [Reactive bindings](#reactive-bindings) for more information

##### Property definitions

Properties can be defined inside of objects with the following syntax:

```qml
[required] [readonly] [default] property <type> <name>[: binding]
```

- `required` forces users of this type to assign this property. See [Creating Types](#creating-types) for details.
- `readonly` makes the property not assignable. Its binding will still be [reactive](#reactive-bindings).
- `default` makes the property the [default property](#the-default-property) of this type.
- `type` is the type of the property. You can use `var` if you don't know or don't care but be aware that `var` will
  allow any value type.
- `name` is the name that the property is known as. It cannot start with an uppercase letter.
- `binding` is the property binding. See [Property bindings](#property-bindings) for details.

```qml
@@QtQuick.Item {
  // normal property
  property int foo: 3

  // readonly property
  readonly property string bar: "hi!"

  // bound property
  property var things: [ "foo", "bar" ]
}
```

Defining a property with the same name as one provided by the current object will override
the property of the type it is derived from in the current context.

Trying to assign to a property that does not exist is an error.

##### The default property

Types can have a _default property_ which must accept either an object or a list of objects.

The default property will allow you to assign a value to it without using the name of the property:

```qml
@@QtQuick.Item {
  // normal property
  foo: 3

  // this item is assigned to the outer object's default property
  @@QtQuick.Item {
  }
}
```

If the default property is a list, you can put multiple objects into it the same way as you
would put a single object in:

```qml
@@QtQuick.Item {
  // normal property
  foo: 3

  // this item is assigned to the outer object's default property
  @@QtQuick.Item {
  }

  // this one is too
  @@QtQuick.Item {
  }
}
```

##### The `id` property

Every object has a special property called `id` that can be assigned to give
the object a name that it can be referred to throughout the current file.
The id must be lowercase.

```qml
@@QtQuick.Layouts.ColumnLayout {
  @@QtQuick.Text {
    id: text
    text: "Hello World!"
  }

  @@QtQuick.Controls.Button {
    text: "Make the text red";
    onClicked: text.color = "red";
  }
}
```

<Collapsible title="How is the `id` property different from normal properties?">

The `id` property isn't really a property, and doesn't do anything other than
expose the object to the current file. It is only called a property because it
uses very similar syntax to one, and is the only exception to standard property
definition rules. The name `id` is always reserved for the id property.

</Collapsible>

##### Property access scopes

Properties are "in scope" and usable in two cases.

1. They are defined for current type.
2. They are defined for the root type in the current file.

You can access the properties of any object by setting its [id property](#the-id-property),
or make sure the property you are accessing is from the current object using `this`.

The `parent` property is also defined for all objects, but may not always point to what it
looks like it should. Use the `id` property if `parent` does not do what you want.

In general, you should only access properties of the *current* object without an id. For
all other objects, you should refer to them by id when accessing properties.

```qml
@@QtQuick.Item {
  property string rootDefinition

  @@QtQuick.Item {
    id: mid
    property string midDefinition

    @@QtQuick.Text {
      property string innerDefinition

      // legal - innerDefinition is defined on the current object
      text: innerDefinition

      // legal - innerDefinition is accessed via `this` to refer to the current object
      text: this.innerDefinition

      // legal - width is defined for Text
      text: width

      // legal - rootDefinition is defined on the root object
      text: rootDefinition

      // illegal - midDefinition is not defined on the root or current object
      text: midDefinition

      // legal - midDefinition is accessed via `mid`'s id.
      text: mid.midDefinition

      // legal - midDefinition is accessed via `parent`
      text: parent.midDefinition
    }
  }
}
```

See also: [Qt Documentation: Scope and Naming Resolution](https://doc.qt.io/qt-6/qtqml-documents-scope.html)

#### Functions

Functions in QML can be declared everywhere [properties](#properties),
and follow the same [scoping rules](#property-access-scopes).

Function definition syntax:

```qml
function <name>(<paramname>[: <type>][, ...])[: returntype] {
  // multiline expression (note that `return` is required)
}
```

Functions can be invoked in expressions. Expression reactivity carries through
functions, meaning if one of the properties a function depends on is re-evaluated,
every expression depending on the function is also re-evaluated.

```qml
@@QtQuick.Layouts.ColumnLayout {
  property int clicks: 0

  function makeClicksLabel(): string {
    return "the button has been clicked " + clicks + " times!";
  }

  @@QtQuick.Controls.Button {
    text: "click me"
    onClicked: clicks += 1
  }

  @@QtQuick.Text {
    text: makeClicksLabel()
  }
}
```

In this example, every time the button is clicked, the label's count increases
by one as the value of `clicks` is changed, triggering a re-evaluation of `text` through
`makeClicksLabel`.

##### Lambdas

Functions can also be values, and you can assign them to properties or pass them to
other functions (callbacks). There is a shorter way to write these functions, known
as lambdas.

Lambda syntax:

```qml
<params> => <expression>

// params can take the following forms:
() => ... // 0 parameters
<name> => ... // 1 parameter
(<name>[, ...]) => ... // 1+ parameters

// the expression can be either a single or multiline expression.
... => <result>
... => {
  return <result>;
}
```

Assigning functions to properties:

```qml
@@QtQuick.Item {
  // using functions
  function dub(number: int): int { return number * 2; }
  property var operation: dub

  // using lambdas
  property var operation: number => number * 2
}
```

An overcomplicated click counter using a lambda callback:

```qml
@@QtQuick.Layouts.ColumnLayout {
  property int clicks: 0

  function incrementAndCall(callback) {
    clicks += 1;
    callback(clicks);
  }

  @@QtQuick.Controls.Button {
    text: "click me"
    onClicked: incrementAndCall(clicks => {
        label.text = `the button was clicked ${clicks} time(s)!`;
    })
  }

  @@QtQuick.Text {
    id: label
    text: "the button has not been clicked"
  }
}
```

#### Signals

A signal is basically an event emitter you can connect to and receive updates from.
They can be declared everywhere [properties](#properties) and [functions](#functions)
can, and follow the same [scoping rules](#property-access-scopes).

See also: [Qt Documentation: Signal and Handler Event System](https://doc.qt.io/qt-6/qtqml-syntax-signals.html)

##### Signal definitions

A signal can be explicitly defined with the following syntax:

```qml
signal <name>(<paramname>: <type>[, ...])
```

##### Making connections

Signals all have a `connect(<function>)` method which invokes the given function
or signal when the signal is emitted.

```qml
@@QtQuick.Layouts.ColumnLayout {
  property int clicks: 0

  function updateText() {
    clicks += 1;
    label.text = `the button has been clicked ${clicks} times!`;
  }

  @@QtQuick.Controls.Button {
    id: button
    text: "click me"
  }

  @@QtQuick.Text {
    id: label
    text: "the button has not been clicked"
  }

  Component.onCompleted: {
    button.clicked.connect(updateText)
  }
}
```

`Component.onCompleted` will be addressed later in [Attached Properties](#attached-properties),
but for now, just know that it runs immediately once the object is fully initialized.

When the button is clicked, the button emits the @@QtQuick.Controls.Button.clicked(s)
signal, which we connected to `updateText`. The signal then invokes `updateText`,
which updates the counter and the text on the label.

##### Signal handlers

Signal handlers are a more concise way to make connections, and prior examples have used them.

When creating an object, there is a corresponding `on<Signal>` property implicitly defined for every
signal present on its type, which can be set to a function. Do note that the first letter of the
signal's name is capitalized.

Below is the same example from [Making Connections](#making-connections), but this time,
using the implicit signal handler property to handle @@QtQuick.Controls.Button.clicked(s).

```qml
@@QtQuick.Layouts.ColumnLayout {
  property int clicks: 0

  function updateText() {
    clicks += 1;
    label.text = `the button has been clicked ${clicks} times!`;
  }

  @@QtQuick.Controls.Button {
    text: "click me"
    onClicked: updateText()
  }

  @@QtQuick.Text {
    id: label
    text: "the button has not been clicked"
  }
}
```

##### Indirect signal handlers

Signal handlers should be preferred, but there are times where it is not possible or inconvenient to define one.
In those cases, before resorting to `.connect`ing the properties, a @@QtQml.Connections object can be used to access them.

This is especially useful to connect to signals of a Singleton.

```qml
@@QtQuick.Item {
  @@QtQuick.Controls.Button {
    id: myButton
    text "click me"
  }

  @@QtQml.Connections {
    target: myButton

    function onClicked() {
      // ...
    }
  }
}
```

##### Property change signals

Every property has an associated signal, which powers QML's [reactive bindings](#reactive-bindings).
The signal is named `<propertyname>Changed` and works exactly the same as any other signal.

When it is not possible or inconvenient to directly define a signal handler, before resorting
to `.connect`ing the properties, a @@QtQml.Connections object can be used to access them.

```qml
@@QtQuick.Layouts.ColumnLayout {
  @@QtQuick.Controls.CheckBox {
    text: "check me"

    onCheckStateChanged: {
      label.text = labelText(checkState == Qt.Checked);
    }
  }

  @@QtQuick.Text {
    id: label
    text: labelText(false)
  }

  function labelText(checked): string {
    return `the checkbox is checked: ${checked}`;
  }
}
```

In this example, we listen for changes to the @@QtQuick.Controls.CheckBox.checkState property of the CheckBox
using its change signal, `checkStateChanged` with the signal handler `onCheckStateChanged`.

Since text is also a property, we can do the same thing more concisely:

```qml
@@QtQuick.Layouts.ColumnLayout {
  @@QtQuick.Controls.CheckBox {
    id: checkbox
    text: "check me"
  }

  @@QtQuick.Text {
    id: label
    text: labelText(checkbox.checkState == Qt.Checked)
  }

  function labelText(checked): string {
    return `the checkbox is checked: ${checked}`;
  }
}
```

And the function can also be inlined to an expression:

```qml
@@QtQuick.Layouts.ColumnLayout {
  @@QtQuick.Controls.CheckBox {
    id: checkbox
    text: "check me"
  }

  @@QtQuick.Text {
    id: label
    text: {
      const checked = checkbox.checkState == Qt.Checked;
      return `the checkbox is checked: ${checked}`;
    }
  }
}
```

You can also remove the return statement if you wish.

##### Attached objects

Attached objects are additional objects that can be associated with an object
as decided by internal library code. The documentation for a type will
tell you if it can be used as an attached object and how.

Attached objects are accessed in the form `<Typename>.<member>` and can have
properties, functions and signals.

A good example is the @@QtQml.Component type,
which is attached to every object and often used to run code when an object initializes.

In this example, the text property is set inside the `Component.onCompleted` attached signal handler.

```qml
@@QtQuick.Text {
  Component.onCompleted: {
    text = "hello!"
  }
}
```

#### Creating types

Every QML file with an uppercase name is implicitly a type, and can be used from
neighboring files or imported. (See [Imports](#imports).)

A type definition is just a normal object. All properties defined for the root object
are visible to the consumer of the type. Objects identified by [id properties](#the-id-property)
are not visible outside the file.

```qml
// MyText.qml
@@QtQuick.Rectangle {
  required property string text

  color: "red"
  implicitWidth: textObj.implicitWidth
  implicitHeight: textObj.implicitHeight

  @@QtQuick.Text {
    id: textObj
    anchors.fill: parent
    text: parent.text
  }
}

// AnotherComponent.qml
@@QtQuick.Item {
  MyText {
    // The `text` property of `MyText` is required, so we must set it.
    text: "Hello World!"

    // `anchors` is a property of `Item` which `Rectangle` subclasses,
    // so it is available on MyText.
    anchors.centerIn: parent

    // `color` is a property of `Rectangle`. Even though MyText sets it
    // to "red", we can override it here.
    color: "blue"

    // `textObj` is has an `id` within MyText.qml but is not a property
    // so we cannot access it.
    textObj.color: "red" // illegal
  }
}
```

##### Inline Components

Inline components work the same as any other type, but are created inside
another QML file. These components only work within the file, and can reference
IDs inside the file.

While inline components can be created anywhere inside a QML file, they are
scoped to the file itself and cannot be nested.

Example of an inline component:
```qml
@@QtQuick.Layouts.ColumnLayout {
  id: layout
  property real textPointSize: 10

  MyText { text: "Thing 1" }
  MyText { text: "Thing 2" }
  MyText { text: "Thing 3" }

  component MyText: @@QtQuick.Text {
    // applied to all MyText instances
    color: "red"
    // references an id outside of the component
    font.pointSize: layout.textPointSize
  }
}
```

##### Singletons

QML Types can be easily made into a Singleton, meaning there is only one instance of the type.

To make a type of a Singleton, put `pragma Singleton` at the top of the file.
To ensure it behaves correctly with Quickshell, you should also make the
@@Quickshell.Singleton the root item of your type.

```qml
pragma Singleton
import ...

@@Quickshell.Singleton {
  ...
}
```

Once a type is a Singleton, its members can be accessed by name from neighboring
files.

## Concepts

### Reactive bindings

This section assumes knowledge of: [Properties](#properties), [Signals](#signals),
and [Functions](#functions).
See also the [Qt documentation](https://doc.qt.io/qt-6/qtqml-syntax-propertybinding.html).

Reactivity is when a property is updated based on updates to another property.
Every time one of the properties in a binding change, the binding is re-evaluated
and the bound property takes the new result. Any bindings that depend on that property
are then re-evaluated and so forth.

Bindings can be created in two different ways:

##### Automatic bindings

A reactive binding occurs automatically when you use one or more properties in the definition
of another property.

```qml
@@QtQuick.Item {
  property int clicks: 0

  @@QtQuick.Controls.Button {
    text: `clicks: ${clicks}`
    onClicked: clicks += 1
  }
}
```

In this example, the button's @@QtQuick.Controls.Button.text property is re-evaluated
every time the button is clicked, because the `clicks` property has changed.

###### Avoiding creation

To avoid creating a binding, do not use any other properties in the definition of a property.

You can use the `Component.onCompleted` signal to set a value using a property without creating a binding,
as assignments to properties do not create binding.

```qml
@@QtQuick.Item {
  property string theProperty: "initial value"

  @@QtQuick.Text {
    // text: "Right now, theProperty is: " + theProperty
    Component.onCompleted: text = "At creation time, theProperty is: " + theProperty
  }
}
```

##### Manual bindings

Occasionally, a binding might need to be created inside of a function, signal, or expression.
If you need to change or attach a binding at runtime, the `Qt.binding` function can be used to
create one.

The `Qt.binding` function takes another function as an argument, and when assigned to a property,
the property will use that function as its binding expression.

```qml
@@QtQuick.Item {
  @@QtQuick.Text {
    id: boundText
    text: "not bound to anything"
  }

  @@QtQuick.Controls.Button {
    text: "bind the above text"
    onClicked: {
      if (boundText.text == "not bound to anything") {
        text = "press me";
        boundText.text = Qt.binding(() => `button is pressed: ${this.pressed}`);
      }
    }
  }
}
```

In this example, `boundText`'s `text` property is bound to the button's pressed state
when the button is first clicked. When you press or unpress the button the text will
be updated.

##### Removing bindings

To remove a binding, just assign a new value to the property without using `Qt.binding`.

```qml
@@QtQuick.Item {
  @@QtQuick.Text {
    id: boundText
    text: `button is pressed: ${theButton.pressed}`
  }

  @@QtQuick.Controls.Button {
    id: theButton
    text: "break the binding"
    onClicked: boundText.text = `button was pressed at the time the binding was broken: ${pressed}`
  }
}
```

When the button is first pressed, the text will be updated, but once `onClicked` fires
the text will be unbound, and even though it contains a reference to the `pressed` property,
it will not be updated further by the binding.

### Lazy loading

Often, not all of your interface needs to load immediately. By default, the QML engine
initializes every object in the scene before showing anything onscreen. For parts of
the interface you don't need to be immediately visible, load them asynchronously using
a @@Quickshell.LazyLoader. See its documentation for more information.

#### Components

Another delayed loading mechanism is the @@QtQml.Component type.
This type can be used to create multiple instances of objects or lazily load them. It's used by types such
as @@QtQuick.Repeater and @@Quickshell.Variants to create instances of a component at runtime.
