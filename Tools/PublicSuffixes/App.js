
import parse from './Parse.js'
import fetch from './Fetch.js'


const { clear , log } = console;
const { args } = Deno;

clear();
log('\n'.repeat(10));


const [ action ] = args;

const actions = {
    'fetch' : fetch ,
    'parse' : parse
}


if(action in actions)
    await actions[action]();
else
    log('Unknown action:',action);

