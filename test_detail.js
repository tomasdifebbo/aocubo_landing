const slug = 'apartamento-conx-composite-moema-sao-paulo-moema-apartamento';

async function test() {
    console.log('Testing property detail via API...');
    const url = `https://adjsimoveis.vercel.app/api/properties/s/${slug}`;
    console.log('Fetching:', url);

    const res = await fetch(url);
    console.log('Status:', res.status);
    const data = await res.json();

    if (res.ok) {
        console.log('✅ SUCCESS!');
        console.log('Title:', data.title);
        console.log('Neighborhood:', data.neighborhood);
        console.log('Price:', data.priceFormatted);
        console.log('Bedrooms:', data.bedrooms);
        console.log('Images:', data.images?.length);
    } else {
        console.log('❌ FAILED:', data.error);
    }
}

test().catch(console.error);
