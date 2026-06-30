/**
 * daftar.js — Logika Formulir Pendaftaran KOMPASS 2026
 * Halaman: daftar.html
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // DATA LOMBA LABELS
    // ==========================================
    const lombaLabel = {
        mqk:        "Musabaqah Qiraatul Kutub (MQK)",
        cci:        "Cerdas Cermat Islam (CCI)",
        kdm:        "Kompetisi Da'i Muda (KDM)",
        matematika: "Olimpiade Matematika",
        ipa:        "Olimpiade IPA Terpadu",
        kkl:        "Kompetisi Kaligrafi Lukis (KKL)",
        puisi:      "Cipta & Baca Puisi"
    };

    const lombaCategory = {
        mqk: "agama", cci: "agama", kdm: "agama",
        matematika: "sains", ipa: "sains",
        kkl: "seni", puisi: "seni"
    };

    // ==========================================
    // STATE
    // ==========================================
    let currentStep = 1;
    const totalSteps = 4;
    let formData = {};

    // ==========================================
    // DOM REFERENCES
    // ==========================================
    const steps = [1, 2, 3, 4].map(n => document.getElementById(`step-${n}`));
    const dots  = [1, 2, 3, 4].map(n => document.getElementById(`dot-${n}`));
    const lines = [1, 2, 3].map(n => document.getElementById(`line-${n}-${n+1}`));

    // ==========================================
    // STEP NAVIGATION
    // ==========================================
    const goToStep = (n) => {
        steps.forEach((s, i) => {
            if (!s) return;
            s.classList.toggle('hidden', i + 1 !== n);
        });

        dots.forEach((dot, i) => {
            if (!dot) return;
            dot.classList.remove('active', 'done');
            if (i + 1 === n) dot.classList.add('active');
            else if (i + 1 < n) dot.classList.add('done');
        });

        lines.forEach((line, i) => {
            if (!line) return;
            line.classList.toggle('active', i + 1 < n);
        });

        currentStep = n;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ==========================================
    // VALIDATION HELPERS
    // ==========================================
    const setError = (id, msg) => {
        const el = document.getElementById(id);
        if (el) el.textContent = msg;
    };
    const clearError = (id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    };
    const setInputError = (inputId) => {
        const el = document.getElementById(inputId);
        if (el) el.classList.add('error');
    };
    const clearInputError = (inputId) => {
        const el = document.getElementById(inputId);
        if (el) el.classList.remove('error');
    };

    // Live clear errors on input
    ['s1-fullname','s1-nisn','s1-gender','s1-school','s1-city','s1-province','s1-whatsapp','s1-email'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                clearInputError(id);
                clearError(`err-${id.replace('s1-', '')}`);
            });
        }
    });

    // ==========================================
    // STEP 1 — DATA DIRI
    // ==========================================
    const formStep1 = document.getElementById('form-step-1');
    if (formStep1) {
        formStep1.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullname = document.getElementById('s1-fullname').value.trim();
            const nisn     = document.getElementById('s1-nisn').value.trim();
            const gender   = document.getElementById('s1-gender').value;
            const school   = document.getElementById('s1-school').value.trim();
            const city     = document.getElementById('s1-city').value.trim();
            const province = document.getElementById('s1-province').value;
            const wa       = document.getElementById('s1-whatsapp').value.trim();
            const email    = document.getElementById('s1-email').value.trim();

            let valid = true;

            if (!fullname) { setError('err-fullname', 'Nama lengkap wajib diisi.'); setInputError('s1-fullname'); valid = false; }
            else clearError('err-fullname');

            if (!nisn || !/^\d{10}$/.test(nisn)) { setError('err-nisn', 'NISN harus 10 digit angka.'); setInputError('s1-nisn'); valid = false; }
            else clearError('err-nisn');

            if (!gender) { setError('err-gender', 'Pilih jenis kelamin.'); setInputError('s1-gender'); valid = false; }
            else clearError('err-gender');

            if (!school) { setError('err-school', 'Asal sekolah wajib diisi.'); setInputError('s1-school'); valid = false; }
            else clearError('err-school');

            if (!city) { setError('err-city', 'Kab/Kota wajib diisi.'); setInputError('s1-city'); valid = false; }
            else clearError('err-city');

            if (!province) { setError('err-province', 'Pilih provinsi.'); setInputError('s1-province'); valid = false; }
            else clearError('err-province');

            const waRegex = /^(\+62|0|62)[0-9]{8,13}$/;
            if (!wa || !waRegex.test(wa.replace(/\s|-/g, ''))) { setError('err-whatsapp', 'Format nomor WhatsApp tidak valid.'); setInputError('s1-whatsapp'); valid = false; }
            else clearError('err-whatsapp');

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) { setError('err-email', 'Format email tidak valid.'); setInputError('s1-email'); valid = false; }
            else clearError('err-email');

            if (!valid) return;

            formData = { fullname, nisn, gender, school, city, province, whatsapp: wa, email };
            goToStep(2);

            // Pre-select lomba category from URL param if available
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('category');
            const lom = params.get('lomba');
            if (cat) {
                const tabEl = document.querySelector(`.cat-tab[data-cat="${cat}"]`);
                if (tabEl) tabEl.click();
            }
            if (lom) {
                const radioEl = document.querySelector(`input[type="radio"][value="${lom}"]`);
                if (radioEl) radioEl.checked = true;
            }
        });
    }

    // ==========================================
    // STEP 2 — PILIH LOMBA
    // ==========================================

    // Category Tab Switch
    const catTabs = document.querySelectorAll('.cat-tab');
    const lombaGroups = document.querySelectorAll('.lomba-option-group');

    catTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            catTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.getAttribute('data-cat');

            lombaGroups.forEach(group => {
                if (group.getAttribute('data-cat') === cat) {
                    group.classList.remove('hidden');
                } else {
                    group.classList.add('hidden');
                }
            });
        });
    });

    const prevStep2Btn = document.getElementById('prev-step-2');
    const nextStep2Btn = document.getElementById('next-step-2');

    if (prevStep2Btn) prevStep2Btn.addEventListener('click', () => goToStep(1));

    if (nextStep2Btn) {
        nextStep2Btn.addEventListener('click', () => {
            const selected = document.querySelector('input[name="lomba"]:checked');
            const errEl = document.getElementById('err-lomba-select');

            if (!selected) {
                if (errEl) errEl.textContent = 'Pilih satu cabang lomba terlebih dahulu.';
                return;
            }
            if (errEl) errEl.textContent = '';

            formData.lomba = selected.value;
            formData.category = lombaCategory[selected.value] || '-';
            renderKonfirmasi();
            goToStep(3);
        });
    }

    // Clear lomba error on selection
    document.querySelectorAll('input[name="lomba"]').forEach(r => {
        r.addEventListener('change', () => {
            const errEl = document.getElementById('err-lomba-select');
            if (errEl) errEl.textContent = '';
        });
    });

    // ==========================================
    // STEP 3 — KONFIRMASI
    // ==========================================
    const renderKonfirmasi = () => {
        const grid = document.getElementById('konfirmasi-grid');
        if (!grid) return;

        const catLabel = { agama: 'Agama', sains: 'Sains', seni: 'Seni' };
        const items = [
            { label: 'Nama Lengkap',     value: formData.fullname },
            { label: 'NISN',             value: formData.nisn },
            { label: 'Jenis Kelamin',    value: formData.gender },
            { label: 'Asal Sekolah',     value: formData.school },
            { label: 'Kabupaten / Kota', value: formData.city },
            { label: 'Provinsi',         value: formData.province },
            { label: 'WhatsApp',         value: formData.whatsapp },
            { label: 'Email',            value: formData.email },
            { label: 'Kategori',         value: catLabel[formData.category] || formData.category },
            { label: 'Cabang Lomba',     value: lombaLabel[formData.lomba] || formData.lomba },
        ];

        grid.innerHTML = items.map(item => `
            <div class="konfirmasi-item">
                <span>${item.label}</span>
                <strong>${item.value || '-'}</strong>
            </div>
        `).join('');
    };

    const prevStep3Btn   = document.getElementById('prev-step-3');
    const submitDaftarBtn = document.getElementById('submit-daftar');

    if (prevStep3Btn) prevStep3Btn.addEventListener('click', () => goToStep(2));

    if (submitDaftarBtn) {
        submitDaftarBtn.addEventListener('click', () => {
            // Generate ID
            const newId = 'KMP-' + Math.floor(100000 + Math.random() * 900000);

            const participant = {
                id:       newId,
                fullname: formData.fullname,
                nisn:     formData.nisn,
                gender:   formData.gender,
                school:   formData.school,
                city:     formData.city,
                province: formData.province,
                whatsapp: formData.whatsapp,
                email:    formData.email,
                category: formData.category,
                lomba:    formData.lomba,
                status:   'Pending',
                registeredAt: new Date().toISOString()
            };

            // Save to localStorage
            const existing = JSON.parse(localStorage.getItem('kompass_participants')) || [];
            existing.push(participant);
            localStorage.setItem('kompass_participants', JSON.stringify(existing));

            // Render ticket
            renderTiket(participant);
            goToStep(4);
        });
    }

    // ==========================================
    // STEP 4 — TIKET
    // ==========================================
    const renderTiket = (p) => {
        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        const catLabel = { agama: 'Agama', sains: 'Sains', seni: 'Seni' };

        setTxt('tiket-id',       p.id);
        setTxt('tiket-name',     p.fullname);
        setTxt('tiket-school',   `${p.school} — ${p.city}`);
        setTxt('tiket-lomba',    lombaLabel[p.lomba] || p.lomba);
        setTxt('tiket-category', catLabel[p.category] || p.category);
        setTxt('tiket-date',     dateStr);
    };

    // ==========================================
    // INIT — Pre-fill from URL params on load
    // ==========================================
    const params = new URLSearchParams(window.location.search);
    const initCat = params.get('category');
    const initLom = params.get('lomba');

    if (initCat || initLom) {
        // Only pre-fill if starting from step 2 redirect
        // (redirect comes from lomba detail modal on index.html)
        // Navigate to step 1 first, params applied after step 1 submit
    }

    // Go to step 1 on load
    goToStep(1);
});
