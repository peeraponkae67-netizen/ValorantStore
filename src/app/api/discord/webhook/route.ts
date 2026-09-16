import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { webhookUrl, testOnly, matchedSkins, player, resetTimestamp } = body;

    if (!webhookUrl || typeof webhookUrl !== 'string') {
      return NextResponse.json({ error: 'Webhook URL is required' }, { status: 400 });
    }

    // Safety check: ensure valid Discord webhook domain
    const isDiscordUrl =
      webhookUrl.startsWith('https://discord.com/api/webhooks/') ||
      webhookUrl.startsWith('https://discordapp.com/api/webhooks/');

    if (!isDiscordUrl) {
      return NextResponse.json(
        { error: 'Invalid Discord Webhook URL. It must begin with https://discord.com/api/webhooks/' },
        { status: 400 }
      );
    }

    if (testOnly) {
      // Build test message embed
      const payload = {
        username: 'VALORANT Store Notifier',
        avatar_url: 'https://images.contentstack.io/v3/assets/blt0eb2a2986b796d29/blt6d5a1b32d203fb71/6407b469446f0410787a227e/VCT23_Champions_Lockup_Horizontal_Red.png',
        embeds: [
          {
            title: '✅ Discord Webhook เชื่อมต่อสำเร็จ! (Connected Successfully)',
            description: `ทดสอบระบบแจ้งเตือนร้านค้าสำหรับ **${player?.name || 'Player'}#${player?.tag || '0000'}**\nเมื่อสกินที่คุณ Wishlist ไว้หมุนมาในร้านค้ารายวัน ระบบจะส่งแจ้งเตือนมายังห้องนี้ทันที!`,
            color: 0x00e5ff,
            fields: [
              {
                name: '🎮 ผู้เล่น (Player)',
                value: `${player?.name || 'Player'}#${player?.tag || '0000'} (${(player?.region || 'AP').toUpperCase()})`,
                inline: true,
              },
              {
                name: '🔔 สถานะ (Status)',
                value: 'พร้อมรับการแจ้งเตือน',
                inline: true,
              },
            ],
            footer: {
              text: 'VALORANT Store by @peerap0nn_ • Notification Service',
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return NextResponse.json(
          { error: `Discord rejected webhook (${res.status}): ${errorText}` },
          { status: res.status }
        );
      }

      return NextResponse.json({ success: true, message: 'Test message sent successfully' });
    }

    // Normal Wishlist Alert notification
    if (!matchedSkins || matchedSkins.length === 0) {
      return NextResponse.json({ success: false, message: 'No matched skins to notify' });
    }

    const fields = matchedSkins.map((skin: any, idx: number) => ({
      name: `🎯 สกินที่ ${idx + 1}: ${skin.displayName}`,
      value: `💵 **ราคา**: ${skin.price?.toLocaleString()} VP\n⭐ **ระดับ**: ${skin.tier?.name || 'Standard'} Edition`,
      inline: false,
    }));

    const mainSkin = matchedSkins[0];
    const embedImage = mainSkin.displayIcon || undefined;

    const payload = {
      username: 'VALORANT Store Notifier',
      avatar_url: 'https://images.contentstack.io/v3/assets/blt0eb2a2986b796d29/blt6d5a1b32d203fb71/6407b469446f0410787a227e/VCT23_Champions_Lockup_Horizontal_Red.png',
      embeds: [
        {
          title: `🚨 พบสกินใน Wishlist ในร้านค้ารายวัน! (${matchedSkins.length} ชิ้น)`,
          description: `ร้านค้ารายวันของ **${player?.name || 'Player'}#${player?.tag || '0000'}** มีสกินที่คุณบันทึกไว้ใน Wishlist ปรากฏขึ้นแล้วในวันนี้!`,
          color: 0xff4655, // Valorant red
          fields: [
            {
              name: '👤 บัญชี',
              value: `${player?.name || 'Player'}#${player?.tag || '0000'} (${(player?.region || 'AP').toUpperCase()})`,
              inline: true,
            },
            ...fields,
          ],
          image: embedImage ? { url: embedImage } : undefined,
          footer: {
            text: 'VALORANT Store by @peerap0nn_ • อย่าลืมรีบเข้าเกมไปซื้อก่อนรีเซ็ต 07:00 น.',
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Discord rejected webhook (${res.status}): ${errorText}` },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, count: matchedSkins.length });
  } catch (err: any) {
    console.error('Discord webhook route error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
