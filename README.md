# Javascript Rock Paper Scissors Game

## Building

Install node via [nvm](https://github.com/creationix/nvm) or your favourite method

Install brunch

    npm install brunch -g

Install npm modules

    npm install .

Build with brunch

    brunch build

Watch for code updates and run a server on [http://localhost:3333/](http://localhost:3333/)

    brunch watch --server

## Testing

Install mocha-phantomjs via npm and run `mocha-phantomjs public/test/index.html` in the rps directory

## Playing

Just open index.html in the public directory in your favourite browser and select the human or computer option. If the computer is playing itself, after five seconds the result will be displayed. If the user is playing the computer, a selection of weapons will appear, giving you five seconds to select before the 'Rock' is automatically selected!

Or visit [http://robinduckett.github.io/rps](http://robinduckett.github.io/rps) to play online!
