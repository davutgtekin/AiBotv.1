// chat.js - YAPAY ZEKA BAĞLANTILI DOĞRU KOD

// Mesaj balonunu chat-box'a ekleyen fonksiyon
function addMessage(text, sender) {
    const chatBox = document.querySelector(".chat-box"); // chat-box elementini al
    const msg = document.createElement("div");           // Yeni bir div oluştur
    msg.classList.add("message", sender);                // CSS class ekle (user/bot)
    msg.textContent = text;                              // Mesajı ekle
    chatBox.appendChild(msg);                            // Chat-box'a ekle
    chatBox.scrollTop = chatBox.scrollHeight;            // En alta kaydır
}

// Gönder butonuna tıklandığında veya Enter'a basıldığında çalışacak fonksiyon
// chat.js - YENİ VE GELİŞTİRİLMİŞ sendMessage FONKSİYONU

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();

    if (text === "") return;

    addMessage(text, "user");
    input.value = "";

    // YENİ: Düşünme animasyonunu oluştur ve ekrana ekle
    const chatBox = document.querySelector(".chat-box");
    const thinkingMessage = document.createElement("div");
    thinkingMessage.classList.add("message", "bot", "thinking");
    thinkingMessage.innerHTML = `<span></span><span></span><span></span>`;
    chatBox.appendChild(thinkingMessage);
    chatBox.scrollTop = chatBox.scrollHeight; // Ekranda görünmesi için en alta kaydır

    try {
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        if (!response.ok) {
            throw new Error("Sunucudan geçerli bir cevap alınamadı.");
        }

        const data = await response.json();
        addMessage(data.reply, "bot");

    } catch (error) {
        console.error("Hata:", error);
        addMessage("Üzgünüm, şu anda cevap veremiyorum ❌", "bot");
    } finally {
        // YENİ: İstek başarılı da olsa, hata da verse, "her zaman" çalışacak olan blok.
        // Düşünme animasyonunu ekrandan kaldırır.
        thinkingMessage.remove();
    }
}

// Enter tuşunun basılmasını dinle
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Formun varsayılan gönderme işlemini engelle
        sendMessage();
    }
});