
import { fromFileUrl , dirname , join } 
from 'https://deno.land/std@0.160.0/path/mod.ts'


const
    folder = dirname(fromFileUrl(import.meta.url)) ,
    root = join(folder,'..','..','..') ;
    
const
    build = join(root,'Build') ,
    stl = join(root,'StandardLibrary') ;


export const list = 
    join(build,'PublicSuffixes.dat');
    
export const parsed =
    join(stl,'Source/Network/PublicSuffixes.js');