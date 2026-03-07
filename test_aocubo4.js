const start = Date.now();
fetch('https://api.aocubo.com/api/v1/aocubo/properties?size=150')
    .then(res => res.json())
    .then(data => {
        console.log('Fetched:', data.content?.length, 'properties in', Date.now() - start, 'ms');
    })
    .catch(err => console.error(err));
