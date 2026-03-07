async function test() {
    // Get several properties and check unit types
    const res = await fetch('https://adjsimoveis.vercel.app/api/properties?limit=10');
    const data = await res.json();

    for (const p of data.properties) {
        console.log(`\n${p.title} (ID: ${p.id})`);
        if (p.units?.length > 0) {
            p.units.forEach((u, i) => {
                console.log(`  Unit ${i + 1}: type="${u.type}" | bedrooms=${u.bedrooms} | area=${u.livingArea}m²`);
            });
        }
    }

    // Also test a detail page
    console.log('\n\n=== Detail: Free Concept ===');
    const slug = 'apartamento-exclusividades-aocubo-free-concept--sao-paulo-saude-apartamento';
    const detailRes = await fetch(`https://adjsimoveis.vercel.app/api/properties/s/${slug}`);
    const detail = await detailRes.json();
    if (detailRes.ok) {
        detail.units?.forEach((u, i) => {
            console.log(`  Unit ${i + 1}: type="${u.type}" | bedrooms=${u.bedrooms} | area=${u.livingArea}m²`);
        });
    }
}
test();
