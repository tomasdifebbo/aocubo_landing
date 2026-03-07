// Test what URL format AoCubo uses
async function test() {
    // Get a property from our API
    const res = await fetch('https://adjsimoveis.vercel.app/api/properties?limit=3');
    const data = await res.json();

    for (const p of data.properties) {
        console.log(`Title: ${p.title}`);
        console.log(`  Our URL: ${p.url}`);
        console.log(`  Slug: ${p.slug}`);
        console.log('');
    }

    // Now check what aocubo.com actually uses
    // Format from the website: https://www.aocubo.com/imovel/unidade/{unit-slug}
    // or https://www.aocubo.com/imovel/{property-slug}/{id}
    console.log('--- Expected format examples ---');
    console.log('https://www.aocubo.com/imovel/unidade/apartamento-...slug...');
}

test();
