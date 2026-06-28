# pulsar-ide-ruby package

Ruby language support for Pulsar via [the `ruby-lsp` gem](https://shopify.github.io/ruby-lsp/).

## Work in progress

Known to work:

* [x] Project references ([`pulsar-find-references`](https://packages.pulsar-edit.dev/packages/pulsar-find-references))
* [x] `symbols-view` integration
* [x] Code formatting ([`pulsar-code-format`](https://packages.pulsar-edit.dev/packages/pulsar-code-format); see below)
* [x] Hover tooltip support (`pulsar-hover`)
* [x] Autocompletion (`autocomplete-plus`; not yet perfect)
* [ ] Diagnostics (`linter` — [not yet working](https://github.com/savetheclocktower/atom-languageclient/issues/7))

## Installation

[Follow these instructions](https://shopify.github.io/ruby-lsp/#with-other-editors) to install `ruby-lsp`. It should not be added to your project’s `Gemfile` [for the reasons explained here](https://shopify.github.io/ruby-lsp/composed-bundle.html).

You may also install `rubocop` and `syntax_tree` for enhanced support (not sure offhand whether they must be installed globally or within your project).

## Settings

### Formatter

The formatter to use with `pulsar-code-format` (or `atom-ide-code-format`). Default is `auto`, but consider installing the `syntax_tree` gem and setting this value to `syntax_tree`, since that’s apparently [the only formatter that can format arbitrary ranges](https://shopify.github.io/ruby-lsp/#range-formatting).

### Linters

The set of linters to use. This maps directly to a Ruby LSP setting, but linter support is not yet working; stand by!
