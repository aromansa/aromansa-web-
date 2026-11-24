const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxmdsfzEzo_e_S42Cb-EFG_me6JifKr7hhdBUuUUHrPMyouK_zeUaoZh_7FmSbJEeBc-g/exec';
const SHEET_TOKEN = 'aromansa-scan-mood-ar';
const form = document.getElementById('mood-form');
const formStep = document.getElementById('form-step');
const onboardingStages = Array.from(form.querySelectorAll('[data-onboarding-stage]'));
const onboardingTitle = document.getElementById('form-title');
const onboardingHint = document.getElementById('onboarding-hint');
const onboardingStepLabel = document.getElementById('onboarding-step-label');
const onboardingPercent = document.getElementById('onboarding-percent');
const onboardingProgressFill = document.getElementById('onboarding-progress-fill');
const onboardingShortcut = document.getElementById('onboarding-shortcut');
const onboardingBackButton = document.getElementById('onboarding-back');
const onboardingNextButton = document.getElementById('onboarding-next');
const startButton = form.querySelector('.start-button');
const scanStep = document.getElementById('scan-step');
const resultsStep = document.getElementById('results-step');
const video = document.getElementById('camera-video');
const overlay = document.getElementById('face-overlay');
const overlayContext = overlay.getContext('2d');
const message = document.getElementById('app-message');
const statusLabel = document.getElementById('camera-status');
const hintLabel = document.getElementById('camera-hint');
const progressRing = document.getElementById('progress-ring');
const progressLabel = document.getElementById('progress-label');
const progressCircumference = 2 * Math.PI * 27;
const scanDuration = 6500;
const faceOval = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
const frameCanvas = document.createElement('canvas');
frameCanvas.width = 32;
frameCanvas.height = 24;
const frameContext = frameCanvas.getContext('2d', { willReadFrequently: true });

let answers = null;
let cameraStream = null;
let landmarker = null;
let animationFrame = null;
let scanElapsed = 0;
let lastFrameTime = 0;
let lastVideoTime = -1;
let expressionSamples = [];
let scanFrameCount = 0;
let transitionToken = 0;
let onboardingIndex = 0;

const productCatalogMeta = {
    'lavender-oil': { price: 65000, priceFormatted: 'Rp65.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81ztc-muiy4o5hhr0j8a@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'lavender-spray': { price: 60000, priceFormatted: 'Rp60.000', size: '100ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81ztq-muiy8d4xkxkz1a@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'sweet-orange': { price: 45000, priceFormatted: 'Rp45.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81ztn-muixuin3hyiw3c@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'lemon': { price: 45000, priceFormatted: 'Rp45.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81zte-muixuin3f5e083@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'peppermint-oil': { price: 55000, priceFormatted: 'Rp55.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81ztp-muiy4o5hc4qr32@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'peppermint-rollon': { price: 30000, priceFormatted: 'Rp30.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81ztm-muiy8d4xnqpvf7@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'peppermint-spray': { price: 60000, priceFormatted: 'Rp60.000', size: '100ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81zth-muiy4o5hndab9f@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'spearmint': { price: 55000, priceFormatted: 'Rp55.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81ztm-muiy4o5j4qv9dc@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'eucalyptus': { price: 40000, priceFormatted: 'Rp40.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81ztq-muixuin3nksode@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'lemongrass': { price: 45000, priceFormatted: 'Rp45.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81ztk-muixuin3krns17@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'palmarosa': { price: 75000, priceFormatted: 'Rp75.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81ztc-muiy4o5hexvna9@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'ylang-ylang': { price: 70000, priceFormatted: 'Rp70.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81ztg-muixuin3qdxk27@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'frangipani': { price: 75000, priceFormatted: 'Rp75.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81zto-muiy4o5hkk5fae@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' },
    'gandapura-rollon': { price: 30000, priceFormatted: 'Rp30.000', size: '10ml', img: 'https://down-id.img.susercontent.com/file/id-11134207-81zte-muiy8d4xqjur36@resize_w900_nl.webp', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' }
};

const recommendations = [
    {
        id: 'lavender-oil', name: 'Lavender Essential Oil', family: 'Floral lembut, sedikit herbal', oilFamily: 'lavender',
        concerns: { stress: 1, anxious: 1, 'sleep-deprived': 1, relax: .9, tired: .2, 'low-mood': .3 },
        scents: ['floral', 'herbal'], evidence: 'Sedang untuk rileks dan kualitas tidur',
        calm: true, refreshing: false,
        reason: 'Lavender memiliki dukungan bukti yang relatif lebih baik untuk menemani relaksasi dan kualitas tidur; efeknya tetap dapat berbeda pada setiap orang.',
        usage: 'Gunakan dengan diffuser 30–60 menit lalu beri jeda dan pastikan ruangan berventilasi. Untuk kulit dewasa sehat, encerkan 1–2% dan lakukan uji tempel 24 jam.'
    },
    {
        id: 'lavender-spray', name: 'Lavender Spray', family: 'Floral lembut', oilFamily: 'lavender',
        concerns: { stress: .6, anxious: .7, 'sleep-deprived': .9, relax: .8 },
        scents: ['floral', 'herbal'], evidence: 'Bukti lavender; format linen/ruangan',
        calm: true, refreshing: false, spray: true,
        reason: 'Pilihan praktis beraroma lavender untuk menemani suasana istirahat.',
        usage: 'Semprotkan pada linen atau bantal dari jarak wajar sesuai petunjuk label; jangan semprotkan ke wajah atau kulit.'
    },
    {
        id: 'sweet-orange', name: 'Sweet Orange Essential Oil', family: 'Citrus manis', oilFamily: 'sweet-orange',
        concerns: { stress: .5, anxious: .4, 'sleep-deprived': .2, relax: .6, tired: .6, unfocused: .2, 'low-mood': 1 },
        scents: ['citrus', 'sweet'], evidence: 'Awal',
        calm: false, refreshing: true, citrus: true,
        reason: 'Aroma citrus manis dapat menemani suasana ruang yang terasa lebih cerah; bukti yang tersedia masih awal.',
        usage: 'Gunakan dengan diffuser 30–60 menit lalu beri jeda dan pastikan ruangan berventilasi. Simpan minyak tertutup di tempat sejuk.'
    },
    {
        id: 'lemon', name: 'Lemon Essential Oil', family: 'Citrus bersih', oilFamily: 'lemon',
        concerns: { tired: .8, unfocused: .9, 'low-mood': .8 },
        scents: ['citrus'], evidence: 'Awal; terutama preferensi aroma segar',
        calm: false, refreshing: true, citrus: true,
        reason: 'Nuansa citrus bersih dapat menjadi pilihan aroma segar; dukungan bukti untuk suasana hati masih awal.',
        usage: 'Utamakan diffuser atau inhalasi singkat. Jika cold-pressed dan terkena kulit, hindari matahari langsung setidaknya 12 jam.'
    },
    {
        id: 'peppermint-oil', name: 'Peppermint Essential Oil', family: 'Mint herbal', oilFamily: 'peppermint',
        concerns: { tired: 1, unfocused: 1, headache: .8 },
        scents: ['herbal'], evidence: 'Awal untuk kewaspadaan; sedang untuk sakit kepala tegang pada pemakaian topikal terencerkan',
        calm: false, refreshing: true, mint: true,
        reason: 'Aroma mint segar dapat menemani ritual singkat saat ingin merasa lebih segar. Untuk sakit kepala, pilih inhalasi ringan; bukan pengganti saran medis.',
        usage: 'Gunakan diffuser atau inhalasi singkat. Hindari area mata dan wajah; jangan ditelan.'
    },
    {
        id: 'peppermint-rollon', name: 'Peppermint Roll-On', family: 'Mint herbal', oilFamily: 'peppermint',
        concerns: { tired: .8, unfocused: .8, headache: 1 },
        scents: ['herbal'], evidence: 'Awal untuk kewaspadaan; sedang untuk sakit kepala tegang pada pemakaian topikal terencerkan',
        calm: false, refreshing: true, mint: true, rollOn: true,
        reason: 'Format roll-on praktis untuk area tertentu saat kepala terasa tegang; bukti yang ada terbatas dan hasil tiap orang berbeda.',
        usage: 'Gunakan hanya sesuai petunjuk dan dilusi pada label. Hindari area mata dan wajah; jangan gunakan di dekat bayi atau balita.'
    },
    {
        id: 'peppermint-spray', name: 'Peppermint Spray', family: 'Mint herbal', oilFamily: 'peppermint',
        concerns: { tired: .6, unfocused: .6 },
        scents: ['herbal'], evidence: 'Awal; format linen/ruangan',
        calm: false, refreshing: true, mint: true, spray: true,
        reason: 'Aroma mint untuk menyegarkan linen atau ruangan; bukan untuk kulit dan tidak ditujukan untuk sakit kepala.',
        usage: 'Gunakan hanya pada kain atau ruangan sesuai petunjuk label. Jangan semprotkan ke kulit/wajah atau gunakan di kamar bayi/balita.'
    },
    {
        id: 'spearmint', name: 'Spearmint Essential Oil', family: 'Mint manis', oilFamily: 'spearmint',
        concerns: { tired: .7, unfocused: .8 },
        scents: ['herbal', 'sweet'], evidence: 'Awal/tradisional',
        calm: false, refreshing: true, mint: true,
        reason: 'Aroma mint yang lebih manis dan lembut dapat menemani pilihan aroma segar; bukti untuk aromaterapi masih terbatas.',
        usage: 'Gunakan dengan diffuser dan ventilasi yang baik. Untuk kulit, batasi hingga 1% dan hindari area mata/wajah.'
    },
    {
        id: 'eucalyptus', name: 'Eucalyptus Essential Oil', family: 'Segar, kamfer, herbal', oilFamily: 'eucalyptus',
        concerns: { tired: .6, unfocused: .6 },
        scents: ['herbal'], evidence: 'Awal/tradisional',
        calm: false, refreshing: true, eucalyptus: true,
        reason: 'Aromanya memberi sensasi segar dan lega di hidung; pastikan spesies minyak dari pemasok.',
        usage: 'Gunakan dengan diffuser dan ventilasi yang baik. Jangan oleskan pada wajah; periksa spesies dan petunjuk pemasok.'
    },
    {
        id: 'lemongrass', name: 'Lemongrass Essential Oil', family: 'Citrus herbal, tajam', oilFamily: 'lemongrass',
        concerns: { stress: .3, tired: .5, unfocused: .5 },
        scents: ['citrus', 'herbal'], evidence: 'Awal/tradisional',
        calm: false, refreshing: true, citrus: true, lemongrass: true,
        reason: 'Aroma citrus herbal yang kuat dapat menemani suasana segar; gunakan secara singkat dan tidak berlebihan.',
        usage: 'Utamakan diffuser singkat. Sitral dapat memicu sensitivitas kulit; batas dilusi kulit maksimal 0,7%.'
    },
    {
        id: 'palmarosa', name: 'Palmarosa Essential Oil', family: 'Floral hijau', oilFamily: 'palmarosa',
        concerns: { stress: .5, anxious: .4, relax: .7, 'low-mood': .4 },
        scents: ['floral', 'herbal'], evidence: 'Tradisional; belum ada bukti klinis yang kuat',
        calm: true, refreshing: false,
        reason: 'Aroma floral hijau dapat menjadi pilihan untuk ritual santai berdasarkan tradisi dan preferensi aroma.',
        usage: 'Gunakan dengan diffuser atau inhalasi singkat. Untuk kulit, encerkan 1–2% dan lakukan uji tempel 24 jam.'
    },
    {
        id: 'ylang-ylang', name: 'Ylang-Ylang Essential Oil', family: 'Floral manis, pekat', oilFamily: 'ylang-ylang',
        concerns: { stress: .8, anxious: .7, 'sleep-deprived': .3, relax: .8, 'low-mood': .6 },
        scents: ['floral', 'sweet'], evidence: 'Awal',
        calm: true, refreshing: false,
        reason: 'Aroma floral manis yang pekat dapat melengkapi suasana santai; bukti yang tersedia masih awal.',
        usage: 'Gunakan sedikit dengan diffuser dan beri jeda; aroma pekat dapat terasa berlebihan. Untuk kulit, batas dilusi maksimal 0,8%.'
    },
    {
        id: 'frangipani', name: 'Frangipani Essential Oil', family: 'Floral tropis', oilFamily: 'frangipani',
        concerns: { stress: .6, anxious: .5, 'sleep-deprived': .3, relax: .8 },
        scents: ['floral', 'sweet'], evidence: 'Tradisional; pilihan aroma tanpa bukti klinis',
        calm: true, refreshing: false,
        reason: 'Aroma floral tropis sebagai pilihan preferensi aroma; bukti klinis belum tersedia. Pastikan jenis bahan dan SDS pemasok.',
        usage: 'Gunakan dengan diffuser. Untuk kulit, ikuti SDS dan petunjuk pemasok.'
    }
];

const expressionLabels = [
    ['neutral', 'Netral'], ['happy', 'Senang'], ['sad', 'Sedih'],
    ['angry', 'Marah'], ['fearful', 'Takut'], ['surprised', 'Terkejut'], ['tired', 'Mata sayu']
];

async function saveSubmission(data) {
    const response = await fetch(SHEET_URL, {
        method: 'POST',
        body: JSON.stringify({
            ...data,
            token: SHEET_TOKEN,
            consent: true,
            website: data.website || ''
        })
    });
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || 'gagal_simpan');
    return result;
}

function sendRecommendationUpdate(recommendationsText) {
    if (!answers || !answers.phone || !recommendationsText) return;
    try {
        fetch(SHEET_URL, {
            method: 'POST',
            body: JSON.stringify({
                token: SHEET_TOKEN,
                action: 'update_recommendation',
                phone: answers.phone,
                recommendations: recommendationsText
            })
        }).catch(function (err) {
            console.warn('Could not update recommendations to sheet:', err);
        });
    } catch (_) {}
}

function trackProductAction(productName, actionLabel) {
    if (!answers || !answers.phone || !productName) return;
    try {
        fetch(SHEET_URL, {
            method: 'POST',
            body: JSON.stringify({
                token: SHEET_TOKEN,
                action: 'update_interaction',
                phone: answers.phone,
                selectedProduct: productName + ' (' + actionLabel + ')'
            })
        }).catch(function (err) {
            console.warn('Could not track interaction to sheet:', err);
        });
    } catch (_) {}
}

function getPreliminaryRecommendations() {
    if (!answers) return '';
    try {
        const avoidance = getBlockedRecommendations();
        const hour = new Date().getHours();
        const filtered = recommendations.filter(function (product) {
            if (avoidance.blocked.has(product.id)) return false;
            if ((answers.safety || []).includes('pregnancy') && product.lemongrass) return false;
            return true;
        });
        const ranked = filtered.map(function (product) {
            return Object.assign({}, product, {
                score: scoreRecommendation(product, null, false, hour)
            });
        }).sort(function (a, b) { return b.score - a.score; });
        const selected = [];
        const selectedFamilies = new Set();
        ranked.forEach(function (product) {
            if (selected.length >= 3 || selectedFamilies.has(product.oilFamily)) return;
            if (product.id === 'peppermint-rollon' && !answers.concerns.includes('headache')) return;
            if (product.id === 'peppermint-spray' && answers.concerns.includes('headache')) return;
            if (product.score <= 0) return;
            selected.push(product);
            selectedFamilies.add(product.oilFamily);
        });
        return selected.map(function (p, i) {
            return (i === 0 ? '[Utama] ' : '') + p.name;
        }).join(', ');
    } catch (e) {
        return '';
    }
}

document.getElementById('stress-level').addEventListener('input', function () {
    document.getElementById('stress-output').value = this.value;
});

form.addEventListener('input', syncSubmitAvailability);
form.addEventListener('change', syncSubmitAvailability);
form.addEventListener('input', syncOnboardingNavigationLabel);
form.addEventListener('change', syncOnboardingNavigationLabel);
onboardingBackButton.addEventListener('click', function () {
    showOnboardingStage(onboardingIndex - 1);
});
onboardingNextButton.addEventListener('click', function () {
    clearMessage();
    if (!validateOnboardingStage(onboardingStages[onboardingIndex])) return;
    showOnboardingStage(onboardingIndex + 1);
});
form.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && ['text', 'tel'].includes(event.target.type)) {
        event.preventDefault();
        if (onboardingIndex < onboardingStages.length - 1) onboardingNextButton.click();
    }
});
showOnboardingStage(0, false);
syncSubmitAvailability();

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearMessage();
    if (!validateForm()) return;

    const formData = new FormData(form);
    answers = {
        nickname: formData.get('nickname').trim(),
        phone: formData.get('phone').trim(),
        age: formData.get('age'),
        concerns: formData.getAll('concerns'),
        stress: Number(formData.get('stress')),
        sleep: formData.get('sleep'),
        scents: formData.getAll('scents'),
        allergies: formData.get('allergies').trim(),
        safety: formData.getAll('safety')
    };

    const submitButton = form.querySelector('.start-button');
    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = 'Menyimpan data...';

    const initialRecs = getPreliminaryRecommendations();

    try {
        await saveSubmission({
            ...answers,
            recommendations: initialRecs,
            dataConsent: formData.has('data-consent'),
            cameraConsent: formData.has('consent'),
            website: formData.get('website')
        });

        submitButton.querySelector('span').textContent = 'Mulai Scan';
        syncSubmitAvailability();
        showMessage('Data formulir berhasil disimpan. Video kamera dan hasil analisis ekspresi tidak disimpan.');
        showStep('scan');
        startScan();
    } catch (error) {
        answers = null;
        showMessage(error.message || 'Data belum dapat disimpan. Periksa koneksi dan coba kembali.');
        submitButton.querySelector('span').textContent = 'Mulai Scan';
        syncSubmitAvailability();
    }
});

document.getElementById('cancel-scan').addEventListener('click', function () {
    stopCamera();
    resetProgress();
    showStep('form');
});

document.getElementById('scan-again').addEventListener('click', function () {
    answers = null;
    expressionSamples = [];
    form.reset();
    document.getElementById('stress-output').value = '5';
    showOnboardingStage(0, false);
    syncSubmitAvailability();
    syncOnboardingNavigationLabel();
    clearMessage();
    showStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function validateForm() {
    let valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
        let fieldValid = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
        if (field.name === 'phone') {
            const digits = field.value.replace(/\D/g, '');
            fieldValid = /^[+0-9() .-]{7,30}$/.test(field.value.trim()) && digits.length >= 7 && digits.length <= 15;
        }
        field.setAttribute('aria-invalid', String(!fieldValid));
        if (!fieldValid) valid = false;
    });

    ['concerns', 'scents'].forEach(function (groupName) {
        const group = form.querySelector('[data-required-group="' + groupName + '"]');
        const checked = group.querySelectorAll('input:checked').length > 0;
        group.querySelector('[data-error-for="' + groupName + '"]').hidden = checked;
        if (!checked) valid = false;
    });

    if (!valid) {
        showMessage('Lengkapi semua data wajib dan persetujuan sebelum memulai scan.');
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
    }
    return valid;
}

function validateOnboardingStage(stage) {
    let valid = true;
    stage.querySelectorAll('[required]').forEach(function (field) {
        const fieldValid = isFieldValid(field);
        field.setAttribute('aria-invalid', String(!fieldValid));
        if (!fieldValid) valid = false;
    });

    stage.querySelectorAll('[data-required-group]').forEach(function (group) {
        const checked = group.querySelector('input:checked') !== null;
        const error = group.querySelector('.field-error');
        if (error) error.hidden = checked;
        if (!checked) valid = false;
    });

    if (!valid) {
        showMessage('Lengkapi bagian wajib ini sebelum melanjutkan.');
        const invalidGroup = Array.from(stage.querySelectorAll('[data-required-group]')).find(function (group) {
            return group.querySelector('input:checked') === null;
        });
        const firstInvalid = stage.querySelector('[aria-invalid="true"]') || (invalidGroup && invalidGroup.querySelector('input'));
        if (firstInvalid) firstInvalid.focus();
    }
    return valid;
}

function isFieldValid(field) {
    let fieldValid = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
    if (field.name === 'phone') {
        const digits = field.value.replace(/\D/g, '');
        fieldValid = /^[+0-9() .-]{7,30}$/.test(field.value.trim()) && digits.length >= 7 && digits.length <= 15;
    }
    return fieldValid;
}

function showOnboardingStage(index, focus = true) {
    if (index < 0 || index >= onboardingStages.length) return;
    onboardingIndex = index;
    onboardingStages.forEach(function (stage, stageIndex) {
        const isActive = stageIndex === index;
        stage.hidden = !isActive;
        stage.classList.toggle('is-active', isActive);
        stage.setAttribute('aria-hidden', String(!isActive));
    });

    const currentStage = onboardingStages[index];
    const progress = Math.round(((index + 1) / onboardingStages.length) * 100);
    onboardingTitle.textContent = currentStage.dataset.title;
    onboardingHint.textContent = currentStage.dataset.hint;
    onboardingStepLabel.textContent = 'LANGKAH ' + (index + 1) + ' DARI ' + onboardingStages.length;
    onboardingPercent.textContent = progress + '%';
    onboardingProgressFill.style.width = progress + '%';
    document.querySelector('.onboarding-progress').setAttribute('aria-valuenow', String(index + 1));
    onboardingBackButton.hidden = index === 0;
    onboardingNextButton.hidden = index === onboardingStages.length - 1;
    startButton.hidden = index !== onboardingStages.length - 1;
    onboardingShortcut.textContent = index === onboardingStages.length - 1
        ? 'Setujui kedua pilihan untuk mengaktifkan tombol scan.'
        : 'Tekan Enter untuk melanjutkan';
    syncOnboardingNavigationLabel();

    if (focus) {
        const firstControl = currentStage.querySelector('input:not([type="hidden"]), select, button');
        if (firstControl) firstControl.focus({ preventScroll: true });
    }
}

function syncOnboardingNavigationLabel() {
    if (!onboardingStages.length) return;
    const stage = onboardingStages[onboardingIndex];
    const required = stage.querySelector('[required], [data-required-group]') !== null;
    const hasAnswer = Array.from(stage.querySelectorAll('input:not([type="hidden"]), select')).some(function (field) {
        return field.type === 'checkbox' || field.type === 'radio'
            ? field.checked
            : field.value.trim() !== '';
    });
    const label = required || hasAnswer ? 'Lanjut' : 'Lewati';
    onboardingNextButton.innerHTML = label + ' <i class="fas fa-arrow-right" aria-hidden="true"></i>';
}

function syncSubmitAvailability() {
    const requiredFieldsValid = Array.from(form.querySelectorAll('[required]')).every(function (field) {
        const fieldValid = isFieldValid(field);
        if (field.hasAttribute('aria-invalid')) field.setAttribute('aria-invalid', String(!fieldValid));
        return fieldValid;
    });
    const requiredGroupsValid = ['concerns', 'scents'].every(function (groupName) {
        return form.querySelector('[data-required-group="' + groupName + '"]').querySelector('input:checked') !== null;
    });
    form.querySelector('.start-button').disabled = !(requiredFieldsValid && requiredGroupsValid);
    ['concerns', 'scents'].forEach(function (groupName) {
        const group = form.querySelector('[data-required-group="' + groupName + '"]');
        if (group.querySelector('input:checked')) {
            group.querySelector('[data-error-for="' + groupName + '"]').hidden = true;
        }
    });
}

async function startScan() {
    const token = ++transitionToken;
    setStatus('Meminta izin kamera...');
    setHint('Kamera hanya aktif selama proses scan berlangsung.');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return failScan('Browser ini belum mendukung akses kamera. Buka halaman melalui localhost atau HTTPS dan gunakan browser terbaru.');
    }

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { facingMode: { ideal: 'user' }, width: { ideal: 1280 }, height: { ideal: 960 } }
        });
        if (token !== transitionToken || document.hidden) return stopCamera();
        video.srcObject = cameraStream;
        await video.play();
        await waitForVideo();
        setStatus('Memuat analisis ekspresi...');
        setHint('Model berjalan di browser Anda; gambar tidak dikirim ke server.');
        landmarker = await loadFaceLandmarker();
        if (token !== transitionToken) return stopCamera();
        scanElapsed = 0;
        lastFrameTime = 0;
        expressionSamples = [];
        scanFrameCount = 0;
        lastVideoTime = -1;
        setStatus('Mendeteksi wajah...');
        animationFrame = requestAnimationFrame(processFrame);
    } catch (error) {
        if (token !== transitionToken) return;
        stopCamera();
        if (error && error.name === 'NotAllowedError') {
            failScan('Izin kamera belum diberikan. Izinkan kamera di pengaturan browser, lalu coba lagi.');
        } else if (error && (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError')) {
            failScan('Kamera tidak ditemukan. Sambungkan kamera atau gunakan perangkat yang memiliki kamera.');
        } else if (error && (error.name === 'NotReadableError' || error.name === 'TrackStartError')) {
            failScan('Kamera sedang digunakan aplikasi lain. Tutup aplikasi tersebut, lalu coba lagi.');
        } else {
            failScan('Kamera atau model analisis belum dapat dimulai. Pastikan koneksi internet tersedia dan coba lagi.');
        }
    }
}

async function loadFaceLandmarker() {
    const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm');
    const files = await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
    const options = {
        baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFaceBlendshapes: true
    };
    try {
        return await vision.FaceLandmarker.createFromOptions(files, options);
    } catch (error) {
        options.baseOptions.delegate = 'CPU';
        return vision.FaceLandmarker.createFromOptions(files, options);
    }
}

function waitForVideo() {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return Promise.resolve();
    return new Promise(function (resolve, reject) {
        video.addEventListener('loadeddata', resolve, { once: true });
        video.addEventListener('error', reject, { once: true });
    });
}

function processFrame(now) {
    if (!cameraStream || !landmarker) return;
    animationFrame = requestAnimationFrame(processFrame);
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.currentTime === lastVideoTime) return;
    lastVideoTime = video.currentTime;

    const result = landmarker.detectForVideo(video, now);
    const landmarks = result.faceLandmarks && result.faceLandmarks[0];
    clearOverlay();
    if (!landmarks) {
        lastFrameTime = 0;
        setStatus('Mendeteksi wajah...');
        setHint('Wajah belum terdeteksi. Hadapkan wajah ke kamera dan posisikan di tengah.');
        return;
    }

    const faceWidth = Math.max.apply(null, landmarks.map(function (point) { return point.x; })) - Math.min.apply(null, landmarks.map(function (point) { return point.x; }));
    const brightness = sampleBrightness();
    drawFaceOutline(landmarks);

    if (brightness < 48) {
        lastFrameTime = 0;
        setStatus('Pencahayaan kurang');
        setHint('Tambahkan cahaya dari depan agar wajah terlihat jelas.');
        return;
    }
    if (faceWidth < .18) {
        lastFrameTime = 0;
        setStatus('Wajah terlalu jauh');
        setHint('Mendekat sedikit ke kamera, lalu tahan posisi.');
        return;
    }

    if (!lastFrameTime) lastFrameTime = now;
    scanElapsed += Math.min(now - lastFrameTime, 100);
    lastFrameTime = now;
    const blendshapes = result.faceBlendshapes && result.faceBlendshapes[0];
    if (blendshapes) {
        expressionSamples.push(scoreExpressions(blendshapes.categories));
        scanFrameCount += 1;
    }
    const progress = Math.min(scanElapsed / scanDuration, 1);
    updateProgress(progress);
    setStatus(progress >= 1 ? 'Menyusun rekomendasi...' : 'Tahan posisi ' + Math.max(1, Math.ceil((scanDuration - scanElapsed) / 1000)) + ' detik');
    setHint('Wajah terlihat jelas. Tetap nyaman dan bernapas seperti biasa.');

    if (scanElapsed >= scanDuration) {
        cancelAnimationFrame(animationFrame);
        finishScan();
    }
}

function sampleBrightness() {
    frameContext.drawImage(video, 0, 0, frameCanvas.width, frameCanvas.height);
    const pixels = frameContext.getImageData(0, 0, frameCanvas.width, frameCanvas.height).data;
    let total = 0;
    for (let index = 0; index < pixels.length; index += 4) {
        total += .2126 * pixels[index] + .7152 * pixels[index + 1] + .0722 * pixels[index + 2];
    }
    const brightness = total / (pixels.length / 4);
    frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
    return brightness;
}

function drawFaceOutline(landmarks) {
    if (!video.videoWidth || !overlay.clientWidth) return;
    const width = overlay.clientWidth;
    const height = overlay.clientHeight;
    const ratio = Math.max(width / video.videoWidth, height / video.videoHeight);
    const offsetX = (width - video.videoWidth * ratio) / 2;
    const offsetY = (height - video.videoHeight * ratio) / 2;
    const pixelRatio = window.devicePixelRatio || 1;
    overlay.width = Math.round(width * pixelRatio);
    overlay.height = Math.round(height * pixelRatio);
    overlayContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    overlayContext.translate(width, 0);
    overlayContext.scale(-1, 1);
    overlayContext.beginPath();
    faceOval.forEach(function (index, position) {
        const point = landmarks[index];
        const x = point.x * video.videoWidth * ratio + offsetX;
        const y = point.y * video.videoHeight * ratio + offsetY;
        if (position === 0) overlayContext.moveTo(x, y);
        else overlayContext.lineTo(x, y);
    });
    overlayContext.closePath();
    overlayContext.strokeStyle = 'rgba(218, 239, 177, .92)';
    overlayContext.lineWidth = 1.5;
    overlayContext.shadowColor = 'rgba(212, 223, 159, .72)';
    overlayContext.shadowBlur = 8;
    overlayContext.stroke();
    overlayContext.setTransform(1, 0, 0, 1, 0, 0);
}

function clearOverlay() {
    overlayContext.clearRect(0, 0, overlay.width, overlay.height);
}

function scoreExpressions(categories) {
    const values = {};
    categories.forEach(function (category) { values[category.categoryName] = category.score; });
    const average = function (names) {
        return names.reduce(function (sum, name) { return sum + (values[name] || 0); }, 0) / names.length;
    };
    const clamp = function (value) { return Math.min(1, Math.max(0, value)); };
    const happy = clamp(average(['mouthSmileLeft', 'mouthSmileRight']) * 2.2);
    const sad = clamp((average(['mouthFrownLeft', 'mouthFrownRight']) * .9 + (values.browInnerUp || 0) * .45) * 1.5);
    const angry = clamp((average(['browDownLeft', 'browDownRight']) * .8 + average(['eyeSquintLeft', 'eyeSquintRight']) * .55 + average(['mouthPressLeft', 'mouthPressRight']) * .25) * 1.5);
    const fearful = clamp((average(['eyeWideLeft', 'eyeWideRight']) * .65 + (values.browInnerUp || 0) * .35) * 1.35);
    const surprised = clamp((average(['eyeWideLeft', 'eyeWideRight']) * .55 + (values.jawOpen || 0) * .8) * 1.45);
    const tired = clamp((average(['eyeBlinkLeft', 'eyeBlinkRight']) * .65 + average(['eyeSquintLeft', 'eyeSquintRight']) * .2 + average(['eyeLookDownLeft', 'eyeLookDownRight']) * .15) * 1.25);
    const neutral = clamp(1 - Math.max(happy, sad, angry, fearful, surprised, tired));
    return { neutral, happy, sad, angry, fearful, surprised, tired };
}

function updateProgress(progress) {
    const percentage = Math.round(progress * 100);
    progressLabel.textContent = percentage + '%';
    progressRing.style.strokeDashoffset = String(progressCircumference * (1 - progress));
}

function resetProgress() {
    scanElapsed = 0;
    lastFrameTime = 0;
    updateProgress(0);
}

function setStatus(text) {
    statusLabel.textContent = text;
}

function setHint(text) {
    hintLabel.textContent = text;
}

function stopCamera() {
    transitionToken += 1;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = null;
    if (cameraStream) cameraStream.getTracks().forEach(function (track) { track.stop(); });
    cameraStream = null;
    video.pause();
    video.srcObject = null;
    if (landmarker) landmarker.close();
    landmarker = null;
    clearOverlay();
    frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
}

function failScan(text) {
    stopCamera();
    showStep('form');
    showMessage(text);
}

function finishScan() {
    stopCamera();
    const expression = averageExpressions(expressionSamples);
    const minimumSamples = Math.ceil((scanDuration / 1000) * 30 * .3);
    renderResults(expression, scanFrameCount >= minimumSamples);
    showStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function averageExpressions(samples) {
    const totals = { neutral: 0, happy: 0, sad: 0, angry: 0, fearful: 0, surprised: 0, tired: 0 };
    if (!samples.length) return totals;
    samples.forEach(function (sample) {
        Object.keys(totals).forEach(function (key) { totals[key] += sample[key]; });
    });
    Object.keys(totals).forEach(function (key) { totals[key] = totals[key] / samples.length; });
    return totals;
}

function renderResults(expression, scanValid) {
    const topExpression = scanValid ? Object.keys(expression).reduce(function (best, key) {
        return expression[key] > expression[best] ? key : best;
    }, 'neutral') : 'neutral';
    document.getElementById('result-name').textContent = answers.nickname;
    const expressionLabel = expressionLabels.find(function (entry) { return entry[0] === expression; });
    const summary = scanValid
        ? 'Ekspresi yang paling terbaca: ' + (expressionLabel ? expressionLabel[1].toLowerCase() : 'netral') + '. Ini hanya perkiraan, ya. Rekomendasi terutama mengikuti jawaban dan preferensimu.'
        : 'Sinyal ekspresi belum cukup stabil untuk digunakan. Rekomendasi ini mengikuti jawaban dan preferensimu saja.';
    document.getElementById('mood-summary').textContent = summary;
    renderChart(expression, scanValid);
    renderRecommendations(expression, scanValid);
}

function renderChart(expression, scanValid) {
    const chartData = [
        ['neutral', 'Netral'], ['happy', 'Senang'], ['sad', 'Sedih'],
        ['angry', 'Marah'], ['fearful', 'Takut'], ['surprised', 'Terkejut'], ['tired', 'Mata sayu']
    ];
    const maxScore = Math.max.apply(null, chartData.map(function (entry) { return expression[entry[0]] || 0; }).concat([.12]));
    const chart = document.getElementById('mood-chart');
    chart.hidden = !scanValid;
    chart.setAttribute('aria-label', scanValid
        ? 'Perkiraan sinyal ekspresi wajah, bukan ukuran emosi'
        : 'Sinyal ekspresi tidak cukup stabil; chart tidak ditampilkan');
    chart.innerHTML = scanValid ? chartData.map(function (entry) {
        const score = expression[entry[0]] || 0;
        const width = Math.min(95, Math.max(3, Math.round(score / maxScore * 95)));
        return '<div class="mood-bar"><div class="mood-bar-label"><span>' + entry[1] + '</span></div><div class="mood-bar-track" role="img" aria-label="Sinyal ekspresi ' + entry[1].toLowerCase() + '"><div class="mood-bar-fill" style="width:' + width + '%"></div></div></div>';
    }).join('') : '';
}

function getBlockedRecommendations() {
    const blocked = new Set();
    const safety = answers.safety || [];
    const mintIds = ['peppermint-oil', 'peppermint-rollon', 'peppermint-spray', 'spearmint'];

    if (answers.age === 'under-18') {
        recommendations.forEach(function (product) {
            if (!['lavender-oil', 'lavender-spray', 'sweet-orange'].includes(product.id)) blocked.add(product.id);
        });
    }
    if (safety.includes('pregnancy')) {
        blocked.add('lemongrass');
        recommendations.filter(function (product) { return product.rollOn || product.spray; }).forEach(function (product) { blocked.add(product.id); });
    }
    if (safety.includes('respiratory') || safety.includes('epilepsy') || safety.includes('children')) {
        mintIds.concat(['eucalyptus']).forEach(function (id) { blocked.add(id); });
    }
    if (safety.includes('sensitive-skin')) {
        blocked.add('lemongrass');
        recommendations.filter(function (product) { return product.rollOn || product.spray; }).forEach(function (product) { blocked.add(product.id); });
    }

    const avoid = answers.allergies.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    const avoidanceRules = [
        { terms: ['lavender', 'lavendel'], ids: ['lavender-oil', 'lavender-spray'] },
        { terms: ['jeruk', 'citrus'], ids: ['sweet-orange', 'lemon', 'lemongrass'] },
        { terms: ['orange', 'lemon'], ids: ['sweet-orange', 'lemon'] },
        { terms: ['serai', 'sereh', 'lemongrass'], ids: ['lemongrass'] },
        { terms: ['mint', 'permen', 'peppermint', 'spearmint', 'mentol'], ids: mintIds },
        { terms: ['eucalyptus', 'eukaliptus', 'kayu putih'], ids: ['eucalyptus'] },
        { terms: ['palmarosa'], ids: ['palmarosa'] },
        { terms: ['ylang', 'kenanga'], ids: ['ylang-ylang'] },
        { terms: ['frangipani', 'kamboja'], ids: ['frangipani'] },
        { terms: ['bunga', 'floral'], ids: ['lavender-oil', 'lavender-spray', 'palmarosa', 'ylang-ylang', 'frangipani'] },
        { terms: ['gandapura', 'wintergreen', 'salisilat', 'aspirin'], ids: ['gandapura-rollon'] }
    ];
    let matchedAvoid = false;
    avoidanceRules.forEach(function (rule) {
        if (rule.terms.some(function (term) { return avoid.includes(term); })) {
            matchedAvoid = true;
            rule.ids.forEach(function (id) { blocked.add(id); });
        }
    });
    return { blocked: blocked, hasUnrecognizedAvoid: !!avoid && !matchedAvoid };
}

function getScanCategory(expression) {
    const categories = {
        tense: Math.max(expression.angry || 0, expression.fearful || 0),
        tired: expression.tired || 0,
        sad: expression.sad || 0,
        happy: expression.happy || 0,
        neutral: Math.max(expression.neutral || 0, expression.surprised || 0)
    };
    return Object.keys(categories).reduce(function (best, key) {
        return categories[key] > categories[best] ? key : best;
    }, 'neutral');
}

function scoreRecommendation(product, expression, scanValid, hour) {
    const concernScore = answers.concerns.reduce(function (total, concern) {
        return total + (product.concerns[concern] || 0);
    }, 0) / Math.max(answers.concerns.length, 1);
    const scentScore = answers.scents.filter(function (scent) { return product.scents.includes(scent); }).length
        / Math.max(answers.scents.length, 1);
    const contextScore = .5;
    let contextAdjustment = 0;
    if (answers.stress >= 7 && product.calm) contextAdjustment += .15;
    const shortSleep = answers.sleep === 'under-4' || answers.sleep === '4-6';
    if (shortSleep && hour >= 18 && product.oilFamily === 'lavender') contextAdjustment += .1;
    if (shortSleep && hour < 18 && product.citrus && ['sweet-orange', 'lemon'].includes(product.id)) contextAdjustment += .1;
    if ((hour >= 18 || answers.concerns.includes('sleep-deprived')) && product.refreshing) contextAdjustment -= .3;

    const formScore = .5 * concernScore + .25 * scentScore + .25 * contextScore;
    if (!scanValid) return Math.max(0, formScore + contextAdjustment);

    const category = getScanCategory(expression);
    if (category === 'neutral') return Math.max(0, formScore + contextAdjustment);
    const scanMatches = {
        tense: ['lavender-oil', 'lavender-spray', 'ylang-ylang', 'frangipani'],
        tired: hour >= 18
            ? ['lavender-oil', 'lavender-spray']
            : ['lemon', 'peppermint-oil', 'sweet-orange'],
        sad: ['sweet-orange', 'lemon', 'lavender-oil'],
        happy: ['sweet-orange', 'frangipani']
    }[category] || [];
    const expressionScore = category === 'tense'
        ? Math.max(expression.angry || 0, expression.fearful || 0)
        : expression[category] || 0;
    const scanScore = scanMatches.includes(product.id) ? expressionScore : 0;
    return Math.max(0, .7 * formScore + .3 * scanScore + contextAdjustment);
}

function getRecommendationNotices(avoidInfo) {
    const notices = [];
    const safety = answers.safety || [];
    const concerns = answers.concerns;
    if (answers.age === 'under-18') notices.push('Karena usia di bawah 18 tahun, pilihan dibatasi pada lavender atau sweet orange untuk diffuser, dan lavender spray untuk linen. Gunakan dengan pendampingan orang tua/wali.');
    if (answers.age === '46-plus') notices.push('Kulit dapat lebih sensitif seiring usia. Lakukan uji tempel 24 jam sebelum pemakaian pada kulit.');
    if (answers.allergies) notices.push(avoidInfo.hasUnrecognizedAvoid
        ? 'Preferensi sensitivitas Anda belum bisa dipetakan ke bahan tertentu. Periksa komposisi dan hentikan pemakaian jika muncul reaksi.'
        : 'Beberapa aroma disembunyikan berdasarkan sensitivitas yang Anda sebutkan. Periksa komposisi dan hentikan pemakaian jika muncul reaksi.');
    if (safety.includes('pregnancy')) notices.push('Saat hamil atau menyusui, pilih penggunaan diffuser ringan dan konsultasikan dahulu dengan dokter atau bidan. Hindari pemakaian topikal.');
    if (safety.includes('respiratory')) notices.push('Karena ada asma atau gangguan napas, minyak mint dan eucalyptus tidak ditampilkan. Hentikan paparan jika terasa mengganggu napas.');
    if (safety.includes('epilepsy')) notices.push('Karena ada epilepsi, minyak mint dan eucalyptus tidak ditampilkan. Konsultasikan pilihan aroma dengan dokter.');
    if (safety.includes('children')) notices.push('Karena ada bayi atau balita di rumah, minyak mint dan eucalyptus tidak ditampilkan. Hindari pemakaian di kamar anak dan simpan produk di tempat yang tidak terjangkau.');
    if (safety.includes('pets')) notices.push('Banyak minyak esensial dapat berisiko bagi hewan. Gunakan diffuser hanya di ruang berventilasi dan pastikan hewan dapat meninggalkan ruangan.');
    if (safety.includes('sensitive-skin')) notices.push('Karena kulit sangat sensitif atau eksim, saran dibatasi untuk diffuser atau inhalasi; hindari pemakaian topikal.');
    if (safety.includes('anticoagulants')) notices.push('Jika menggunakan pengencer darah atau memiliki alergi aspirin, konsultasikan pilihan produk dengan dokter atau apoteker.');
    if (answers.stress >= 9 || (answers.stress >= 7 && (concerns.includes('low-mood') || concerns.includes('anxious')) && answers.sleep === 'under-4')) {
        notices.push('Jika perasaan ini terus berlanjut, pertimbangkan berbicara dengan tenaga profesional.');
    }
    if (answers.scents.length === 1 && answers.scents[0] === 'woody') notices.push('Belum ada aroma woody di koleksi kami saat ini. Rekomendasi berikut dipilih berdasarkan kondisi dan preferensi lainnya.');
    return notices;
}

function renderRecommendations(expression, scanValid) {
    const avoidance = getBlockedRecommendations();
    const hour = new Date().getHours();
    const filtered = recommendations.filter(function (product) {
        if (avoidance.blocked.has(product.id)) return false;
        if ((answers.safety || []).includes('pregnancy') && product.lemongrass) return false;
        return true;
    });
    const ranked = filtered.map(function (product) {
        let usage = product.usage;
        if (answers.age === 'under-18' || (answers.safety || []).includes('pregnancy')) {
            usage = product.spray
                ? 'Gunakan hanya pada linen atau ruangan sesuai petunjuk label; jangan semprotkan ke wajah atau kulit.'
                : 'Gunakan diffuser ringan 30 menit lalu beri jeda di ruangan berventilasi. Hindari pemakaian topikal.';
        } else if ((answers.safety || []).includes('sensitive-skin')) {
            usage = 'Pilih diffuser atau inhalasi singkat di ruang berventilasi; hindari pemakaian topikal.';
        }
        return Object.assign({}, product, {
            usage: usage,
            score: scoreRecommendation(product, expression, scanValid, hour)
        });
    }).sort(function (first, second) { return second.score - first.score; });
    const selected = [];
    const selectedFamilies = new Set();
    ranked.forEach(function (product) {
        if (selected.length >= 3 || selectedFamilies.has(product.oilFamily)) return;
        if (product.id === 'peppermint-rollon' && !answers.concerns.includes('headache')) return;
        if (product.id === 'peppermint-spray' && answers.concerns.includes('headache')) return;
        if (product.score <= 0) return;
        selected.push(product);
        selectedFamilies.add(product.oilFamily);
    });
    const notices = getRecommendationNotices(avoidance);
    const noticeContainer = document.getElementById('recommendation-notices');
    noticeContainer.innerHTML = notices.map(function (notice) {
        return '<p class="recommendation-notice">' + notice + '</p>';
    }).join('');
    const list = document.getElementById('recommendation-list');
    if (!selected.length) {
        list.innerHTML = '<p class="recommendation-notice">Belum ada produk yang dapat direkomendasikan dari pilihan ini setelah penyaringan keamanan. Silakan hubungi tim Aromansa untuk bantuan.</p>';
        return;
    }
    list.innerHTML = selected.map(function (product, index) {
        const meta = productCatalogMeta[product.id] || { price: 50000, priceFormatted: 'Rp50.000', size: '10ml', img: 'img/aromansa-logo-baru.png', shopee: 'https://shopee.co.id/aromansa_id', tokped: 'https://www.tokopedia.com/aromansa' };
        const rank = index === 0 ? 'Utama' : 'Alternatif ' + index;
        const intro = product.reason + ' Tingkat bukti: ' + product.evidence + '.';
        const whatsappText = 'Halo Aromansa, saya ' + answers.nickname + '. Dari AR Mood Scan, saya tertarik dengan ' + product.name + '. Boleh info cara pemakaian dan ketersediaannya?';
        const link = 'https://wa.me/6285782909266?text=' + encodeURIComponent(whatsappText);
        return '<article class="recommendation-card' + (index === 0 ? ' is-primary' : '') + '">' +
            '<div class="recommendation-topline"><span class="product-rank">' + rank + '</span><span class="product-aroma">' + product.family + '</span></div>' +
            '<div class="rec-card-body">' +
                '<img src="' + meta.img + '" alt="' + product.name + '" class="rec-product-thumb" onerror="this.src=\'img/aromansa-logo-baru.png\'">' +
                '<div class="rec-product-content">' +
                    '<h4>' + product.name + '</h4>' +
                    '<div class="rec-product-price">' + meta.priceFormatted + ' <span class="rec-product-size">/ ' + meta.size + '</span></div>' +
                    '<p>' + intro + '</p>' +
                    '<p class="usage-line"><strong>Cara pakai:</strong> ' + product.usage + '</p>' +
                '</div>' +
            '</div>' +
            '<div class="rec-purchase-grid">' +
                '<a class="btn-rec-market shopee" href="' + meta.shopee + '" target="_blank" rel="noopener noreferrer"><i class="fa fa-shopping-bag" aria-hidden="true"></i> Shopee</a>' +
                '<a class="btn-rec-market tokopedia" href="' + meta.tokped + '" target="_blank" rel="noopener noreferrer"><i class="fa fa-store" aria-hidden="true"></i> Tokopedia</a>' +
                '<button type="button" class="btn-rec-add-cart" data-cart-id="' + product.id + '" data-cart-name="' + product.name + '" data-cart-price="' + meta.price + '" data-cart-size="' + meta.size + '" data-cart-image="' + meta.img + '"><i class="fa fa-cart-plus" aria-hidden="true"></i> + Keranjang</button>' +
                '<a class="btn-rec-wa-direct" href="' + link + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp" aria-hidden="true"></i> Tanya WhatsApp</a>' +
            '</div>' +
        '</article>';
    }).join('');

    // Send final recommendation update to Google Sheet
    const finalRecs = selected.map(function (product, index) {
        return (index === 0 ? '[Utama] ' : '') + product.name;
    }).join(', ');
    sendRecommendationUpdate(finalRecs);

    // Attach click events & tracking to all recommendation buttons
    list.querySelectorAll('.recommendation-card').forEach(function (card) {
        const prodNameEl = card.querySelector('h4');
        const prodName = prodNameEl ? prodNameEl.textContent.trim() : '';

        // + Keranjang
        card.querySelectorAll('.btn-rec-add-cart').forEach(function (button) {
            button.addEventListener('click', function () {
                trackProductAction(prodName, '+ Keranjang');
                if (window.aromansaCart) {
                    window.aromansaCart.addItem({
                        id: button.dataset.cartId,
                        name: button.dataset.cartName,
                        price: parseInt(button.dataset.cartPrice, 10),
                        size: button.dataset.cartSize,
                        image: button.dataset.cartImage,
                        quantity: 1
                    });
                }
            });
        });

        // Tanya WhatsApp
        card.querySelectorAll('.btn-rec-wa-direct').forEach(function (button) {
            button.addEventListener('click', function () {
                trackProductAction(prodName, 'Tanya WhatsApp');
            });
        });

        // Shopee
        card.querySelectorAll('.btn-rec-market.shopee').forEach(function (button) {
            button.addEventListener('click', function () {
                trackProductAction(prodName, 'Buka Shopee');
            });
        });

        // Tokopedia
        card.querySelectorAll('.btn-rec-market.tokopedia').forEach(function (button) {
            button.addEventListener('click', function () {
                trackProductAction(prodName, 'Buka Tokopedia');
            });
        });
    });
}

function showStep(step) {
    formStep.hidden = step !== 'form';
    scanStep.hidden = step !== 'scan';
    resultsStep.hidden = step !== 'results';
    document.querySelectorAll('[data-step-indicator]').forEach(function (indicator) {
        const order = { form: 1, scan: 2, results: 3 };
        const current = order[step];
        const own = order[indicator.dataset.stepIndicator];
        indicator.classList.toggle('is-current', own === current);
        indicator.classList.toggle('is-complete', own < current);
    });
}

function showMessage(text) {
    message.textContent = text;
    message.hidden = false;
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearMessage() {
    message.textContent = '';
    message.hidden = true;
}

document.addEventListener('visibilitychange', function () {
    if (document.hidden && cameraStream) {
        stopCamera();
        resetProgress();
        showStep('form');
        showMessage('Scan dihentikan karena halaman ditinggalkan. Mulai lagi saat Anda siap.');
    }
});

window.addEventListener('pagehide', stopCamera);