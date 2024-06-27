
import * as cheerio from 'cheerio';
import fetch from 'node-fetch'


// 1) fetch the raw html

// 2) save ?

// 3) clean up (library)

// 4) parse => html to link




// const fetchFunction = (html: string): string => {
//     const [fetched, setFetched] = useState("")

//     fetch(`${html}`)
//         .then(response => response.json())
//         .then(json => setFetched(json))

//     const fetchedItem = JSON.stringify(fetched)

//     return fetchedItem

// }

// fetchFunction("https://en.wikipedia.org/")






// async function fetchData(url: string): Promise<string> {
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return JSON.stringify(data);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return '';
//     }
// // }


export const fetchFunction = async (url: string): Promise<string> => {
    try {

        const response = await fetch(url);
        const contentType = response.headers.get('content-type');

        let data;

        // we need to define what type of content is it being fetched
        if (contentType && contentType.includes('text/html')) {

            data = await response.text();
        }

        else if (contentType && contentType.includes('application/json')) {

            data = await response.json();
        }

        else {

            throw new Error('Unsupported contet type')

        }

        const fetched = JSON.stringify(data)

        return fetched



    } catch (error) {
        console.error('Error fetching data:', error);
        return '';
    }
}

// tested !!
//try it!
// const fetchPokeData = (await fetchFunction(`https://pokeapi.co/api/v2/pokemon-species/aegislash`))
const fetchWikipedia = (await fetchFunction(`https://en.m.wikipedia.org/wiki/Wikipedia:Very_short_featured_articles`))

// console.log('the new data is:', fetchPokeData)
// console.log('the new data is:', fetchWikipedia)




// const fetchDataSize = async (url: string): Promise<{ bytes: number; kilobytes: string; megabytes: string; }> => {

//     try {

//         const response = await fetch(url);
//         const contentLength = response.headers.get('content-length');

//         if (contentLength) {
//             const sizeInBytes = parseInt(contentLength);
//             const sizeInKilobytes = sizeInBytes / 1024;
//             const sizeInMegabytes = sizeInKilobytes / 1024;

//             return {
//                 bytes: sizeInBytes,
//                 kilobytes: sizeInKilobytes.toFixed(2),
//                 megabytes: sizeInMegabytes.toFixed(2)
//             };

//         } else {
//             throw new Error('Content-Length header not found');
//         }
//     } catch (error) {
//         throw new Error(`Failed to get file size from URL: ${error.message}`);
//     }
// }


// tested !!
//try it!
// const fetchPokeDataSize = (await fetchDataSize(`https://pokeapi.co/api/v2/pokemon-species/aegislash`))
// const fetchWikipediaSize = (await fetchDataSize(`https://en.wikipedia.org/wiki/Arnold_Bennett#Works`))

// console.log('the new data is:', fetchPokeDataSize)
// console.log('the new data is:', fetchWikipediaSize)




// there's another version. Nobody thinks of the children while traversing the DOM: https://cheerio.js.org/docs/basics/traversing

const getAnchorTags = (html: string): string[] | undefined => {

    const $ = cheerio.load(html)

    const findLinks = $('section').find('a')

    const mapingOverAnchors = findLinks.map((index, element) => {
        return $(element).attr('href');
    })

    const getTheAnchorsHREFS = mapingOverAnchors.get();

    return getTheAnchorsHREFS
}


const newData = getAnchorTags(fetchWikipedia)

console.log(newData)