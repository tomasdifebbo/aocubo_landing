const slug = 'apartamento-conx-composite-moema-sao-paulo-moema-apartamento';

async function test() {
    console.log('Testing slug lookup for:', slug);

    // Test 1: Direct AoCubo search by slug
    const url = `https://api.aocubo.com/api/v1/aocubo/properties?page=0&size=1&search[property.slug][value]=${slug}&search[property.slug][type]=EQUAL`;
    console.log('Fetching:', url);

    const res = await fetch(url, {
        headers: { "Accept": "application/json", "X-Platform": "web" }
    });
    const data = await res.json();

    console.log('Found:', data.content?.length, 'results');
    if (data.content?.[0]) {
        const p = data.content[0];
        console.log('ID:', p.id);
        console.log('Title:', p.name || p.title);
        console.log('Slug:', p.slug);
        console.log('Neighborhood:', p.neighborhood?.name || p.address?.neighborhood);
        console.log('Images:', p.attachments?.length || 0);
    }
}

test().catch(console.error);
