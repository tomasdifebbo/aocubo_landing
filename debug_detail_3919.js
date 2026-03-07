
const AOCUBO_API_BASE = "https://api.aocubo.com/api/v1/aocubo/properties";

async function check() {
    const response = await fetch(`${AOCUBO_API_BASE}/3919`, {
        headers: {
            "Accept": "application/json",
            "X-Platform": "web"
        }
    });

    const property = await response.json();

    if (property) {
        console.log("DETAIL FOUND");
        console.log("ID:", property.id);
        console.log("PRICE:", property.price);
        console.log("UNITS COUNT:", property.units?.length);
        if (property.units?.length > 0) {
            console.log("UNIT PRICES:", property.units.map(u => u.price));
        }
    }
}

check();
