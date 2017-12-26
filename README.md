# vscode-extension-imaginary README

This is the README for your extension "vscode-extension-imaginary". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Allowed extensions are :

```
// Place your settings in this file to overwrite default and user settings.
{
    "imaginary.baseurl" : "http://192.168.8.4:9000",
    "imaginary.operation" : "thumbnail",
    "imaginary.format" : "png",
    "imaginary.size" : "200",
    "imaginary.destination" : "static/media/activity/${year}/${month}/",
}
```

## Developement

**Packaging** : @see https://code.visualstudio.com/docs/extensions/publish-extension

```
npm install -g vsce
vsce publish
```