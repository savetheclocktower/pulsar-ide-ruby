const { CompositeDisposable } = require('atom');
const { AutoLanguageClient } = require('@savetheclocktower/atom-languageclient');
const path = require('path');

const ROOT = path.normalize(path.join(__dirname, '..'));
const PACKAGE_NAME = path.basename(ROOT) ?? 'pulsar-ide-ruby';

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

class RubyLanguageClient extends AutoLanguageClient {
  isRestarting = false;
  /** @type {import('atom').Notification | null} */
  _restartNotification = null;
  getGrammarScopes() { return ['source.ruby']; }
  getLanguageName() { return 'Ruby'; }
  getServerName() { return 'ruby-lsp'; }
  getPackageName() { return PACKAGE_NAME; }

  constructor () {
    super();
    this.subscriptions = new CompositeDisposable();

    let debouncedConfigChangeHandler = debounce(() => {
      // Restart the server whenever the user changes ruby-lsp configuration.
      this.isRestarting = true;
      this._restartNotification = atom.notifications.addInfo(
        `Restarting ${this.getServerName()}…`,
        { dismissable: true }
      );
      // Ideally, `restartAllServers` could reliably be awaited, but it never
      // seems to resolve properly. Instead, we'll do cleanup in
      // `postInitialization` below.
      this.restartAllServers();
    }, 1000);

    atom.config.onDidChange(this.getRootConfigurationKey(), debouncedConfigChangeHandler);
  }

  getConfig (configKey) {
    return atom.config.get(`${PACKAGE_NAME}.${configKey}`);
  }

  getInitializeParams (...args) {
    let result = super.getInitializeParams(...args);
    let normalizedInitializationOptions = this.mapConfigurationObject(
      atom.config.get(this.getRootConfigurationKey())
    );
    result.initializationOptions = normalizedInitializationOptions;
    return result;
  }

  getRootConfigurationKey () {
    return `${PACKAGE_NAME}.serverSettings`;
  }

  mapConfigurationObject (obj = {}) {
    return obj;
  }

  // ruby-lsp doesn't support dynamic config changes — so when we change
  // certain keys we'll just reload the server. We implement
  // `getRootConfigurationKey` and `mapConfigurationObject` optimistically in
  // order to minimize effort in the future if ruby-lsp ever supports config
  // change without restarting.
  supportsWorkspaceConfiguration() {
    return false;
  }

  postInitialization (_server) {
    if (this.isRestarting) {
      this.isRestarting = false;
      this._restartNotification?.dismiss();
    }
  }

  onSpawnClose (code, signal) {
    if (this.isRestarting) return;
    super.onSpawnClose(code, signal);
  }

  startServerProcess() {
    let bin = this.getConfig('bin') ?? 'ruby-lsp';
    let [cwd] = atom.project.getPaths();
    console.log('[ruby-lsp] Using CWD:', cwd);
    return super.spawn(bin, [], {
      cwd
    });
  }
}

module.exports = new RubyLanguageClient();
