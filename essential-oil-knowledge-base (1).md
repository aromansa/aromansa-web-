# Basis Pengetahuan Rekomendasi Essential Oil Aromansa

Dokumen ini menjadi acuan untuk **Scan Mood AR** dan **Konsultan AI** Aromansa. Isinya menjelaskan minyak mana yang direkomendasikan untuk jawaban form dan hasil scan wajah tertentu, apa dasarnya, dan kapan sebuah minyak tidak boleh direkomendasikan.

Data siap pakai untuk kode ada di `data/oil-recommendations.json`. Jika dokumen ini dan JSON berbeda, perbarui keduanya bersamaan.

---

## 1. Prinsip yang tidak boleh dilanggar

1. **Aromaterapi mendukung suasana dan kenyamanan, bukan pengobatan.** Jangan memakai kata "menyembuhkan", "mengobati", atau "terapi untuk penyakit" di UI, hasil rekomendasi, maupun jawaban AI.
2. **Kekuatan bukti berbeda-beda.** Lavender punya bukti terbaik untuk rileks dan tidur, tetapi efeknya tetap kecil sampai sedang. Banyak aroma lain hanya punya bukti awal atau tradisi pemakaian. Sebut ini dengan jujur (lihat bagian 3).
3. **Scan wajah hanya sinyal pendukung.** Ekspresi wajah bukan indikator emosi yang andal (Barrett dkk., 2019). Bobotnya harus lebih kecil daripada jawaban form, dan hasilnya disebut "perkiraan ekspresi", bukan "mood kamu".
4. **Filter keamanan selalu menang.** Skor setinggi apa pun tidak boleh menampilkan produk yang melanggar aturan di bagian 6.
5. **Jangan menampilkan persentase yang terlalu pasti.** Beri batas atas 95% dan beri label "kecocokan aroma", bukan "tingkat keampuhan".
6. **Nama produk bukan klaim.** Beberapa nama produk Aromansa (misalnya "Deep Sleep") bersifat deskriptif. Konsultan AI boleh menyebut nama produk apa adanya, tetapi tidak boleh mengulanginya sebagai janji hasil (misalnya "pasti tidur nyenyak").

---

## 2. Data input

### 2.1 Form (nilai sesuai atribut `value` di `ar-mood-scan.html`)

| Field | Nilai |
|---|---|
| `age` | `under-18`, `18-25`, `26-35`, `36-45`, `46-plus` |
| `concerns` (multi) | `stress`, `sleep-deprived`, `anxious`, `tired`, `unfocused`, `low-mood`, `headache`, `relax` |
| `stress` | angka 1-10 |
| `sleep` | `under-4`, `4-6`, `6-8`, `over-8` |
| `scents` (multi) | `floral`, `citrus`, `woody`, `herbal`, `sweet` |
| `avoid` | teks bebas (alergi/sensitivitas) |

### 2.2 Hasil scan (label sesuai `ar-mood-scan.js`)

Ekspresi mentah: `neutral`, `happy`, `sad`, `angry`, `fearful`, `surprised`, `tired`.
Untuk rekomendasi, ekspresi dikelompokkan menjadi lima kategori:

| Kategori | Dibentuk dari |
|---|---|
| `tense` | `angry` atau `fearful` (yang lebih tinggi) |
| `tired` | `tired` (kelopak mata menurun) |
| `sad` | `sad` |
| `happy` | `happy` |
| `neutral` | `neutral` dan `surprised` |

---

## 3. Profil minyak

Tingkat bukti: **Sedang** = ada beberapa uji klinis kecil/sistematik review dengan hasil cukup konsisten. **Awal** = studi kecil atau hasil beragam. **Tradisional** = terutama berdasarkan pemakaian turun-temurun dan preferensi aroma.

### 3.1 Produk yang masuk engine rekomendasi

Format: **10 ml** = botol essential oil, **Roll-On** = 10 ml, **Spray** = 100 ml (linen/ruangan). Harga mengacu pada tampilan toko per 22 Oktober 2026 dan bisa berubah; **jangan menulis harga di logika rekomendasi**, ambil dari katalog toko.

| ID | Produk | Format & harga | Keluarga aroma | Cocok untuk | Tingkat bukti |
|---|---|---|---|---|---|
| `lavender-oil` | Lavender Essential Oil | 10 ml, Rp65.000 | Floral lembut, sedikit herbal | `anxious`, `stress`, `sleep-deprived`, `relax` | Sedang untuk rileks dan kualitas tidur |
| `lavender-spray` | Lavender Linen Deep Sleep Spray | Spray 100 ml, Rp60.000 | Floral lembut | `sleep-deprived`, `relax`, `anxious` | Sama dengan lavender; format linen/ruangan |
| `sweet-orange` | Sweet Orange Essential Oil | 10 ml, Rp45.000 | Citrus manis | `low-mood`, `relax`, `stress` ringan | Awal (studi ruang tunggu dokter gigi) |
| `lemon` | Lemon Essential Oil | 10 ml, harga belum tercatat | Citrus bersih | `unfocused`, `tired`, `low-mood` | Awal; terutama preferensi "segar" |
| `peppermint-oil` | Peppermint Essential Oil | 10 ml, Rp55.000 | Mint herbal | `unfocused`, `tired`, `headache` (tegang) | Awal untuk kewaspadaan; sedang untuk sakit kepala tegang pada pemakaian topikal terencerkan |
| `peppermint-rollon` | Peppermint Roll-On | Roll-On 10 ml, Rp30.000 | Mint herbal | `headache`, `unfocused`, `tired` | Sama dengan peppermint; format topikal |
| `peppermint-spray` | Peppermint Linen Fresh Spray | Spray 100 ml, Rp60.000 | Mint herbal | `tired`, `unfocused` | Awal; format linen/ruangan, **bukan untuk kulit** |
| `spearmint` | Spearmint Essential Oil | 10 ml, Rp55.000 | Mint manis, lebih lembut dari peppermint | `unfocused`, `tired` | Awal/tradisional |
| `eucalyptus` | Eucalyptus Essential Oil | 10 ml, Rp40.000 | Segar, kamfer, herbal | `tired`, `unfocused` | Awal/tradisional; terutama sensasi lega di hidung |
| `lemongrass` | Lemongrass Essential Oil | 10 ml, Rp45.000 | Citrus herbal, tajam | `tired`, `unfocused`, `stress` ringan | Awal/tradisional |
| `palmarosa` | Palmarosa Essential Oil | 10 ml, Rp75.000 | Floral hijau, mirip mawar-geranium | `relax`, `stress`, `anxious` ringan, `low-mood` ringan | Tradisional; belum ada bukti klinis yang kuat |
| `ylang-ylang` | Ylang-Ylang Essential Oil | 10 ml, Rp70.000 | Floral manis, pekat | `stress`, `anxious`, `relax`, `low-mood` | Awal (studi kecil inhalasi dan tekanan darah) |
| `frangipani` | Frangipani Essential Oil | 10 ml, Rp75.000 | Floral tropis | `relax`, `stress` | Tradisional; **tidak ada bukti klinis** |

### 3.2 Produk di katalog yang tidak masuk engine mood

| ID | Produk | Alasan |
|---|---|---|
| `gandapura-rollon` | Gandapura Roll-On (Roll-On 10 ml, Rp30.000) | Gandapura (wintergreen) dikenal karena sensasi hangat untuk badan pegal, **bukan untuk mood**. Biasanya mengandung metil salisilat, yang punya aturan keamanan tersendiri (lihat bagian 6). **Jangan** dipasangkan dengan `headache` atau kondisi mood apa pun. Jika user bertanya langsung tentang produk ini, jelaskan fungsi umumnya dan arahkan ke label/SDS. |

Catatan: Tea Tree tidak ada di katalog saat ini dan sudah dihapus dari dokumen ini. Jika produk itu masuk lagi, perlakukan seperti `gandapura-rollon`: fungsi utamanya bukan mood, jangan dimasukkan ke engine.

### 3.3 Catatan penting per minyak

- **Lavender.** Bukti terbaik di antara semua minyak di katalog. Ulasan sistematis tentang inhalasi minyak esensial untuk tidur (Lillehei & Halcon, 2014) menunjukkan manfaat kecil, terutama lavender. Jangan menjanjikan "tidur nyenyak". Untuk **Lavender Linen Deep Sleep Spray**, pakai pada linen/bantal dari jarak yang wajar, jangan disemprotkan ke wajah atau kulit, dan ikuti petunjuk label.
- **Sweet Orange.** Dipakai di studi ruang tunggu dokter gigi dengan hasil kecemasan dan mood lebih baik (Lehrner dkk., 2005). Bersifat **tidak fototoksik** pada umumnya, tetapi limonen yang teroksidasi bisa memicu alergi kulit, jadi simpan di tempat sejuk dan tertutup.
- **Lemon.** Jika berupa **cold-pressed**, minyak ini **fototoksik**: hindari paparan matahari langsung pada kulit yang diolesi minimal 12 jam. Aman dari risiko ini bila untuk diffuser saja. Konfirmasi jenis pengolahan (cold-pressed atau suling) dari pemasok.
- **Peppermint (oil, roll-on, spray).** Studi klasik memakai larutan 10% dalam etanol pada dahi dan pelipis untuk sakit kepala tegang (Göbel dkk., 1994). Itu **bukan** dosis aman untuk roll-on umum; ikuti dilusi di bagian 5. Mentol dapat memicu gangguan napas pada bayi dan anak kecil bila dioles dekat wajah. Karena menyegarkan, skornya diturunkan pada malam hari.
- **Peppermint Linen Fresh Spray.** Hanya untuk linen/ruangan. Jangan direkomendasikan untuk `headache` (itu tugas roll-on) dan jangan dipakai di kamar bayi/balita.
- **Spearmint.** Mengandung karvon, bukan mentol dominan, jadi aromanya lebih manis dan lembut. Tetap diperlakukan konservatif seperti keluarga mint: disaring untuk anak, asma, epilepsi, dan bayi/balita sampai ada data keamanan khusus dari pemasok. Bukti untuk fokus/kewaspadaan hampir seluruhnya berasal dari studi ekstrak yang diminum, jadi **tidak bisa** diklaim untuk aromaterapi.
- **Eucalyptus.** Aroma segar yang memberi sensasi lega di hidung. Kandungan utamanya sineol (1,8-cineole) bisa memengaruhi napas anak kecil dan dikaitkan dengan kewaspadaan pada penderita epilepsi. **Pastikan spesies (misalnya *globulus* atau *radiata*) dari pemasok**, karena kadar sineol berbeda. Jangan dioles di wajah.
- **Lemongrass.** Kaya sitral, yang termasuk pemicu sensitisasi kulit; dilusi paling rendah di tabel bagian 5. Aroma kuat dan tajam, bisa terasa "terlalu" bila diffuser terlalu lama. Hindari saat hamil dan di sekitar hewan peliharaan. Untuk user yang menghindari citrus, pertimbangkan menyembunyikannya juga (lihat 6.2).
- **Palmarosa.** Aroma floral hijau mirip mawar/geranium; di aromaterapi dikenal lembut dan sering dipakai untuk perawatan kulit. Dalam konteks mood, dasarnya **tradisional**; beri skor sedang-rendah dan jangan menyebut manfaat klinis.
- **Ylang-Ylang.** Dua studi kecil melaporkan efek menenangkan dan penurunan tekanan darah setelah inhalasi/topikal (Hongratanaworakit & Buchbauer, 2004), tetapi sampelnya sedikit. Aromanya kuat; pemakaian berlebihan sering memicu sakit kepala atau mual. Risiko sensitisasi kulit lebih tinggi, jadi dilusinya paling rendah.
- **Frangipani.** Minyak frangipani (Plumeria) jarang berupa minyak esensial hasil penyulingan uap; banyak yang berupa absolut atau campuran. **Pastikan jenis bahan dan sertifikat keamanan (SDS/IFRA) dari pemasok.** Sampai itu jelas, perlakukan sebagai pilihan aroma saja, tanpa klaim manfaat.
- **Gandapura Roll-On.** Lihat bagian 3.2 dan 6.3. Tidak ikut scoring.

---

## 4. Aturan rekomendasi

### 4.1 Kondisi (form) → minyak

Skor kecocokan dasar, skala 0 sampai 1. Tanda "-" berarti tidak direkomendasikan untuk kondisi itu.

| Produk | stress | anxious | sleep-deprived | relax | tired | unfocused | low-mood | headache |
|---|---|---|---|---|---|---|---|---|
| `lavender-oil` | 1.0 | 1.0 | 1.0 | 0.9 | 0.2 | - | 0.3 | - |
| `lavender-spray` | 0.6 | 0.7 | 0.9 | 0.8 | - | - | - | - |
| `sweet-orange` | 0.5 | 0.4 | 0.2 | 0.6 | 0.6 | 0.2 | 1.0 | - |
| `lemon` | - | - | - | - | 0.8 | 0.9 | 0.8 | - |
| `peppermint-oil` | - | - | - | - | 1.0 | 1.0 | - | 0.8 |
| `peppermint-rollon` | - | - | - | - | 0.8 | 0.8 | - | 1.0 |
| `peppermint-spray` | - | - | - | - | 0.6 | 0.6 | - | - |
| `spearmint` | - | - | - | - | 0.7 | 0.8 | - | - |
| `eucalyptus` | - | - | - | - | 0.6 | 0.6 | - | - |
| `lemongrass` | 0.3 | - | - | - | 0.5 | 0.5 | - | - |
| `palmarosa` | 0.5 | 0.4 | - | 0.7 | - | - | 0.4 | - |
| `ylang-ylang` | 0.8 | 0.7 | 0.3 | 0.8 | - | - | 0.6 | - |
| `frangipani` | 0.6 | 0.5 | 0.3 | 0.8 | - | - | - | - |

Angka untuk `peppermint-spray`, `spearmint`, `eucalyptus`, `lemongrass`, dan `palmarosa` adalah **usulan awal** karena belum ada data uji yang kuat; sesuaikan setelah ada umpan balik pengguna atau data tambahan.

Kondisi `sleep-deprived` bermakna "kurang tidur" dan mendorong aroma menenangkan agar bisa beristirahat; bukan aroma yang membuat melek.

### 4.2 Preferensi aroma

Tiap minyak punya tag aroma. Jika user memilih aroma yang cocok dengan tag, tambahkan skor preferensi.

| Minyak | Tag aroma |
|---|---|
| Lavender, Lavender Linen Deep Sleep Spray | `floral`, `herbal` |
| Sweet Orange | `citrus`, `sweet` |
| Lemon | `citrus` |
| Lemongrass | `citrus`, `herbal` |
| Peppermint (oil, roll-on, spray) | `herbal` |
| Spearmint | `herbal`, `sweet` |
| Eucalyptus | `herbal` |
| Palmarosa | `floral`, `herbal` |
| Ylang-Ylang | `floral`, `sweet` |
| Frangipani | `floral`, `sweet` |

> **Celah katalog:** form menawarkan **Woody**, tetapi saat ini tidak ada minyak berkarakter woody di katalog Aromansa. Di kode lama, Peppermint diberi tag `woody`, dan itu keliru (peppermint tidak berkarakter woody). Hapus tag itu. Jika user hanya memilih `woody`, tampilkan rekomendasi terbaik berdasarkan kondisi dan beri catatan "Belum ada aroma woody di koleksi kami saat ini". Kalau mau mengisi celah ini, pertimbangkan cedarwood atau sandalwood, setelah memeriksa kualitas dan keamanan dari pemasok. Eucalyptus dan Palmarosa **bukan** pengganti woody.

### 4.3 Konteks (stres, tidur, waktu)

| Kondisi | Aturan |
|---|---|
| Stres 7-10 | Naikkan skor minyak penenang (`lavender-oil`, `lavender-spray`, `ylang-ylang`, `frangipani`, `palmarosa`) sebesar +0.15 |
| Stres 1-3 | Tidak ada penyesuaian |
| Tidur `under-4` atau `4-6` | Naikkan `lavender-oil` dan `lavender-spray` +0.10 untuk pemakaian malam. Pagi hari, `sweet-orange` dan `lemon` boleh naik +0.10 |
| Pukul 18.00 ke atas, atau user punya `sleep-deprived` | Kurangi semua minyak penyegar (`peppermint-oil`, `peppermint-rollon`, `peppermint-spray`, `spearmint`, `eucalyptus`, `lemon`, `lemongrass`) sebesar -0.30, karena aroma yang menyegarkan dapat mengganggu persiapan tidur |
| Pagi hingga siang | Tidak ada penyesuaian waktu |

### 4.4 Scan wajah → minyak

Gunakan sebagai **tie-breaker**, bukan penentu utama.

| Kategori ekspresi | Minyak yang naik | Alasan singkat |
|---|---|---|
| `tense` | lavender, ylang-ylang, frangipani | Ekspresi tegang cocok dengan aroma penenang |
| `tired` | lemon, peppermint, sweet orange | Mata sayu cocok dengan aroma penyegar (pagi/siang) |
| `tired` (malam) | lavender, lavender-spray | Pada malam hari, lelah berarti perlu istirahat |
| `sad` | sweet orange, lemon, lavender | Citrus untuk suasana cerah, lavender untuk menenangkan |
| `happy` | sweet orange, frangipani | Menjaga suasana rileks yang sudah ada |
| `neutral` | tidak ada | Ikuti form sepenuhnya |

"Peppermint" di tabel berlaku untuk `peppermint-oil` dan `peppermint-spray`; `peppermint-rollon` hanya ikut naik bila user memilih `headache`.

Bobot sinyal scan turun menjadi 0 jika: wajah tidak stabil terdeteksi, pencahayaan buruk, jumlah frame valid di bawah 30% dari durasi scan, atau user memilih "Lanjut tanpa scan".

### 4.5 Rumus akhir

```
formScore  = 0.50 * concernMatch + 0.25 * scentMatch + 0.25 * contextMatch
finalScore = 0.70 * formScore    + 0.30 * scanScore      (scanScore = 0 bila scan tidak valid, bobot jadi 1.0 untuk form)
```

Kode lama memakai 0.6 untuk form dan 0.4 untuk scan. Sebaiknya turunkan bobot scan ke 0.3 sesuai alasan di bagian 1.

Urutan akhir: hapus produk yang gagal filter keamanan, urutkan `finalScore`, tampilkan 1 utama dan 2 alternatif. **Satu keluarga aroma hanya boleh muncul sekali**: jika dua produk berasal dari minyak yang sama (`lavender-oil` dan `lavender-spray`; `peppermint-oil`, `peppermint-rollon`, dan `peppermint-spray`), jangan tampilkan keduanya sebagai utama dan alternatif sekaligus. Pilih format yang paling cocok dengan kebutuhan (roll-on untuk `headache`, spray untuk tidur/linen).

---

## 5. Aturan pemakaian dan dilusi

Dilusi untuk kulit dewasa sehat, pemakaian oles sekali-sekali. Angka ini konservatif dan bersumber dari pedoman keamanan yang umum dipakai (Tisserand & Young, 2014). **Selalu lakukan uji tempel 24 jam.**

| Minyak | Dilusi maksimum di kulit | Catatan |
|---|---|---|
| Lavender | 1-2% | Sekitar 6-12 tetes per 30 ml carrier oil |
| Sweet Orange | 1-2% | Lihat catatan teroksidasi |
| Lemon (cold-pressed) | 1-2% | Hindari matahari minimal 12 jam |
| Peppermint | maks. 1-2% untuk roll-on umum | Hindari area mata dan wajah |
| Spearmint | maks. 1% | Konservatif; hindari area mata dan wajah |
| Eucalyptus | maks. 1-2% | Hindari wajah; periksa spesies |
| Lemongrass | maks. 0.7% | Sitral memicu sensitisasi kulit |
| Palmarosa | 1-2% | Konservatif |
| Ylang-Ylang | maks. 0.8% | Risiko sensitisasi lebih tinggi |
| Frangipani | Ikuti SDS pemasok | Jenis bahan belum jelas |

Untuk produk jadi (roll-on dan spray), **ikuti petunjuk dan dilusi di label**. Jangan memberi angka tetes untuk produk jadi. Spray linen (Lavender dan Peppermint) hanya untuk kain/ruangan, bukan untuk kulit atau wajah.

Pemakaian umum: diffuser 30-60 menit lalu jeda dengan ruangan berventilasi, tisu atau inhalasi singkat, dan oles terencerkan. **Jangan ditelan.**

---

## 6. Filter keamanan (wajib, jalankan sebelum scoring)

### 6.1 Berdasarkan usia

| Usia | Aturan |
|---|---|
| `under-18` | Hanya tawarkan `lavender-oil` dan `sweet-orange` untuk diffuser, dan `lavender-spray` untuk linen. **Jangan** tawarkan roll-on, spray peppermint, `peppermint-*`, `spearmint`, `eucalyptus`, `lemongrass`, `ylang-ylang`, atau pemakaian oles. Produk lain di katalog ikut disaring. Sarankan didampingi orang tua/wali. |
| `46-plus` | Tidak ada pembatasan khusus, tetapi ingatkan uji tempel karena kulit dapat lebih sensitif |

### 6.2 Berdasarkan alergi/sensitivitas (field `avoid`)

1. Normalisasi teks: huruf kecil, hapus tanda baca.
2. Cocokkan dengan kata kunci per minyak dan keluarganya:

| Minyak/keluarga | Kata kunci |
|---|---|
| Lavender | `lavender`, `lavendel` |
| Citrus | `jeruk`, `citrus`, `orange`, `lemon` (menyembunyikan `sweet-orange` dan `lemon`) |
| Lemongrass | `serai`, `sereh`, `lemongrass`; juga ikut disembunyikan bila user menulis `citrus`/`jeruk` (konservatif, karena sitral dan limonen sering memicu reaksi serupa) |
| Mint | `mint`, `permen`, `peppermint`, `spearmint`, `mentol` (menyembunyikan semua `peppermint-*` dan `spearmint`) |
| Eucalyptus | `eucalyptus`, `eukaliptus`, `kayu putih` (kata "kayu putih" dipakai sehari-hari, jadi sembunyikan eucalyptus untuk berjaga-jaga) |
| Palmarosa | `palmarosa` |
| Ylang-Ylang | `ylang`, `kenanga` |
| Frangipani | `frangipani`, `kamboja` |
| Gandapura | `gandapura`, `wintergreen`, `salisilat`, `aspirin` |
| Bunga | `bunga`, `floral` (menyembunyikan lavender, palmarosa, ylang-ylang, frangipani) |

3. Jika cocok, **sembunyikan minyak itu** dan tampilkan peringatan.
4. Jika user menulis sesuatu yang tidak dikenali ("tidak cocok wangi tertentu"), tetap tampilkan peringatan: "Periksa komposisi terlebih dahulu dan hentikan pemakaian jika muncul reaksi."

### 6.3 Kondisi khusus (field yang belum ada, **sangat disarankan ditambah**)

Tambahkan satu pertanyaan opsional "Apakah salah satu berlaku?" dengan pilihan di bawah.

| Pilihan | Aturan |
|---|---|
| Hamil atau menyusui | Hanya tampilkan saran umum dengan **diffuser** ringan, dan sarankan konsultasi dokter/bidan lebih dulu. Jangan tampilkan roll-on atau pemakaian oles. Sembunyikan `lemongrass` dan jangan tampilkan `gandapura-rollon`. |
| Asma atau gangguan napas | Hilangkan `peppermint-*`, `spearmint`, dan `eucalyptus`. Aroma kuat dapat memicu sesak pada sebagian orang. |
| Epilepsi | Hilangkan `eucalyptus`, `peppermint-*`, dan `spearmint`; sarankan konsultasi dokter. |
| Ada bayi/balita di rumah | Hilangkan `peppermint-*`, `spearmint`, dan `eucalyptus`. Jangan gunakan di kamar anak. Simpan semua produk, termasuk `gandapura-rollon`, di tempat yang tidak terjangkau. |
| Ada kucing/anjing | Beri peringatan: banyak minyak (termasuk ylang-ylang, peppermint, eucalyptus, lemongrass, citrus) beracun bagi hewan. Pakai diffuser di ruang berventilasi dan beri hewan jalan keluar. |
| Kulit sangat sensitif/eksim | Hanya tampilkan pemakaian diffuser dan inhalasi. Sembunyikan `lemongrass`. |
| Minum pengencer darah (antikoagulan) atau alergi aspirin | Tidak merekomendasikan `gandapura-rollon`; sarankan tanya dokter/apoteker bila user menanyakannya. |

### 6.4 Kasus yang perlu diarahkan ke bantuan profesional

Tampilkan kotak pesan lembut ("Jika perasaan ini terus berlanjut, pertimbangkan berbicara dengan tenaga profesional") bila salah satu terpenuhi:

- `stress` 9-10, atau
- `stress` 7-10 **dan** (`low-mood` atau `anxious`) **dan** `sleep` = `under-4`.

Pesan ini muncul **di samping** rekomendasi, bukan menggantikannya, dan tidak boleh berbunyi seperti diagnosis.

### 6.5 Sakit kepala

`headache` hanya boleh dipasangkan dengan `peppermint-rollon` atau inhalasi ringan (`peppermint-oil`). **Jangan** menampilkan `gandapura-rollon` atau spray linen untuk `headache`. Jika user menyebut sakit kepala hebat mendadak, disertai demam, mual terus-menerus, penglihatan terganggu, atau kelemahan, hentikan rekomendasi dan sarankan segera ke layanan kesehatan.

---

## 7. Contoh skenario

| Input | Output yang diharapkan |
|---|---|
| 26-35, `anxious` + `sleep-deprived`, stres 8, tidur 4-6 jam, suka `floral`, scan `tense`, pukul 21.00 | **Utama:** Lavender Essential Oil. **Alternatif:** Lavender Linen Deep Sleep Spray (format berbeda; boleh bila skornya cukup tinggi, tetapi lihat aturan satu keluarga di 4.5) dan Ylang-Ylang. Semua minyak penyegar dikurangi karena malam hari. Tampilkan catatan bantuan profesional bila ada `low-mood`. |
| 18-25, `unfocused` + `tired`, stres 4, tidur 6-8 jam, suka `citrus` + `herbal`, scan `tired`, pukul 09.00 | **Utama:** Lemon atau Peppermint (selisih tipis; scan `tired` menaikkan keduanya). **Alternatif:** Sweet Orange atau Spearmint. |
| `under-18`, `headache`, suka `herbal` | Semua minyak mint dan roll-on disaring. Tampilkan Lavender (diffuser) dengan saran bicara dengan orang tua/wali dan dokter bila sakit kepala sering terjadi. |
| 36-45, `relax`, avoid "lavender, jeruk", suka `floral` | Lavender, Sweet Orange, Lemon, dan Lemongrass disembunyikan. **Utama:** Palmarosa, Frangipani, atau Ylang-Ylang; tampilkan peringatan alergi. |
| 26-35, `tired`, ada asma, pagi hari, suka `herbal` | Semua mint dan Eucalyptus disaring. **Utama:** Lemon atau Sweet Orange (diffuser ringan). Lemongrass boleh muncul sebagai alternatif dengan catatan aroma kuat. |

---

## 8. Teks yang boleh dipakai di UI

**Penafian hasil rekomendasi:**
> Hasil ini berupa rekomendasi aroma berdasarkan preferensi dan perkiraan ekspresi wajahmu, bukan diagnosis atau saran medis. Essential oil bukan pengganti perawatan medis. Lakukan uji tempel sebelum dipakai di kulit dan hentikan pemakaian bila muncul reaksi.

**Label hasil scan (gunakan ini, jangan "mood kamu adalah"):**
> "Ekspresi yang paling terbaca: lelah. Ini hanya perkiraan, ya."

**Kata yang boleh:** "menemani", "membantu suasana terasa lebih tenang", "aroma yang terasa segar".
**Kata yang tidak boleh:** "menyembuhkan", "mengobati", "terapi", "menurunkan tekanan darah", "pasti cocok", "100% efektif", "tidur nyenyak dijamin".

> Pastikan juga klaim di listing dan kemasan produk sesuai ketentuan yang berlaku di Indonesia (misalnya izin edar BPOM untuk kategori produk yang relevan). Konsultasikan ke pihak yang berwenang sebelum menambahkan klaim manfaat.

---

## 9. Referensi

Periksa ulang kutipan sebelum dipublikasikan sebagai klaim di materi pemasaran. Daftar ini merujuk pada karya yang saya ketahui, tetapi detail penerbitan perlu diverifikasi langsung ke sumbernya.

1. Tisserand R, Young R. *Essential Oil Safety*, edisi ke-2. Churchill Livingstone; 2014. Acuan keamanan, dilusi, fototoksisitas.
2. Barrett LF dkk. Emotional expressions reconsidered: challenges to inferring emotion from human facial movements. *Psychological Science in the Public Interest*. 2019;20(1):1-68.
3. Lillehei AS, Halcon LL. A systematic review of the effect of inhaled essential oils on sleep. *Journal of Alternative and Complementary Medicine*. 2014;20(6):441-451.
4. Lehrner J dkk. Ambient odors of orange and lavender reduce anxiety and improve mood in a dental office. *Physiology & Behavior*. 2005;86(1-2):92-95.
5. Göbel H, Schmidt G, Soyka D. Effect of peppermint and eucalyptus oil preparations on neurophysiological and experimental algesimetric headache parameters. *Cephalalgia*. 1994;14(3):228-234.
6. Hongratanaworakit T, Buchbauer G. Evaluation of the harmonizing effect of ylang-ylang oil on humans after inhalation. *Planta Medica*. 2004;70(7):632-636.
7. Moss M dkk. Aromas of rosemary and lavender essential oils differentially affect cognition and mood in healthy adults. *International Journal of Neuroscience*. 2003;113(1):15-38.

---

*Terakhir diperbarui: 22 Oktober 2026 (disesuaikan dengan katalog Aromansa terkini). Dokumen ini adalah panduan produk, bukan nasihat medis.*
