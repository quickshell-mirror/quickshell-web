---
title: "Distributing Configurations"
index: 9
---
If you plan to distribute your configuration to a lot of users, you should keep
a couple things in mind:

### API Breaks
As Quickshell is still in a somewhat early stage of development, Quickshell will
have API breaks for future versions. We will attempt to have a deprecation window
whenever possible.

@@Quickshell.Quickshell.hasVersion() and the Quickshell preprocessor can be used to
version gate blocks of code if you need to work with multiple Quickshell versions.
See [Advanced Options](@docs/guide/advanced) for detauls.

### Configuration Paths
Quickshell can load configurations from a number of different paths.
The ideal path depends on how you distribute your config.

#### As dotfiles
If you distribute your config as a set of dotfiles, you should place it in
`$XDG_CONFIG_HOME/quickshell/<name>` (usually `~/.config/quickshell/<name>`).

You should name your config and refrain from using the bare `$XDG_CONFIG_HOME/quickshell`
directory, as that will make it harder for users to have any other configuration.

Any directory in the `$XDG_CONFIG_HOME/quickshell` can be used using the Quickshell command
by specifying `--config` or `-c`, like so: `qs -c <name>`.

#### As a package
Some configurations are distributed as distro packages. These packages should use a
path in `$XDG_CONFIG_DIRS`, usually `/etc/xdg` for their files.

As with dotfiles, named configurations should be used (`$CONFIG_DIR/quickshell/<name>`).
