const slug = 'apartamento-opera-gestora-free-concept-sao-paulo-saude-apartamento';

async function test() {
    console.log('Testing Free Concept detail...');
    const url = `https://adjsimoveis.vercel.app/api/properties/s/${slug}`;
    const res = await fetch(url);
    const data = await res.json();

    if (res.ok) {
        console.log('✅ Title:', data.title);
        console.log('✅ Description (first 200 chars):', data.description?.substring(0, 200));
        console.log('✅ Images count:', data.images?.length);
        console.log('✅ Status:', data.status);
        console.log('\n--- Units ---');
        data.units?.forEach((u, i) => {
            console.log(`  [${i + 1}] Type: "${u.type}" | Bedrooms: ${u.bedrooms} | Area: ${u.livingArea}m² | Price: ${u.price}`);
        });
    } else {
        console.log('❌ Error:', data.error);
    }
}

test().catch(console.error);
