Quickshell Docs
===============

Documentation for [quickshell](https://git.outfoxxed.me/outfoxxed/quickshell) Hosted version at [quickshell.org](https://quickshell.outfoxxed.me)

Frontend rewritten by [Xanazf](https://github.com/Xanazf)

---

Development
-----------

### Install language server attribution

> [!INFO] Yarn
>
> ```bash
> yarn dlx @yarnpkg/sdks base
> ```

======

> [!INFO] NPM
>
> ```bash
> npx @yarnpkg/sdks base
> ```

---

### Enable the language server to use yarn sdks

> [!NOTE] Example for Neovim
>
> ```lua
> {
>  -- ...
>  typescript = {
>    -- ...
>    tsdk = "./.yarn/sdks/typescript/lib",
>    -- ...
>  },
>  -- or whatever language server you're using
>  vtsls = {
>    autoUseWorkspaceTsdk = true,
>  }
> }
> ```

Notes for future updates
------------------------

~- improve Head~

-	improve light theme
-	QtQML docs search
-	page metadata:
	-	`min_version`
	-	`max_version`
	-	`edit_URL`
-	typedocs clearer borders between layout parts
-	better front page styling
