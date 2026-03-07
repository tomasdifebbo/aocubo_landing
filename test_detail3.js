// First find the correct slug for Free Concept
async function findSlug() {
    const url = `https://api.aocubo.com/api/v1/aocubo/properties?page=0&size=1&search[property.name][value]=Free Concept&search[property.name][type]=ILIKE`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.content?.[0]) {
        const p = data.content[0];
        console.log('ID:', p.id);
        console.log('Name:', p.name);
        console.log('Slug:', p.slug);

        // Now test via our API
        console.log('\nTesting our API with slug:', p.slug);
        const apiRes = await fetch(`https://adjsimoveis.vercel.app/api/properties/s/${p.slug}`);
        const apiData = await apiRes.json();
        if (apiRes.ok) {
            console.log('✅ Title:', apiData.title);
            console.log('✅ Description (first 200 chars):', apiData.description?.substring(0, 200));
            console.log('✅ Images count:', apiData.images?.length);
            console.log('\n--- Units ---');
            apiData.units?.forEach((u, i) => {
                console.log(`  [${i + 1}] Type: "${u.type}" | Bedrooms: ${u.bedrooms} | Area: ${u.livingArea}m² | Price: ${u.price}`);
            });
        } else {
            console.log('❌ API Error:', apiData.error);
        }
    }
}
findSlug();
