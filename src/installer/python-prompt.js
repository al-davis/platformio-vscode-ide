/**
 * Copyright (c) 2017-present PlatformIO <contact@platformio.org>
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import fs from 'fs-plus';
import vscode from 'vscode';


export default class PythonPrompt {

  STATUS_TRY_AGAIN = 0;
  STATUS_ABORT = 1;
  STATUS_CUSTOMEXE = 2;

  async prompt() {
    const selectedItem = await vscode.window.showInformationMessage(
      'PlatformIO: Can not find Python 2.7 Interpreter',
      { title: 'Install Python 2.7', isCloseAffordance: true },
      { title: 'I have Python 2.7', isCloseAffordance: true },
      { title: 'Try again', isCloseAffordance: true },
      { title: 'Abort PlatformIO IDE Installation', isCloseAffordance: true }
    );

    switch (selectedItem ? selectedItem.title : undefined) {
      case 'Install Python 2.7':
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('http://docs.platformio.org/page/faq.html#install-python-interpreter'));
        return { status: this.STATUS_TRY_AGAIN };
      case 'I have Python 2.7':
        return {
          status: this.STATUS_CUSTOMEXE,
          pythonExecutable: await vscode.window.showInputBox({
            prompt: 'Please specify a full path to Python 2.7 executable file',
            placeHolder: 'Full path to python/python.exe',
            validateInput: value => !fs.isFileSync(value) ? 'Invalid path to Python Interpreter' : null
          })
        };
      case 'Abort PlatformIO IDE Installation':
        return { status: this.STATUS_ABORT };
      default:
        return { status: this.STATUS_TRY_AGAIN };
    }
  }
}
