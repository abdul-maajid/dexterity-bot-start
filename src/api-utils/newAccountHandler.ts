const HeliusApiKey = "f593a5d6-3ae5-499b-9650-55ab72f76403";
const WebHookId = "c2040a3f-f494-41e6-a703-20b9fc124780";

export const newAcccountSubscriptionHandler = async (newTrg: string) => {
  try {
    const response = await fetch(
      `https://api.helius.xyz/v0/webhooks/${WebHookId}?api-key=${HeliusApiKey}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookURL: "https://trades-webhook-start-pxwm.onrender.com/webhook",
          transactionTypes: ["Any"],
          accountAddresses: [newTrg],
          webhookType: "rawDevnet",
        }),
      }
    );

    const data = await response.json();
    console.log({ data });
  } catch (e) {
    console.error("error", e);
  }
};
