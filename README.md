<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>مركز الحلو للشحن</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700;900&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root {
    --gold: #e94560; --gold2: #f5a623;
    --syriatel-color: #e63946; --mtn-color: #ffb703;
    --ff-color: #f72585; --pubg-color: #4cc9f0;
    --shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Cairo', sans-serif;
    background: linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 40%, #16213e 100%);
    min-height: 100vh; color: #fff; overflow-x: hidden;
  }
  .header { padding: 30px 20px; text-align: center; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); }
  .prices-container { display: flex; justify-content: space-around; padding: 20px; gap: 10px; }
  .price-box { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 15px; text-align: center; flex: 1; border: 1px solid var(--gold); }
  .price-box h3 { font-size: 14px; margin-bottom: 5px; color: var(--gold2); }
  .price-box span { font-size: 20px; font-weight: bold; }
  .news-bar { background: var(--gold); padding: 10px; overflow: hidden; white-space: nowrap; }
  .news-content { display: inline-block; animation: scroll 15s linear infinite; font-weight: bold; }
  @keyframes scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
  .main-content { padding: 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
  .card { background: rgba(255,255,255,0.05); border-radius: 20px; padding: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.1); }
  .card img { width: 60px; height: 60px; margin-bottom: 10px; }
</style>
</head>
<body>

<div class="header">
  <h1>مركز الحلو للشحن</h1>
  <p>سرعة - ثقة - أمان</p>
</div>

<div class="news-bar">
  <div class="news-content" id="news-display">جاري تحميل أحدث العروض...</div>
</div>

<div class="prices-container">
  <div class="price-box">
    <h3>سعر الدولار</h3>
    <span id="dollar-display">--</span>
  </div>
  <div class="price-box">
    <h3>سعر الليرة (TR)</h3>
    <span id="turky-display">--</span>
  </div>
</div>

<div class="main-content">
  <div class="card">
    <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/PUBG_Game_Logo.png" alt="PUBG">
    <h3>ببجي موبايل</h3>
  </div>
  <div class="card">
    <img src="https://upload.wikimedia.org/wikipedia/en/0/00/Free_Fire_logo.png" alt="Free Fire">
    <h3>فري فاير</h3>
  </div>
</div>

<script>
  // رابط قاعدة البيانات الخاص بك
  const dbURL = "https://alhloocenter-default-rtdb.firebaseio.com/.json";

  // وظيفة جلب البيانات من Firebase
  async function fetchSystemData() {
    try {
      const response = await fetch(dbURL);
      const data = await response.json();
      if (data) {
        if(data.dollar) document.getElementById('dollar-display').innerText = data.dollar;
        if(data.turky) document.getElementById('turky-display').innerText = data.turky;
        if(data.news) document.getElementById('news-display').innerText = data.news;
      }
    } catch (error) {
      console.error("خطأ في الاتصال");
    }
  }

  // التحديث التلقائي كل 10 ثوانٍ ليكون العميل على اطلاع دائم
  fetchSystemData();
  setInterval(fetchSystemData, 10000);
</script>

</body>
</html>
