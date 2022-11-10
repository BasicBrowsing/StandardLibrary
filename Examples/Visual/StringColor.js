
import { rgbFrom , hexFrom } from '../../Source/Visual/StringColor.js'


const { log } = console;


const string = '106.0.0.0';

const
    rgb = await rgbFrom(string) ,
    hex = await hexFrom(string) ;

log(`
    
    String : ${ string }
    RGB : ${ rgb.r } ${ rgb.g } ${ rgb.b }
    HEX : ${ hex }
    
`);
