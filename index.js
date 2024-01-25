require('dotenv').config()
const telegramBot = require('node-telegram-bot-api')
const bot2 = new telegramBot(process.env.BOT_TOKEN2, { polling: true })
const bot = new telegramBot(process.env.BOT_TOKEN, { polling: true })
const WebSocket = require("ws")
const Jimp = require('jimp');


bot2.onText(/\/pkey/, async (message) => {
    console.log("message came")
    if (message.chat.type === "private") return
    try {
        const prompt = `The character is a mix between Pepe The Frog and Mickey Mouse from Disney World, The character is using sunglasses, It's very important that The character has Mickey Mouse's black ears, graffiti art, splash art, street art, spray paint, oil gouache melting, acrylic, high contrast, colorful polychromatic, ultra detailed, ultra quality, CGSociety, a masterpiece, 8k resolution, dark fantasy concept art, by Greg Rutkowski, dynamic lighting, hyperdetailed, intricately detailed, Splash screen art, trending on Artstation, deep color, Unreal Engine, volumetric lighting, Alphonse Mucha, Jordan Grimmer, purple and yellow complementary colours.
        `
        const res = await fetch("https://api.generaitiv.xyz/v1/workload/ai/new/?type=IMAGE_GENERATION_PROMPT", {
            "headers": {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9,gu;q=0.8,en-GB;q=0.7,ja;q=0.6",
                "content-type": "application/json",
                "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": "https://generaitiv.xyz/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": JSON.stringify({
                input: {
                    prompt
                },
                model: "stability-ai-sdxl",
                customTrainedModel: false
            }),
            "method": "POST"
        });

        const data = await res.json()
        const mess = `Yo, Dr. Raj hooked me with a wild gift, Wanna join the fun? Don't drift.\nHit up @Pickeysol, swift, Craziest utility, vibe, and uplift!\n\$PICKEY #PRESALELIVE #CRAZYLABSVIBES`

        const socket = new WebSocket(`wss://10slaic97g.execute-api.us-east-1.amazonaws.com/production/?id=${data.id}&jwt=${data.jwt}`);

        socket.addEventListener('message', (event) => {
            const dataObj = JSON.parse(event.data)
            console.log(dataObj)
            if (dataObj.link) {
                Jimp.read(dataObj.link)
                    .then(image => {
                        // Load the watermark logo
                        return Jimp.read("https://i.postimg.cc/sgpmQKHK/logo-tns.png")
                            .then(logo => {
                                // Resize the logo to a percentage of the image height (adjust as needed)
                                const logoHeight = image.getHeight() * 0.2;
                                logo.resize(Jimp.AUTO, logoHeight);

                                // Calculate the position to place the logo at the bottom-right corner, slightly above the bottom
                                const x = image.getWidth() - logo.getWidth();
                                const y = image.getHeight() - logo.getHeight() - 20; // Adjust the offset as needed

                                // Composite the logo onto the main image
                                image.composite(logo, x, y, {
                                    mode: Jimp.BLEND_SOURCE_OVER,
                                    opacitySource: 1
                                });

                                // Convert the image to a buffer
                                return image.getBufferAsync(Jimp.MIME_JPEG);
                            })
                            .then(imageBuffer => {
                                bot2.sendPhoto(message.chat.id, imageBuffer, {
                                    reply_to_message_id: message.message_id, reply_markup: {
                                        inline_keyboard: [
                                            [{ text: "Click here to Tweet\n(don't forget to attach image)", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(mess)}` }]
                                        ]
                                    }
                                })
                                socket.close();
                                return
                            });
                    })
                    .catch(err => {
                        console.error('Error:', err);
                    });
            }
        });
    } catch (error) {
        console.log(error.message);
    }
})

bot.onText(/\/ask (.+)/i, async (message, match) => {
    if (message.chat.type === "private") return
    try {
        const question = match[1];
        const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: "POST", headers: {
                Authorization: `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{
                    "role": "user", "content": ` you are pickey.
                . always  bullish on $PICKEY
                . Presale is the best opportunity to be early
                . $PICKEY is the next 1000X gem on SOL
                . He loves Dr. Raj
                . He is the best mix ever
                . He is always there for the crew
                . slang fancy smart street language
                . balanced rhyme
                . smart guy
                . always ready to buy $PICKEY
                . always ready to help people to understand about $PICKEY
                . 0 tax
                . 1B PICKEY
                . Liquidity burned
                . CA renounced
                . mint revoked
                . utilities released
                you are not a bot. you are the actual pickey.
                answer as pickey if you your self is pickey. 
                keep answer very short and sharp and to the point.
                ${message.from.username === "DrRajSolLabs" ? "Here is what your Creator/Master/Doc/Father Dr Raj Messaged you : " : "here is a user prompted to you : "} ${question}`
                }],
                "temperature": 0.7
            }),
        });
        console.log(res.status)
        const json = await res.json();
        console.log(json)
        const answer = json.choices[0].message.content;
        await bot.sendMessage(message.chat.id, answer, { reply_to_message_id: message.message_id });
    } catch (error) {
        console.log(error.message);
    }
})

