<script>
  import { onMount } from 'svelte';

  // Zebar's battery provider fails on this laptop with "A device which does
  // not exist was specified", so use the browser Battery Status API instead.
  // https://developer.mozilla.org/en-US/docs/Web/API/BatteryManager
  const events = ['levelchange', 'chargingchange'];

  let battery = $state(null);

  function getBatteryClass(batteryOutput) {
    if (batteryOutput.chargePercent > 90) return 'nf nf-fa-battery_4';
    if (batteryOutput.chargePercent > 70) return 'nf nf-fa-battery_3';
    if (batteryOutput.chargePercent > 40) return 'nf nf-fa-battery_2';
    if (batteryOutput.chargePercent > 20) return 'nf nf-fa-battery_1';
    return 'nf nf-fa-battery_0';
  }

  onMount(() => {
    let manager;

    function updateBattery() {
      battery = {
        chargePercent: manager.level * 100,
        isCharging: manager.charging
      };
    }

    navigator
      .getBattery()
      .then((result) => {
        manager = result;
        updateBattery();
        events.forEach((event) => manager.addEventListener(event, updateBattery));
      })
      .catch((err) => console.error('[Battery] getBattery failed', err));

    return () => {
      events.forEach((event) => manager?.removeEventListener(event, updateBattery));
    };
  });
</script>

{#if battery}
  <div class="battery">
    {#if battery.isCharging}
      <i class="nf nf-md-power_plug charging-icon"></i>
    {/if}
    <i class={getBatteryClass(battery)}></i>
    {Math.round(battery.chargePercent)}%
  </div>
{/if}
