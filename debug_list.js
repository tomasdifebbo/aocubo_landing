
const AOCUBO_API_BASE = "https://api.aocubo.com/api/v1/aocubo/properties";

async function check() {
    const url = new URL(AOCUBO_API_BASE);
    // Get first 5 properties to see their structure
    url.searchParams.set("size", "5");

    const response = await fetch(url.toString(), {
        headers: {
            "Accept": "application/json",
            "X-Platform": "web"
        }
    });

    const data = await response.json();
    const items = data.content || [];

    items.forEach(p => {
        console.log("---");
        console.log("Name:", p.name);
        console.log("Price:", p.price);
        console.log("Units Count:", p.units?.length);
        if (p.units?.length > 0) {
            console.log("Sample Unit Price:", p.units[0].price);
        }
    });
}

check();
