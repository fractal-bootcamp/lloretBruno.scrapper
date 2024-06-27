
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
// }


export const fetchFunction = async (url: string): Promise<string | null> => {
    try {

        const response = await fetch(url);
        const contentType = response.headers.get('content-type');

        let data;

        if (contentType && contentType.includes('text/html')) {

            data = await response.text();
        }

        else if (contentType && contentType.includes('application/json')) {

            data = await response.json();
        }

        else {

            throw new Error('Unsupported contet type')

        }

        return JSON.stringify(data)


    } catch (error) {
        console.error('Error fetching data:', error);
        return '';
    }
}

const fetchPokeData = (await fetchFunction(`https://pokeapi.co/api/v2/pokemon-species/aegislash`))
const fetchWikipedia = (await fetchFunction(`https://en.wikipedia.org/wiki/Arnold_Bennett#Works`))

console.log('the new data is:', fetchPokeData)
console.log('the new data is:', fetchWikipedia)