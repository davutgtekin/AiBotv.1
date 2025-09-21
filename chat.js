// Mesaj balonunu chat-box'a ekleyen fonksiyon
function addMessage(text, sender) {
    const chatBox = document.querySelector(".chat-box"); // chat-box elementini al
    const msg = document.createElement("div");           // Yeni bir div oluştur
    msg.classList.add("message", sender);                // CSS class ekle (user/bot)
    msg.textContent = text;                              // Mesajı ekle
    chatBox.appendChild(msg);                            // Chat-box'a ekle
    chatBox.scrollTop = chatBox.scrollHeight;            // En alta kaydır
}

// Gönder butonuna tıklandığında çalışacak fonksiyon
async function sendMessage() {
    const input = document.getElementById("userInput"); // Input al
    const text = input.value.trim();                    // Boşlukları temizle

    if (text === "") return;                            // Boş mesaj engelle

    addMessage(text, "user");                           // Kullanıcı mesajını ekle
    input.value = "";                                   // Input temizle

    try {
        // Backend’e istek atıyoruz
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        // Backend’den gelen cevabı bot olarak ekle
        addMessage(data.reply, "bot");

    } catch (error) {
        console.error("Hata:", error);
        addMessage("Üzgünüm, şu anda cevap veremiyorum ❌", "bot");
    }
}
