fetch('https://api.aocubo.com/api/v1/aocubo/properties?neighborhood=Moema&limit=1')
    .then(res => res.json())
    .then(data => console.log(data.content.map(p => p.address?.neighborhood?.name || p.neighborhood?.name)));
