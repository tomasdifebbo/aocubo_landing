async function testSearch(paramsString, name) {
    console.log(`\n--- ${name} ---`);
    const url = `https://adjsimoveis.vercel.app/api/properties?${paramsString}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(`Total: ${data.total}`);
        if (data.properties.length > 0) {
            data.properties.forEach((p, i) => {
                console.log(`  [${i + 1}] ${p.title} | Bairro: ${p.neighborhood} | Quartos: ${p.bedrooms} | Preço: R$ ${p.priceFormatted}`);
            });
        } else {
            console.log('  Nenhum resultado.');
        }
    } catch (e) {
        console.error('Erro:', e.message);
    }
}

async function runTests() {
    await testSearch('limit=3', 'Sem filtros (3 primeiros)');
    await testSearch('neighborhood=Moema&limit=3', 'Bairro: Moema');
    await testSearch('neighborhood=Vila+Mariana&limit=3', 'Bairro: Vila Mariana');
    await testSearch('bedrooms=3&limit=3', '3 Quartos');
    await testSearch('maxPrice=500000&limit=3', 'Até R$ 500 mil');
    await testSearch('neighborhood=Moema&bedrooms=2&limit=3', 'Moema + 2 Quartos');
}

runTests();
