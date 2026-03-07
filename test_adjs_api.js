async function testSearch(paramsString, name) {
    console.log(`\n--- Testing ${name} ---`);
    const url = `https://adjsimoveis.vercel.app/api/properties?${paramsString}`;
    console.log('Fetching', url);
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(`Total count: ${data.total}`);
        if (data.properties.length > 0) {
            console.log('First result neighborhood:', data.properties[0].neighborhood);
            console.log('First result bedrooms:', data.properties[0].bedrooms);
            console.log('First result price:', data.properties[0].priceFormatted);
        } else {
            console.log('No results found.');
        }
    } catch (e) {
        console.error('Error fetching:', e);
    }
}

async function runTests() {
    await testSearch('limit=1', 'No Filters');
    await testSearch('neighborhood=Moema&limit=1', 'Filter: Moema');
    await testSearch('bedrooms=3&limit=1', 'Filter: 3 Quartos');
    await testSearch('neighborhood=Moema&bedrooms=3&limit=1', 'Filter: Moema + 3 Quartos');
}

runTests();
