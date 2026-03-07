fetch('https://api.aocubo.com/api/v1/aocubo/properties?neighborhoods=Moema&limit=1')
    .then(res => res.json())
    .then(data => console.log('neighborhoods:', data.content.map(p => p.address?.neighborhood?.name || p.neighborhood?.name)));

fetch('https://api.aocubo.com/api/v1/aocubo/properties?address.neighborhood=Moema&limit=1')
    .then(res => res.json())
    .then(data => console.log('address.neighborhood:', data.content.map(p => p.address?.neighborhood?.name || p.neighborhood?.name)));
