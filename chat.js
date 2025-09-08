// Mesaj balonunu chat-box'a ekleyen fonksiyon
function addMessage(text, sender) {
    // chat-box elementini seçiyoruz ve chatBox değişkenine atıyoruz
    // const → sabit değişken, değeri değiştirilemez ama nesnenin içi değiştirilebilir
    const chatBox = document.querySelector(".chat-box"); 

    // Yeni bir <div> elementi oluşturuyoruz ve msg değişkenine atıyoruz
    // msg bir nesne, yani DOM elementini temsil eder
    const msg = document.createElement("div");           

    // Mesaj div'ine CSS class ekliyoruz: 'message' ve 'user' veya 'bot'
    msg.classList.add("message", sender);               

    // Mesajın içeriğini div'e ekliyoruz
    msg.textContent = text;                              

    // Mesaj div'ini chat-box içine ekliyoruz
    chatBox.appendChild(msg);                            

    // Chat-box otomatik olarak en alta kaydırıyor
    chatBox.scrollTop = chatBox.scrollHeight;           
}

//  Gönder butonuna tıklanınca çalışacak fonksiyon
function sendMessage() {
    // Kullanıcının yazdığı input kutusunu seçiyoruz ve input değişkenine atıyoruz
    // const → input artık sabit, ama value gibi özelliklerini değiştirebiliriz
    const input = document.getElementById("userInput"); 

    // Input değerini alıp baş/son boşlukları siliyoruz ve text değişkenine atıyoruz
    const text = input.value.trim();                    

    // Eğer kullanıcı boş mesaj gönderiyorsa fonksiyonu durdur
    if(text === "") return;                             

    // Kullanıcı mesajını chat-box'a ekliyoruz
    addMessage(text, "user");                           

    // Input kutusunu temizliyoruz
    input.value = "";                                   
}
// 1️⃣ Input elementini seçiyoruz
const input = document.getElementById("userInput");



