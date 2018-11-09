# PostCSS Unify [![Build Status][ci-img]][ci]

[PostCSS] plugin keep same ratio on different screen size by vw.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/comwang/postcss-unify.svg
[ci]:      https://travis-ci.org/comwang/postcss-unify

```css
.foo {
    width:75;  /* default design size is 750px*/
    height:20px;
}
```

```css
.foo {
  width:10vw;
  height:20px;
}
```

## Usage

```js
postcss([ require('postcss-unify') ])
```

See [PostCSS] docs for examples for your environment.
