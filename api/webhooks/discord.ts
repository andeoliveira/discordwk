type MessageInput = string | Record<string, any>

export class DiscordNotifier {
  async send(message: MessageInput): Promise<void> {
    const content =
      typeof message === 'string'
        ? message
        : JSON.stringify(message, null, 2)

    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
  }
}