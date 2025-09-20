
const socket = io("http://localhost:3000"); // backend'e bağlan

// ----------------------
// 1️⃣ Mesaj balonunu chat-box'a ekleyen fonksiyon
// ----------------------
function addMessage(text, sender) {
    const chatBox = document.querySelector(".chat-box"); // chat-box elementini al
    const msg = document.createElement("div");           // yeni div oluştur
    msg.classList.add("message", sender);               // user veya bot class ekle
    msg.textContent = text;                              // mesaj içeriğini ekle
    chatBox.appendChild(msg);                            // chat-box içine ekle
    chatBox.scrollTop = chatBox.scrollHeight;           // en alta kaydır
}

// ----------------------
// 2️⃣ Basit kural tabanlı bot mantığı
// ----------------------
function botReply(userText) {
    const text = userText.toLowerCase().trim(); 
    let reply = "";

    if (text.includes("merhaba")) {
        reply = "Merhaba! Nasılsın?";
        addMessage(reply, "bot"); 
        // ❌ Burada seçenek eklemiyoruz, kullanıcıdan cevap bekliyoruz
    } 
    else if (text.includes("nasılsın")) {
        reply = "İyiyim, Nasıl Yardımcı olabilirim?";
        addMessage(reply, "bot");

        // ✅ Menü seçenekleri sadece buradan sonra ekleniyor
        const options = ["şifre", "stok", "hesap"];
        options.forEach(option => {
            const btn = document.createElement("button");
            btn.textContent = option;
            btn.onclick = () => sendMessage(option); 
            document.querySelector(".chat-box").appendChild(btn);
        });
    } 
    else {
        reply = "Bunu anlayamadım 🤔";
        addMessage(reply, "bot");
    }
}

// ----------------------
// 3️⃣ Kullanıcının mesajını gönderme fonksiyonu
// ----------------------
function sendMessage(inputText = null) {
    const input = document.getElementById("userInput"); 
    const text = inputText ? inputText : input.value.trim(); // eğer butondan geldi ise onu al

    if(text === "") return; // boş mesaj varsa dur

    addMessage(text, "user"); // kullanıcı mesajını ekle
    input.value = "";         // inputu temizle

    botReply(text);           // bot cevabını ekle
}

// ----------------------
// 4️⃣ Enter tuşunu dinleme
// ----------------------
const input = document.getElementById("userInput");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage(); // inputtaki mesajı gönder
    }
});
