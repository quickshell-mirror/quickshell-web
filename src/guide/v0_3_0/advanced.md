---
title: "Advanced Options"
index: 10
---
## Pragmas
Quickshell pragmas are comments that influence execution in the form `//@ <pragma>`.

#### Internal
```qml
//@ pragma Internal
```

The Internal pragma can be added to the top of a QML file to prevent it from being exposed outside
of its module.

#### If/Endif
```qml
//@ if <condition>
//@ endif
```

Quickshell supports C-preprocessor like if/endif blocks whose content disappears if the condition
is false. The condition is evaluated as a javascript expression.

The preprocessing environment makes the following functions available for condition usage:
- `hasVersion(major, minor, features): bool` - Checks for a given Quickshell version and unreleased features.
   Works identically to @@Quickshell.Quickshell.hasVersion().
- `hasQtVersion(major, minor): bool` - Checks for a given Qt version, useful for using newly released Qt features.
- `env(name): string` - Returns the value of a given environment variable.
- `isEnvSet(name): bool` - Returns if a given environment variable is set.

### Instance Pragmas
Instance pragmas affect properties of the whole Quickshell instance. They can only be placed at the
top of the root `shell.qml` file.

#### Environment
```qml
//@ pragma Env VAR = VAL
//@ pragma DefaultEnv VAR = VAL
```

Qt and Quickshell environment variables can be specified with the `Env` and `DefaultEnv` pragmas.
These are useful for changing things like Qt scaling, theming, etc.

These environment variables only affect Quickshell itself, and not any processes spawned by it.

#### UseQApplication
```qml
//@ pragma UseQApplication
```

Quickshell launches with a `QGuiApplication` by default. This pragma switches this for
a `QApplication`, which supports using QtWidgets controls. These are needed for things like
the `qqc2-desktop-style` style from KDE.

#### NativeTextRendering
```qml
//@ pragma UseQApplication
```

The NativeTextRendering uses the system text rendering backend over Qt's internal scene backend
which has performance and quality tradeoffs. This is equivalent to setting `Text.renderType` to
`Text.NativeRendering` for all text objects by default.

#### IgnoreSystemSettings
```qml
//@ pragma UseQApplication
```

This can be set to entirely ignore system settings usually relating to application style.
Ususally should not be set.

#### RespectSystemStyle
```qml
//@ pragma RespectSystemStyle
```

By default Quickshell sets the QtQuick Controls style to Fusion to avoid inconsistencies
between systems where a config might be used. Adding this pragma prevents that.

Instead of following the system, a specific QtQuick Controls style might be desired, which
can be set with an env prama.
```qml
//@ pragma Env QT_QUICK_CONTROLS_STYLE = MyStyle
```

#### DropExpensiveFonts
```qml
//@ pragma DropExpensiveFonts
```

Font loading in Qt can be quite expensive, use significant memory, and cause stutters.
Compressed fonts amplify this issue and can sometimes be selected by default. This pragma
excludes all `woff` and `woff2` font files. It may become a default in the future.

This setting can also be set with the `QS_DROP_EXPENSIVE_FONTS=1` environment variable.

#### IconTheme
```qml
//@ pragma IconTheme <theme>
```

Sets the Qt icon theme to the given theme. See
[the qt documentation](https://doc.qt.io/qt-6/qicon.html#setThemeName)
for details.

This setting can also be set with the `QS_ICON_THEME=<theme>` environment variable.

#### AppId
```qml
//@ pragma AppId <appid>
```

Allows overriding the appid used for Quickshell. Useful if you'd like to have
a custom icon on floating windows.

This setting can also be set with the `QS_APP_ID=<appid>` environment variable.

#### ShellId
```qml
//@ pragma ShellId <id>
```

Quickshell assigns a path-based "Shell Id" for every configuration which is used
to set the default locations for data directories and generally consider two
instances to be running the same config.

You may want to override this if your config appears at multiple paths for whatever reason.

#### DataDir, StateDir, CacheDir
```qml
//@ pragma DataDir <dir>
//@ pragma StateDir <dir>
//@ pragma CacheDir <dir>
```

Quickshell defines default data, state, and cache directories based off the shell id and exposed
by @@Quickshell.Quickshell.dataDir, @@Quickshell.Quickshell.stateDir and @@Quickshell.Quickshell.cacheDir.

The dir definition can include `$BASE/` which is replaced by the XDG base directory (data, state, cache).

## Environment

In addition to the environment variables listed above, the following are available:
- `QS_DISABLE_FILE_WATCHER` - Disables hot reloading
- `QS_CONFIG_PATH` - Equivalent to `--path`.
- `QS_NO_XINERAMA_STRUTS` - Hack around X11 bar positioning. May either fix or further break it depending on window manager bugs.
- `QS_CRASHREPORT_URL` - Url for the crash reporter to direct users to instead of the Quickshell issue tracker.
- `QS_DISABLE_CRASH_HANDLER` - Disables the crash handler and relaunch system entirely.
- `QS_NO_RELOAD_POPUP` - Disables the reload notification popup. (This can also be done by hooking it inside the config.)
