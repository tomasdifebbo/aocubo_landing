const start = Date.now();
fetch('https://api.aocubo.com/api/v1/aocubo/properties?limit=1500')
    .then(res => res.json())
    .then(data => {
        console.log('Fetched:', data.content?.length, 'properties in', Date.now() - start, 'ms');
    })
    .catch(err => console.error(err));
