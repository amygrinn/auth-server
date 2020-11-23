# Tygr AuthServer

[Demo](https://tylergrinn.github.io/tygr-auth-server)

[Forking Guide](https://github.com/tylergrinn/tygr-auth-server/blob/main/docs/forking.md)

This is a react component packaged for three environments: node, browser, and standalone.

- Node is reccommended. If you are already using react in the project, this library simply exports a react component function you can use directly in jsx.

- Browser is for fast prototyping in the browser. You can add this component via a script tag. The react and react-dom script tags must be placed before the component script.

- Standalone is for projects that do not use react. It exposes the `mount` function, which takes an HTML element.

## Node

Installation:

```cmd
npm i --save @tygr/auth-server
```

Usage (jsx):

```jsx
import AuthServer from '@tygr/auth-server';

// Import styles. Make sure there is a style loader specified in your
// webpack config
import '@tygr/auth-server/lib/tygr-auth-server.min.css';

export default function MyComponent() {
  return (
    <div>
      <h1>AuthServer usage example</h1>
      <AuthServer />
    </div>
  );
}
```

## Browser

Usage:

When included via script tag, the component is exposed as a window library named 'TygrAuthServer'

```html
<html>
  <head>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <script src="https://tylergrinn.github.io/tygr-auth-server/lib/tygr-auth-server.min.js"></script>
    <link
      rel="stylesheet"
      href="https://tylergrinn.github.io/tygr-auth-server/lib/tygr-auth-server.min.css"
    />
  </head>
  <body>
    <div id="app"></div>

    <script type="text/babel">
      ReactDOM.render(<TygrAuthServer />, document.getElementById('app'));
    </script>
  </body>
</html>
```

## Standalone

Installation:

```cmd
npm i --save @tygr/auth-server
```

Usage:

```jsx

// Vanilla JS
import AuthServer from '@tygr/auth-server/lib/standalone';

const el = document.getElementById('tygr-auth-server');

AuthServer.mount(el);

// Vue
<template>
<div>
  <div ref="tygr-auth-server"></div>
</div>
</template>

<script>
import AuthServer from '@tygr/auth-server/lib/standalone';

export default {
  mounted() {
    AuthServer.mount(this.$refs['tygr-auth-server']);
  },
};
</script>

// Angular Typescript
import { Component, ElementRef, ViewChild } from '@angular/core';
import AuthServer from '@tygr/auth-server/lib/standalone';

@Component({
  selector: 'app-root',
  template: '<div><div #tygr-auth-server></div></div>',
})
export class AuthServerComponent  {
  @ViewChild('tygr-auth-server') el: ElementRef;

  ngAfterViewInit() {
    AuthServer.mount(this.el.nativeElement);
  }
}
```

You should not use the standalone version if you have multiple react components in your project.

## Customizing styles

Sass variables can be overridden if you accept responsibility for transpiling it into css. You can see an example of this setup in the `demo/webpack.config.js` configuration named `sass`.

Make sure to reassign any sass variables before importing the `sass` library:

```scss
$accent-1: white;
$accent-2: yellow;

@import '@tygr/auth-server/sass';
```
