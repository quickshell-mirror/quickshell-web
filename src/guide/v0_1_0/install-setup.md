---
title: "Installation & Setup"
index: 0
---
> [!NOTE]
> Quickshell is still in a somewhat early stage of development.
> There will be breaking changes before 1.0, however a migration guide will be provided.

## Installation

Since Quickshell 0.1, you can now choose whether to install by tracking the master branch,
or install by latest release.

Note that you may want to install some additional packages (names vary by distro):
- `qtsvg`: support for SVG image loading (bundled with most packages)
- `qtimageformats`: support for WEBP images as well as some less common ones
- `qtmultimedia`: support for playing videos, audio, etc
- `qt5compat`: extra visual effects, notably gaussian blur. @@QtQuick.Effects.MultiEffect is usually preferable

### Nix
Release versions of Quickshell are available from Nixpkgs under the `quickshell` package.

The Quickshell repo also has an embedded flake which can be used from either mirror:
- `git+https://git.outfoxxed.me/outfoxxed/quickshell`
- `github:quickshell-mirror/quickshell`

> [!NOTE]
> You can use `?ref=` to specify a tag if you want a tagged release.

```nix
{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";

    quickshell = {
      # add ?ref=<tag> to track a tag
      url = "git+https://git.outfoxxed.me/outfoxxed/quickshell";

      # THIS IS IMPORTANT
      # Mismatched system dependencies will lead to crashes and other issues.
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
}
```

The package is available as `quickshell.packages.<system>.default`, which can be added to
your `environment.systemPackages` or `home.packages` if you use home-manager.

### Arch
Quickshell is available from the aur under:
- the [quickshell](https://aur.archlinux.org/packages/quickshell) package for the latest release
- the [quickshell-git](https://aur.archlinux.org/packages/quickshell-git) package that tracks the master branch

> [!WARNING]
> When using an AUR package, Quickshell may break whenever Qt is updated.
> The AUR gives us no way to actually fix this, but Quickshell will attempt to
> warn you if it detects a breakage when updating. If warned of a breakage,
> please reinstall the package.

Install using the command below:
```sh
yay -S quickshell
# or
yay -S quickshell-git
```
(or your AUR helper of choice)

### Fedora
Quickshell is available from the [errornointernet/quickshell] COPR, as either:
- `quickshell` that tracks the latest release
- `quickshell-git` that tracks the master branch

[errornointernet/quickshell]: https://copr.fedorainfracloud.org/coprs/errornointernet/quickshell

Install using the command below:
```sh
sudo dnf copr enable errornointernet/quickshell

sudo dnf install quickshell
# or
sudo dnf install quickshell-git
```

### Guix
Release versions of Quickshell are available from the standard Guix repository
as `quickshell` from the `(gnu packages wm)` module.

Install using the command below:
```sh
guix install quickshell
```

You can also add `quickshell` to your Guix system configuration or Guix Home configuration.

For the git version, Quickshell's source repository works as a channel.
Add the following to your channel list:

```scheme
(channel
  (name quickshell)
  (url "https://git.outfoxxed.me/outfoxxed/quickshell")
  (branch "master"))
```

However, since the package definition is located in the source repository, it cannot be used
as a channel out of the box. You can clone the repository and use `guix shell -f quickshell.scm`
to use the git version of the package.

### Manual build
See [BUILD.md](https://git.outfoxxed.me/quickshell/quickshell/src/branch/master/BUILD.md)
for build instructions and configurations.

## Editor configuration
If you want to write your own configuration, installing a QML grammar and the LSP is recommended.

Read the [Usage Guide](@docs/guide) after configuring your editor.

> [!NOTE]
> Qmlls versions prior to 6.8.2 do not require `-E`

### Emacs
Install the [yuja/tree-sitter-qml](https://github.com/yuja/tree-sitter-qmljs) tree-sitter grammar,
and the [xhcoding/qml-ts-mode](https://github.com/xhcoding/qml-ts-mode) mode.

Both are packaged for nix via [outfoxxed/nix-qml-support](https://git.outfoxxed.me/outfoxxed/nix-qml-support).

Either `lsp-mode` or `eglot` should be usable for LSP ([caveats below](#language-server)).

The author's personal emacs config uses `lsp-mode` and `qml-ts-mode` as follows:
```elisp
(use-package qml-ts-mode
  :after lsp-mode
  :config
  (add-to-list 'lsp-language-id-configuration '(qml-ts-mode . "qml-ts"))
  (lsp-register-client
   (make-lsp-client :new-connection (lsp-stdio-connection '("qmlls", "-E"))
                    :activation-fn (lsp-activate-on "qml-ts")
                    :server-id 'qmlls))
  (add-hook 'qml-ts-mode-hook (lambda ()
                                (setq-local electric-indent-chars '(?\n ?\( ?\) ?{ ?} ?\[ ?\] ?\; ?,))
                                (lsp-deferred))))
```

### Neovim
Neovim has built-in syntax highlighting for QML, however tree-sitter highlighting
may work better than the built-in highlighting. You can install the grammar
using `:TSInstall qmljs`.

To use the language server ([caveats below](#language-server)),
install [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig)
and the following snippet to your configuration:

```lua
require("lspconfig").qmlls.setup {
  cmd = {"qmlls", "-E"}
}
```

### Helix
Helix has built-in syntax highlighting for QML.

To use the language server, add the following snippet to your configuration:

```toml
[language-server.qmlls]
args = ["-E"]
command = "qmlls"
```

### Vscode
1. Install the [Official QML Support extension]
2. Enable the `qt-qml.qmlls.useQmlImportPathEnvVar` setting.
![](/assets/images/vscode-qml-env.png)

[Official QML Support extension]: https://marketplace.visualstudio.com/items?itemName=TheQtCompany.qt-qml

## Language Server
The QML language has an associated language server,
[qmlls](https://doc.qt.io/qt-6/qtqml-tooling-qmlls.html).
We recommend using it, as it will catch a lot of bad practice that may
make your configuration harder to maintain later.

We are aware of the following issues:
- Qmlls does not work well when a file is not correctly structured.
  This means that completions and lints won't work unless braces are closed
  correctly and such.
- Qmlls cannot handle Quickshell's Singleton, which means you won't see completions,
  and usages of Singleton members may show a warning. We're still investigating
  this problem and how to fix it.
- The LSP cannot provide any documentation for Quickshell types.
- `root:` imports cannot be resolved by the LSP.
- `PanelWindow` in particular cannot be resolved.

Keeping in mind the above caveats, qmlls should be able to guide you towards a
more correct code should you choose to use it.

> [!NOTE]
> Nix users should note that qmlls will not be able to pick up qml modules
> that are not in `QML2_IMPORT_PATH`. The easiest way to ensure this is by setting
> `qt.enable` to `true` and installing the quickshell package globally.

# Next steps

Create your first configuration by reading the [Intro](@docs/guide/introduction).
