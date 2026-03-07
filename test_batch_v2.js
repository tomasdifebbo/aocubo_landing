
async function test() {
    const url = "https://adjsimoveis.vercel.app/api/properties/batch";
    console.log("Fetching Batch:", url);
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: ["1312", "3818"] }) // Example IDs
        });
        console.log("Status:", res.status);
        const json = await res.json();
        console.log("Success:", JSON.stringify(json, null, 2));
    } catch (e) {
        console.error("Batch fetch failed:", e);
    }
}
test();
