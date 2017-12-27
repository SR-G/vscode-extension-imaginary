# `vscode-extension-imaginary` README

 VSCode extension allowing to create a thumbnail from a selected URL (through a remote `Imaginary` HTTP call), and to replace this selection with the corresponding markdown tag.

 `Imaginary` is a HTTP micro-service allowing to execute some operations on images through HTTP requests (like "resize this image to 650 pixels wide and convert to PNG"), @see https://github.com/h2non/imaginary.

## Features

![](https://github.com/SR-G/vscode-extension-imaginary/raw/master/vscode-extension-imaginary.gif)

## Requirements

You need a working `Imaginary` server deployed somewhere (same host, or another server (local or remote)).

May for example be started through `docker` with  :

```bash
docker run -d -p 9000:9000 --name imaginary h2non/imaginary -cors -gzip -enable-url-source -enable-auth-forwarding
```

## Extension Settings

This extension has to be configured, either on a global level or on a workspace level (recommended - will allow one different Imaginary usage per project).

- `baseurl` is the full HTTP url of the running `Imaginary` server (for example, "http://127.0.0.1:9000/" if `Imaginary` is running on localhost).
- `operation` is the main operation that will be triggered. 
- `parameters` is a map for the various sub-parameters of this operation and have to be entered accordingly, @see [Imaginary documentation](https://github.com/h2non/imaginary#http-api).
- `destination` is the path where the converted image will be stored, under the project root folder. Some tokens will be automatically replaced, for the now : `${year}`, `${month}`, `${day}` (may be useful for blogging systems)
- `markdown-path` is the path that will be used in the markdown tag. May be different than destination (for example, for `hugo` blogs, statis fields will be stored in the `static/` sub-folder, but this level does not appear once the blog is published)

```json
// Place your settings in this file to overwrite default and user settings.
{
    "imaginary.baseurl" : "http://192.168.8.4:9000",
    "imaginary.operation" : "thumbnail",
    "imaginary.parameters" : {
        "format" : "png",
        "width" : "200",
    },
    "imaginary.destination" : "static/media/activity/${year}/${month}/",  
    "imaginary.markdown-path" : "/media/activity/${year}/${month}/",  
}
```

## Developement

**Packaging** : @see https://code.visualstudio.com/docs/extensions/publish-extension

```bash
// first steps
npm install -g vsce
vsce ls
```

```bash
// publication
npm install
vsce publish
```

**Testing the dev version** :

Generate the extension through `vsce package`, then install it either through `CTRL + SHIFT + P` > `Extensions : install from VSIX` or through `/c/Tools/vscode/1.19.0/code --install-extension vscode-extension-imaginary-0.0.1.vsix`

While developing, if needed, in order to retrieve `node_modules` under the installed folder, use :

```bash
cd  ~/.vscode/extensions/SR-G.vscode-extension-imaginary-0.0.1
npm install
```