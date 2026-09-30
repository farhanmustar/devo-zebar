<script>
  import { onMount } from 'svelte';
  import { DateTime } from 'luxon';

  const url =
    'https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=';
  let waktuSolat = {};
  let display = $state('');

  async function getWaktuSolat(zone = 'SGR01') {
    const response = await fetch(url + zone);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const raw = await response.json();
    let data = raw.prayerTime[0];
    data.zone = raw.zone;
    data.serverTime = DateTime.fromFormat(raw.serverTime, 'yyyy-MM-dd HH:mm:ss');

    // `data.date` uses Malay month names (e.g. "01-Okt-2026") which luxon
    // cannot parse, so take the date from `serverTime` instead.
    const day = raw.serverTime.split(' ')[0];
    const parseTime = (time) => DateTime.fromFormat(`${day} ${time}`, 'yyyy-MM-dd HH:mm:ss');
    data.imsak = parseTime(data.imsak);
    data.fajr = parseTime(data.fajr);
    data.syuruk = parseTime(data.syuruk);
    data.dhuhr = parseTime(data.dhuhr);
    data.asr = parseTime(data.asr);
    data.maghrib = parseTime(data.maghrib);
    data.isha = parseTime(data.isha);
    data.date = DateTime.fromISO(day);

    return data;
  }

  async function updateDisplay() {
    const now = DateTime.now();
    if (
      !waktuSolat.serverTime ||
      !waktuSolat.serverTime.startOf('day').equals(now.startOf('day'))
    ) {
      const data = await getWaktuSolat();
      waktuSolat = data;
    }

    if (now < waktuSolat.fajr) {
      display = `Subuh ${waktuSolat.fajr.toFormat('hh:mm a')}`;
    } else if (now < waktuSolat.dhuhr) {
      display = `Zohor ${waktuSolat.dhuhr.toFormat('hh:mm a')}`;
    } else if (now < waktuSolat.asr) {
      display = `Asar ${waktuSolat.asr.toFormat('hh:mm a')}`;
    } else if (now < waktuSolat.maghrib) {
      display = `Maghrib ${waktuSolat.maghrib.toFormat('hh:mm a')}`;
    } else if (now < waktuSolat.isha) {
      display = `Isyak ${waktuSolat.isha.toFormat('hh:mm a')}`;
    } else {
      display = `Subuh ${waktuSolat.fajr.toFormat('hh:mm a')}`;
    }
  }

  onMount(() => {
    let intervalId = setInterval(() => {
      updateDisplay();
    }, 10000);

    updateDisplay();
    return () => {
      clearInterval(intervalId);
    };
  });
</script>

<div class="waktu-solat">{display}</div>

<style>
  .waktu-solat {
    margin-left: 40px;
    white-space: nowrap;
  }
</style>
