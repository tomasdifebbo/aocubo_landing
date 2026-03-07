
async function test() {
    const url = "https://adjsimoveis.vercel.app/api/properties?limit=1";
    console.log("Fetching:", url);
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        console.log("Status:", res.status);
        const json = await res.json();
        console.log("Success:", JSON.stringify(json, null, 2).slice(0, 500));
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
test();
