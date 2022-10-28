// Alternative syntax using RegExp constructor
const regex = new RegExp( "\\((?<info>.*?)\\)(\\s|$)|(?<name>.*?)\\/(?<version>.*?)(\\s|$)", "gm" )

const str = `-- Chrome - Android
Mozilla/5.0 (Linux; Android 6.0.1; RedMi Note 5 Build/RB3N5C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36
-- Chrome - Windows
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36
-- Chrome - Linux
Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36


-- Firefox - Windows
Mozilla/5.0 (Windows NT 5.1; rv:7.0.1) Gecko/20100101 Firefox/7.0.1
-- Firefox - Linux
Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:24.0) Gecko/20100101 Firefox/24.0
-- Firefox - Mac OSX
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0


-- Edge - Windows
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134

-- Internet Explorer - Windows
Mozilla/5.0 (Windows NT 6.1; Win64; x64; Trident/7.0; rv:11.0) like Gecko
Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; KTXN)
Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)
Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)
Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; WOW64; Trident/4.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)
`;

let m: RegExpExecArray | null = null;

while ( ( m = regex.exec( str ) ) !== null ) {
    // This is necessary to avoid infinite loops with zero-width matches
    if ( m.index === regex.lastIndex ) {
        regex.lastIndex++;
    }

    console.log(JSON.stringify(m?.groups, null, 4));

    // The result can be accessed through the `m`-variable.
    //m.forEach( ( match, groupIndex, array ) => {
    //    console.log( `Found match, group ${ groupIndex }: Name: ${ JSON.stringify(m?.groups, null, 4) } ${ match }` );
    //} );
}