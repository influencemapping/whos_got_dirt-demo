# Who's got dirt? demo

[Try it.](http://influencemapping.github.io/whos_got_dirt-demo/)

## Development

Update components:

```
npm install -g component
component install
```

Build assets manually:

```
component build
```

Build assets automatically:

```
npm install grunt-contrib-watch --save-dev
grunt
```

Update ISO 3166-1 alpha-2 codes:

```
bundle
bundle exec rake iso_3166_1_alpha_2
```

Copyright (c) 2015 James McKinney, released under the MIT license
