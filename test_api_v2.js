
async function test() {
    const url = "https://adjsimoveis.vercel.app/api/properties?limit=6";
    console.log("Fetching:", url);
    try {
        const res = await fetch(url);
        console.log("Status:", res.status);
        const json = await res.json();
        console.log("Raw JSON keys:", Object.keys(json));
        if (json.properties) {
            console.log("Properties found:", json.properties.length);
            if (json.properties.length > 0) {
                console.log("First Property Title:", json.properties[0].title);
            }
        } else {
            console.log("NO PROPERTIES ARRAY IN RESPONSE!");
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
test();
