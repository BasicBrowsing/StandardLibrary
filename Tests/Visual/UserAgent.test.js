
import { assertEquals } from 'Assert'

import parse from '../../Source/Visual/UserAgent.js'


const
    Firefox = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0' ,
    Chrome = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' ;


Deno.test('Firefox Useragent Parses',() => {
    
    const { version , system , type } = parse(Firefox);
    
    assertEquals(type,'Firefox');
    
    assertEquals(version,'106.0');
    
    assertEquals(system,[ 'Windows NT 10.0' , 'Win64' , 'x64' ]);
    
})


Deno.test('Chrome Useragent Parses',() => {
    
    const { appleWebKit , version , system , type } = parse(Chrome);
    
    assertEquals(type,'Chrome');
    
    assertEquals(appleWebKit,'537.36');
    
    assertEquals(version,'106.0.0.0');
    
    assertEquals(system,[ 'Windows NT 10.0' , 'Win64' , 'x64' ]);
    
})
