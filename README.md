┌┬┐┬ ┬┌┐┌┌─┐┬ ┬┌─┐┬─┐┌┬┐
 │ │ ││││├┤ └┬┘├─┤├┬┘ ││
 ┴ └─┘┘└┘└─┘ ┴ ┴ ┴┴└──┴┘

A collaborative playlist. Inspired by twg.fm

[thetuneyard.com](http://thetuneyard.com)

## Develop

```bash

# install node and mongo
$ brew install node
$ brew install mongodb

# install cli tools globally
$ npm install -g gulp bower mocha pm2

# pull the code
$ git clone git@github.com:jacobmoe/tuneyard.git
$ cd tuneyard

# fetch package dependencies
$ npm install
$ bower install

# compile assets and launch the dev server
$ gulp
$ open http://localhost:3000/

# create an account
$ ./bin/addUser.js
```

## Test

```
$ mocha
```
