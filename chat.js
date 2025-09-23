// chat.js - BOOTSTRAP UYUMLU, ANİMASYONLU NİHAİ KOD

// --- Yardımcı Fonksiyonlar ---

/**
 * Ekrana animasyonsuz, statik bir mesaj balonu ekler.
 * Özellikle kullanıcı mesajları ve düşünme animasyonu için kullanılır.
 * @param {string} text - Mesajın metni.
 * @param {string} sender - 'user' veya 'bot'.
 * @returns {HTMLElement} - Oluşturulan mesaj elementi.
 */
function addStaticMessage(text, sender) {
    // YENİ: Bootstrap'in card-body'sini hedefliyoruz.
    const chatBoxBody = document.getElementById("chat-box-body");

    // Bootstrap'in d-flex ve justify-content class'larını kullanarak hizalama yapıyoruz.
    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add("d-flex", "mb-2");
    messageWrapper.classList.add(sender === 'user' ? 'justify-content-end' : 'justify-content-start');

    const msg = document.createElement("div");
    msg.classList.add("message", sender, "p-2", "rounded");
    
    // Mesaj rengini gönderene göre belirliyoruz.
    if (sender === 'user') {
        msg.classList.add("bg-primary", "text-white");
    } else {
        msg.style.backgroundColor = '#e9ecef';
    }
    
    msg.textContent = text;
    
    messageWrapper.appendChild(msg);
    chatBoxBody.appendChild(messageWrapper);
    chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
    
    return messageWrapper; // Wrapper'ı döndürüyoruz ki düşünme animasyonunu silebilelim.
}


/**
 * Ekrana, sizin istediğiniz 'setInterval' ile kelime kelime yazılan bir bot mesajı ekler.
 * @param {string} text - Animasyonla yazılacak metin.
 */
function addAnimatedMessage(text) {
    const chatBoxBody = document.getElementById("chat-box-body");

    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add("d-flex", "justify-content-start", "mb-2");
    
    const msg = document.createElement("div");
    msg.classList.add("message", "bot", "p-2", "rounded");
    msg.style.backgroundColor = '#e9ecef';
    msg.textContent = ""; // Başlangıçta boş

    messageWrapper.appendChild(msg);
    chatBoxBody.appendChild(messageWrapper);
    
    const words = text.split(" ");
    let index = 0;

    const interval = setInterval(() => {
        if (index < words.length) {
            msg.textContent += (index > 0 ? " " : "") + words[index];
            chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
            index++;
        } else {
            clearInterval(interval);
        }
    }, 200); // Yazma hızı (milisaniye)
}


// --- Ana Fonksiyon ---

/**
 * Mesaj gönderme işlemini yöneten ana fonksiyon.
 */
async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (text === "") return;

    // 1. Kullanıcı mesajını ekle
    addStaticMessage(text, "user");
    input.value = "";

    // 2. "Düşünüyor..." animasyonunu göster
    const thinkingMessageWrapper = addStaticMessage("", "bot");
    const thinkingMessage = thinkingMessageWrapper.querySelector('.message');
    thinkingMessage.classList.add("thinking");
    thinkingMessage.innerHTML = `<span></span><span></span><span></span>`;

    // 3. Backend'e isteği gönder
    try {
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // 4. Düşünme animasyonunu kaldır
        thinkingMessageWrapper.remove();
        
        // 5. Bot'un cevabını animasyonlu olarak ekle
        addAnimatedMessage(data.reply);

    } catch (error) {
        console.error("Hata:", error);
        
        // Hata durumunda da düşünme animasyonunu kaldır
        thinkingMessageWrapper.remove();
        
        // Hata mesajını ekle
        addStaticMessage("Üzgünüm, bir sorun oluştu ❌", "bot");
    }
}


// --- Event Listener ---

/**
 * Enter tuşuna basıldığında mesajı göndermek için.
 */
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Formun varsayılan davranışını engelle
        sendMessage();
    }
});