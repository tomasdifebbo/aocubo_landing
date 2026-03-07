fetch('https://adjsimoveis.vercel.app/api/properties?neighborhood=Moema&limit=1')
    .then(res => res.json())
    .then(data => console.log(JSON.stringify(data, null, 2)));
