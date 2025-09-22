// chat.js - AKIŞI DİNLEYEN VE DAKTİLO EFEKTİ YAPAN NİHAİ KOD

// 1. Mesaj balonunu oluşturan standart fonksiyonumuz.
// Önemli bir ekleme: Oluşturduğu mesaj elementini geri döndürür.
function addMessage(text, sender) {
    const chatBox = document.querySelector(".chat-box");
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg; // Bot mesajını daha sonra güncelleyebilmek için bu elementi saklıyoruz.
}

// 2. Ana gönderme fonksiyonumuz. Artık 'async' değil, çünkü cevabı beklemiyor.
function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();

    if (text === "") return;

    // Kullanıcının mesajını ekle
    addMessage(text, "user");
    input.value = "";

    // "Düşünüyor..." animasyonunu göster
    const thinkingMessage = addMessage("", "bot");
    thinkingMessage.classList.add("thinking");
    thinkingMessage.innerHTML = `<span></span><span></span><span></span>`;
    
    // Bot'un cevabını yazacağı boş bir mesaj balonu oluşturuyoruz.
    // Başlangıçta null (boş) olarak ayarlıyoruz.
    let botMessageElement = null;

    // 3. Backend'in akışına (stream) bağlanıyoruz.
    // Dikkat: Artık POST değil, GET ile ve mesajı URL'e ekleyerek gönderiyoruz.
    // Bu, Server-Sent Events (SSE) teknolojisinin çalışma şeklidir.
    const eventSource = new EventSource(`http://localhost:5000/stream?message=${encodeURIComponent(text)}`);

    // 4. Backend'den her yeni veri parçası geldiğinde bu fonksiyon çalışır.
    eventSource.onmessage = function(event) {
        // İlk veri parçası geldiği anda "düşünüyor..." animasyonunu kaldır.
        if (thinkingMessage.parentElement) {
            thinkingMessage.remove();
        }

        const data = JSON.parse(event.data);

        // Eğer backend'den bir hata mesajı akıtıldıysa...
        if (data.error) {
            addMessage(`Hata: ${data.error}`, "bot");
            eventSource.close(); // Hata varsa akışı hemen sonlandır.
            return;
        }

        // Akıştan gelen metin parçasını al.
        const textChunk = data.text;

        // Bu, akıştan gelen ilk metin parçası mı?
        if (!botMessageElement) {
            // Evet, o zaman yeni bir bot mesaj balonu oluştur ve ilk kelimeyi yaz.
            botMessageElement = addMessage(textChunk, "bot");
        } else {
            // Hayır, o zaman mevcut balonun sonuna yeni metni ekle (daktilo efekti).
            botMessageElement.textContent += textChunk;
        }
        
        // Her yeni parça eklendiğinde sohbeti en alta kaydır.
        document.querySelector(".chat-box").scrollTop = document.querySelector(".chat-box").scrollHeight;
    };

    // 5. Akış bittiğinde veya bir ağ hatası olduğunda bu fonksiyon çalışır.
    eventSource.onerror = function(err) {
        console.error("EventSource hatası:", err);
        eventSource.close(); // Bağlantıyı güvenle kapat.
        
        // "Düşünüyor..." animasyonunu kaldır (eğer hala ekrandaysa).
        if (thinkingMessage.parentElement) {
            thinkingMessage.remove();
        }

        // Eğer hiç cevap balonu oluşmadıysa, genel bir hata mesajı göster.
        if (!botMessageElement) {
             addMessage("Bağlantıda bir sorun oluştu. Lütfen tekrar deneyin.", "bot");
        }
    };
}

// Enter tuşunun basılmasını dinleyen standart kodumuz.
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});