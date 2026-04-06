const TEST_KEY = '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';

async function test() {
  const models = [
    "qwen/qwen3.6-plus:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-3-27b-it:free",
    "openrouter/free"
  ];

  for (const m of models) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TEST_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: m,
        messages: [{ role: "user", content: "Сәлем" }]
      })
    });
    const data = await res.json();
    console.log(m, "->", data.error ? data.error.message : data.choices[0].message.content.substring(0, 50));
  }
}
test();
