'use strict';

((function startup() {
  if (require('electron-squirrel-startup')) return;

  // workaround for fixing auto-launch cwd problem
  const path = require('path');
  const exeName = path.basename(process.execPath);
  if (!exeName.startsWith('electron')) {
    process.chdir(path.dirname(process.execPath));
  }

  const co = require('co');
  const dialog = require('electron').dialog;
  const electronApp = require('electron').app;
  electronApp.commandLine.appendSwitch('js-flags', '--always-compact');

  const logger = require('./utils/logger');
  process.on('uncaughtException', (err) => {
    logger.log(err);
    dialog.showErrorBox('Hain', `Unhandled Error: ${err.stack || err}`);
  });

  co(function* () {
    const app = require('./server/app/app');
    app.launch();
    require('./server/server').initialize(app);
    require('./server/rpc-server').startProcessingQueue();
  }).catch((err) => {
    dialog.showErrorBox('Hain', `Unhandled Error: ${err.stack || err}`);
    electronApp.quit();
  });
})());
