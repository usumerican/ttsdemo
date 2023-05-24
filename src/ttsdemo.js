/* eslint-env browser */
/* global __APP_VERSION__ */

onload = async () => {
  onunhandledrejection = (ev) => alert(ev.reason || ev);

  const appTitle = document.title;
  const textInput = document.querySelector('.TextInput');
  const langSelect = document.querySelector('.LangSelect');
  const voiceSelect = document.querySelector('.VoiceSelect');
  const pitchSelect = document.querySelector('.PitchSelect');
  const rateSelect = document.querySelector('.RateSelect');
  const volumeSelect = document.querySelector('.VolumeSelect');
  const voicesMap = new Map();
  const langNames = new Intl.DisplayNames([], { type: 'language' });

  for (const voice of (await getVoices()).sort((a, b) => a.lang.localeCompare(b.lang))) {
    const lang = normalizeLang(voice.lang);
    let voices = voicesMap.get(lang);
    if (!voices) {
      voices = [];
      voicesMap.set(lang, voices);
    }
    voices.push(voice);
  }

  document.querySelector('.TitleOutput').textContent = appTitle + ' ' + __APP_VERSION__;
  langSelect.replaceChildren(
    ...['', ...voicesMap.keys()].map((value) => {
      return new Option(value ? ' [' + value + '] ' + translateLang(value) : '', value);
    })
  );
  pitchSelect.replaceChildren(
    ...[...Array(21)].map((_, i) => {
      const value = (i / 10).toFixed(1);
      return new Option('Pitch: ' + value, value);
    })
  );
  rateSelect.replaceChildren(
    ...[...Array(100)].map((_, i) => {
      const value = ((i + 1) / 10).toFixed(1);
      return new Option('Rate: ' + value, value);
    })
  );
  volumeSelect.replaceChildren(
    ...[...Array(11)].map((_, i) => {
      const value = (i / 10).toFixed(1);
      return new Option('Volume: ' + value, value);
    })
  );

  const searchParams = new URLSearchParams(location.search);
  textInput.value = searchParams.get('text') || '';
  updateDocumentTitle();
  langSelect.value = normalizeLang(searchParams.get('lang') || '');
  updateVoiceSelect();
  voiceSelect.value = searchParams.get('voiceURI') || '';
  setSelectValue(pitchSelect, searchParams.get('pitch'), '1.0');
  setSelectValue(rateSelect, searchParams.get('rate'), '1.0');
  setSelectValue(volumeSelect, searchParams.get('volume'), '1.0');

  visualViewport.onresize = () => {
    document.documentElement.style.height = visualViewport.height + 'px';
    document.documentElement.scrollTop = 0;
  };

  onpagehide = () => {
    stopSpeaking();
  };

  document.querySelector('.SpeakForm').onsubmit = (ev) => {
    ev.preventDefault();
    stopSpeaking();
    const text = textInput.value;
    const lang = langSelect.value;
    const voiceURI = voiceSelect.value;
    const pitch = pitchSelect.value;
    const rate = rateSelect.value;
    const volume = volumeSelect.value;
    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = normalizeLang(lang);
    uttr.voice = voicesMap.get(lang)?.find((voice) => voice.voiceURI === voiceURI);
    uttr.pitch = parseFloat(pitch);
    uttr.rate = parseFloat(rate);
    uttr.volume = parseFloat(volume);
    speechSynthesis.speak(uttr);
    history.replaceState(null, null, '?' + new URLSearchParams({ text, lang, voiceURI, pitch, rate, volume }));
    updateDocumentTitle();
  };

  document.querySelector('.StopButton').onclick = () => {
    stopSpeaking();
  };

  langSelect.onchange = () => {
    updateVoiceSelect();
  };

  function updateVoiceSelect() {
    voiceSelect.replaceChildren(
      ...[{ name: '', localService: true, voiceURI: '' }, ...(voicesMap.get(langSelect.value) || [])].map(
        (voice) => new Option(voice.name + (voice.localService ? '' : ' (Remote)'), voice.voiceURI)
      )
    );
  }

  function updateDocumentTitle() {
    const text = textInput.value;
    const len = 30;
    document.title = text ? (text.length > len ? text.slice(0, len - 1) + '…' : text) : appTitle;
  }

  function translateLang(lang) {
    try {
      return langNames.of(lang);
    } catch {
      return lang;
    }
  }
};

function setSelectValue(target, value, defaultValue) {
  if (!(target.value = value)) {
    target.value = defaultValue;
  }
}

function getVoices() {
  return new Promise((resolve, reject) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
    } else {
      speechSynthesis.addEventListener(
        'voiceschanged',
        () => {
          getVoices().then(
            (voices) => resolve(voices),
            (reason) => reject(reason)
          );
        },
        { once: true }
      );
    }
  });
}

function stopSpeaking() {
  speechSynthesis.cancel();
}

function normalizeLang(lang) {
  if (lang.includes('_')) {
    const tags = lang.split(/[^0-9a-zA-Z]+/);
    if (tags.length > 2) {
      [tags[1], tags[2]] = [tags[2], tags[1]];
    }
    lang = tags.join('-');
  }
  return lang;
}
