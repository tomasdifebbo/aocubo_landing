// Check AoCubo property to see what the actual URL format is
async function test() {
    // Get a property with units to see unit slugs
    const res = await fetch('https://api.aocubo.com/api/v1/aocubo/properties/799');
    const data = await res.json();

    console.log('Property ID:', data.id);
    console.log('Property Name:', data.name);
    console.log('Property Slug:', data.slug);

    // Check units for their slugs
    if (data.units) {
        data.units.forEach((u, i) => {
            console.log(`\n  Unit ${i + 1}:`);
            console.log(`    ID: ${u.id}`);
            console.log(`    Slug: ${u.slug}`);
            console.log(`    Type: ${u.unitType?.name}`);
        });
    }

    // The AoCubo URL format seen in browser was:
    // https://www.aocubo.com/imovel/unidade/{unit-slug}
    // Let's try both formats
    console.log('\n--- Possible URL formats ---');
    console.log(`Format 1: https://www.aocubo.com/imovel/${data.slug}`);
    console.log(`Format 2: https://www.aocubo.com/imovel/${data.slug}/${data.id}`);
    if (data.units?.[0]) {
        console.log(`Format 3: https://www.aocubo.com/imovel/unidade/${data.units[0].slug}`);
    }
}

test();
