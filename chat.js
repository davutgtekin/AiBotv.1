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
async function sendMessage() {
    const input = document.getElementById("userInput"); // Input elementini al
    const text = input.value.trim();                    // Başındaki ve sonundaki boşlukları temizle

    if (text === "") return;                            // Boş mesaj gönderilmesini engelle

    addMessage(text, "user");                           // Kullanıcının mesajını ekrana ekle
    input.value = "";                                   // Input kutusunu temizle

    try {
        // Backend sunucumuza istek atıyoruz
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        // Eğer sunucudan cevap gelmezse veya bir hata olursa
        if (!response.ok) {
            throw new Error("Sunucudan geçerli bir cevap alınamadı.");
        }

        const data = await response.json();

        // Backend’den gelen cevabı bot mesajı olarak ekrana ekle
        addMessage(data.reply, "bot");

    } catch (error) {
        console.error("Hata:", error);
        // Kullanıcıya bir sorun olduğunu bildiren bir mesaj göster
        addMessage("Üzgünüm, şu anda cevap veremiyorum ❌", "bot");
    }
}

// Enter tuşunun basılmasını dinle
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Formun varsayılan gönderme işlemini engelle
        sendMessage();
    }
});