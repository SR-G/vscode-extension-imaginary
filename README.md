# `vscode-extension-imaginary` README

 VSCode extension allowing to create a thumbnail from a selected URL (through a remote Imaginary HTTP call), and to replace this selection with the corresponding markdown tag.

 Imaginary is a HTTP micro-service allowing to execute some operations on image through HTTP requests, @see https://github.com/h2non/imaginary.

## Features

To do.

## Requirements

No extra requirements.

## Extension Settings

Allowed extension's configurations are :

```
// Place your settings in this file to overwrite default and user settings.
{
    "imaginary.baseurl" : "http://192.168.8.4:9000",
    "imaginary.operation" : "thumbnail",
    "imaginary.format" : "png",
    "imaginary.size" : "200",
    "imaginary.destination" : "static/media/activity/${year}/${month}/",
    "imaginary.markdown-path" : "/media/activity/${year}/${month}/",  
}
```

## Developement

**Packaging** : @see https://code.visualstudio.com/docs/extensions/publish-extension

```
npm install -g vsce
vsce package
npm install
npm run-script vscode:prepublish
vsce publish
/c/Tools/vscode/1.19.0/code --install-extension vscode-extension-imaginary-0.0.1.vsix
cd  ~/.vscode/extensions/SR-G.vscode-extension-imaginary-0.0.1
npm install
```