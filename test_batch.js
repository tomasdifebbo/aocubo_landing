
async function testBatch() {
    const ids = ["3919", "4045"]; // Replace with real IDs if known
    const response = await fetch("http://localhost:3000/api/properties/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
    });
    const data = await response.json();
    console.log("Batch Results:", JSON.stringify(data, null, 2));
}
// testBatch();
