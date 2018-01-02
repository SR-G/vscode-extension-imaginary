// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path')
const fs = require('fs')
const stream = require('stream')
const request = require('request')

const padZero = function (s, len, c){
    var c = c || '0';
    while(s.toString().length < len) {
        s = c + s;
    }
    return s;
}

const createDirectories = function (targetDir) {
    var sep = "/"; // path.sep
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(parentDir, childDir);
      if (!fs.existsSync(curDir)){      
        fs.mkdirSync(curDir);
      }
      return curDir;
    }, initDir);    
}

const replaceTokens = function(s) {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return s.replace('\${month}', padZero(month, 2, "0")).replace('\${year}', year).replace('\${day}', padZero(day, 2, "0"));
}

const sanitizePath = function(s) {
    return s.replace(/\\/g, "/").replace(/(?!^)\/\//g, "/");
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-extension-imaginary" is now active!');


    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let commandRenameMarkdownImage = vscode.commands.registerCommand('extension.renameMarkdownImage', function () {
        const workspace0 = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0] : undefined;
        const folderName = workspace0 ? workspace0.uri.fsPath : undefined;

        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        // selected text, will be used during the HTTP call
        var selection = editor.selection;
        var text = editor.document.getText(selection);
        const configuration = vscode.workspace.getConfiguration("imaginary"); 
        var destination = configuration.get('destination', '');
        var markdownPath = configuration.get('markdown-path', destination);
        destination = replaceTokens(destination);
        markdownPath = replaceTokens(markdownPath);
        var currentBasename = path.dirname(text);
        var currentFileName = path.basename(text);

        vscode.window.showInputBox({prompt: 'What should be the new name ?', value: currentFileName}).then(function(val) {
            var currentLocation = sanitizePath(`${folderName}/${destination}/${currentFileName}`);
            var newLocation = sanitizePath(`${folderName}/${destination}/${val}`);
            if (!fs.existsSync(currentLocation)){
                currentLocation = sanitizePath(`${folderName}/${markdownPath}/${currentFileName}`);
                newLocation = sanitizePath(`${folderName}/${markdownPath}/${val}`);
                if (!fs.existsSync(currentLocation)){
                    vscode.window.showErrorMessage("Can't find current image anywhere : " + text + '');  
                    return;
                }
            }

            if (fs.existsSync(newLocation)) {
                vscode.window.showErrorMessage('New file already found on disk : ' + val + '');  
                return;
            }

            fs.rename(currentLocation, newLocation, function(err) {
                if ( err ) { 
                    console.log('ERROR: ' + err);
                    vscode.window.showErrorMessage('Error on renaming to : ' + val + '');  
                } else {
                    editor.edit(function (builder) {
                        builder.replace(selection, text.replace(currentFileName, val));
                    });                    
                }
            });            
        });
    });

    let commandImaginaryOperation = vscode.commands.registerCommand('extension.imaginaryOperation', function () {
        const workspace0 = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0] : undefined;
        const folderName = workspace0 ? workspace0.uri.fsPath : undefined;
        
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        // selected text, will be used during the HTTP call
        var selection = editor.selection;
        var text = editor.document.getText(selection);
        
        // read configuration
        const configuration = vscode.workspace.getConfiguration("imaginary"); 
        const baseUrl = configuration.get("baseurl", "http://127.0.0.1:9000");
        const action = configuration.get("operation", "thumbnail");
        const extension = configuration.get('format', 'png');
        const height = configuration.get('size', '200');
        var destination = configuration.get('destination', '');
        var markdownPath = configuration.get('markdown-path', destination)

        // allow destination to have tokens like ${month}, ${year}, ${day} (usefull for blogging systems)
        destination = replaceTokens(destination);
        markdownPath = replaceTokens(markdownPath);

        // query parameters
        var parameters = configuration.get('parameters', {});
        var sep = "?";
        var qs = "";
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                qs = qs + sep + key + "=" + parameters[key];
            }
            sep = "&";
        }
        qs = qs + sep + "url=" + text

        // final URL, image name, directory where image will be saved
        const url = `${baseUrl}/${action}${qs}`;
        var imageName =  text.split("/").pop();
        imageName = imageName.substr(0, imageName.lastIndexOf(".")) + "." + extension;
        var dir = `${folderName}/${destination}`
        dir = sanitizePath(dir);
        createDirectories(dir);
        var dest = `${folderName}/${destination}/${imageName}`;
        dest = sanitizePath(dest);

        // execute the request + image saving and notify user if sucessful / error
        var stream = request(url).on('error', function(err) {
            console.log(err)
            vscode.window.showErrorMessage('Error on conversion from url : ' + url + '');  
          }).on('response', function(response) {
            console.log(response.statusCode) // 200
            console.log(response.headers['content-type']) // 'image/png'
          }).pipe(fs.createWriteStream(dest));

        stream.on('finish', function () { 
            vscode.window.showInformationMessage('Image successfully written to : ' + dest + '');  
        }).on('error', function (err) {
            vscode.window.showErrorMessage('Error while writing image to : ' + dest + '');  
        });

        // replace the initialy selected text with the markdown image tag containing the path to the saved image
        // todo : would be nice to have a customized file name, but would need to have a second parameter somewhere (in addition to the selected URL)
        editor.edit(function (builder) {
            var s = markdownPath
            if (s == "") {
                s = "/";
            }
            builder.replace(selection, "![](" + s + imageName + ")");
        });
    });

    context.subscriptions.push(commandImaginaryOperation);
    context.subscriptions.push(commandRenameMarkdownImage);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;