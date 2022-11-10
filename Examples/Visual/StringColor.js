
import { rgbFrom , hexFrom } from '../../Source/Visual/StringColor.js'
import { bgRgb24 , bgWhite } from 'Colors'

const { log } = console;


const string = '106.0.0.1';

const
    rgb = await rgbFrom(string) ,
    hex = await hexFrom(string) ;

log(`
    
    String : ${ string }
    RGB : ${ rgb.r } ${ rgb.g } ${ rgb.b }
    HEX : ${ hex }
    Preview :
    
    ${ bgWhite('          ') }
    ${ bgWhite('    ') }${ bgRgb24('  ',rgb) }${ bgWhite('    ')}
    ${ bgWhite('          ') }
    
`);
