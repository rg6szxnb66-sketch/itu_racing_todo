# FiniList_by_Onur_Yüksek

**Live Demo:** [https://itu-racing-todo.onrender.com](https://itu-racing-todo.onrender.com)

**FiniList**, retro bir hacker terminalini andıran bir tasarıma sahip olan bir "To-Do List" sayfasıdır. Ethical Hacker kavramına duyduğum ilgiyi ve en sevdiğim renk olan yeşili bu şekilde bir araya getirmek istedim. Uygulamanın adı "Finalist" ve "Finite" kelimeleri ile "List"in bir karışımından gelmektedir. Kendilerine "sonlu sayıda (finite)" ve bitirilebilir hedefler koyan ve onları tamamladıkça da kendisilerine karşı başlattıkları yarışta "finale ulaşan (finalist)" kişileri hedef almaktadır.

Uygulamanın koyu ve minimalist bir teması var. Kullanıcı kayıt olup girişini yaptıktan sonra ekrana yönlendirilir. Bu ekranda listesine görev ekleme, görevi düzenleme ve silme fonksiyonlarını gerçekleştirebilir. Her görevin alt kısmında yazılma tarihi ve saati yer alır.

## Özellikler

- **Liste Ekranı:** Görev ekleme, düzenleme ve silme işlemleri burada yapılır. Admin ve user için aynıdır.
- **Admin Paneli:** Sadece `admin` rolüne sahip kullanıcıların erişimi için oluşturulmuştur. MongoDB üzerinden kendi hesabıma bu rol verilmiştir. Bunun dışında kayıt için açılan her profil `user` olarak kaydedilir ve admin paneline erişemez.
- **Loglama Sistemi:** Sistem üzerindeki 3 işlevin (CREATE, UPDATE, DELETE) tarih ile zaman bilgileri ve kullanıcı adları ile kaydedilmesi sağlanmıştır. Bu bilgiler admin panelinde ve elbette veritabanında kendi oluşturduğum Cluster'ın içinde yer alır.
- **Güvenlik:** Yetkisiz kullanıcıların `/admin` sayfasına erişiminin hem frontend hem de API seviyesinde engellenmesi yapılmıştır. Güvenliğin ilk hattı olan frontend engeli, admin olmayan kullanıcıların admin paneline yönlendiren butonu görememeleri şeklinde düzenlenmiştir. Fakat link aracılığıyla `/admin` sayfasına girmek isterlerse o denemelerindeki "localStorage" üzerinden kullanıcı adı kontrolü yapılır.

Fakat asıl güvenlik backend üzerinden sağlanmıştır: app/api/admin/logs/route.ts içinde yetkisiz erişim sağlamaya çalışan kişinin kullanıcı adı alınır ve MongoDB'deki admin yetkisine sahip kullanıcılardan biri mi diye kontrol edilir. Bu sayede log verileri korunmuş olur.

Admin hiçbir şekilde kullanıcıların şifrelerini göremez. Çünkü kayıt işlemi sonucunda veritabanına "hash"lenerek kaydolurlar. Yani düzensiz ve anlamsız karakterler görülür sadece.

## Kullanılan Teknolojiler

- **Frontend/Backend:** Next.js
- **Dil:** TypeScript
- **Database:** MongoDB
- **Tasarım Düzenleme:** Tailwind CSS

---

**Geliştirici:** Onur Yüksek
**Okul:** İstanbul Teknik Üniversitesi (İTÜ)
