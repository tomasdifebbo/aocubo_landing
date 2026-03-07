
const AOCUBO_API_BASE = "https://api.aocubo.com/api/v1/aocubo/properties";

async function check() {
    const url = new URL(AOCUBO_API_BASE);
    url.searchParams.set("search[property.slug][value]", "apartamento-metrocasa-metrocasa-liberdade-sao-paulo-liberdade-apartamento");
    url.searchParams.set("search[property.slug][type]", "EQUAL");

    const response = await fetch(url.toString(), {
        headers: {
            "Accept": "application/json",
            "X-Platform": "web"
        }
    });

    const data = await response.json();
    const property = data.content?.[0];

    if (property) {
        console.log("PROPERTY FOUND");
        console.log("ID:", property.id);
        console.log("RAW PRICE:", property.price);
        console.log("UNITS COUNT:", property.units?.length);
        if (property.units?.length > 0) {
            console.log("FIRST UNIT PRICE:", property.units[0].price);
        }
        console.log("FULL RAW DATA (KEYS):", Object.keys(property));
        console.log("ADDRESS DATA:", JSON.stringify(property.address));
    } else {
        console.log("NOT FOUND");
    }
}

check();
