<script>
  import * as zebar from 'zebar';
  const providers = zebar.createProviderGroup({
    network: { type: 'network' },
    glazewm: { type: 'glazewm' },
    cpu: { type: 'cpu' },
    date: { type: 'date', formatting: 'EEE f' },
    battery: { type: 'battery' },
    memory: { type: 'memory' },
    weather: { type: 'weather' },
    disk: { type: 'disk' }
  });

  let output = $state({});
  providers.onOutput(() => (output = debug(providers.outputMap)));

  function debug(o) {
    if (import.meta.env.MODE === 'production') {
      return o;
    }

    // DEBUG: glazewm;
    o.glazewm = {
      tilingDirection: 'horizontal',
      runCommand: () => {},
      currentWorkspaces: [
        {
          name: 1,
          displayName: 1,
          hasFocus: true,
          isDisplayed: true
        },
        {
          name: 2,
          displayName: 2,
          hasFocus: false,
          isDisplayed: false
        }
      ]
    };

    // DEBUG: network;
    o.network = {
      defaultInterface: {
        type: 'ethernet'
      },
      defaultGateway: {
        ssid: 'farhan'
      },
      traffic: {
        received: {
          iecValue: 0.0,
          iecUnit: 'B'
        },
        transmitted: {
          iecValue: 0.0,
          iecUnit: 'B'
        }
      }
    };

    // DEBUG: disk;
    o.disk = {
      disks: [
        {
          availableSpace: {
            iecValue: 33.6,
            iecUnit: 'GiB'
          }
        }
      ]
    };

    // DEBUG: memory;
    o.memory = {
      usage: 58
    };

    // DEBUG: cpu;
    o.cpu = {
      usage: 10
    };

    // DEBUG: battery;
    o.battery = {
      isCharging: false,
      chargePercent: 80
    };

    // DEBUG: weather;
    o.weather = {
      celsiusTemp: 30,
      status: 'clear_day'
    };

    return o;
  }

  function getNetworkClass(networkOutput) {
    switch (networkOutput.defaultInterface?.type) {
      case 'ethernet':
        return 'nf nf-md-ethernet_cable';
      case 'wifi':
        if (networkOutput.defaultGateway?.signalStrength >= 80) {
          return 'nf nf-md-wifi_strength_4';
        } else if (networkOutput.defaultGateway?.signalStrength >= 65) {
          return 'nf nf-md-wifi_strength_3';
        } else if (networkOutput.defaultGateway?.signalStrength >= 40) {
          return 'nf nf-md-wifi_strength_2';
        } else if (networkOutput.defaultGateway?.signalStrength >= 25) {
          return 'nf nf-md-wifi_strength_1';
        } else {
          return 'nf nf-md-wifi_strength_outline';
        }
      default:
        return 'nf nf-md-wifi_strength_off_outline';
    }
  }
  function getBatteryClass(batteryOutput) {
    if (batteryOutput.chargePercent > 90) return 'nf nf-fa-battery_4';
    if (batteryOutput.chargePercent > 70) return 'nf nf-fa-battery_3';
    if (batteryOutput.chargePercent > 40) return 'nf nf-fa-battery_2';
    if (batteryOutput.chargePercent > 20) return 'nf nf-fa-battery_1';
    return 'nf nf-fa-battery_0';
  }

  function getWeatherClass(weatherOutput) {
    switch (weatherOutput.status) {
      case 'clear_day':
        return 'nf nf-weather-day_sunny';
      case 'clear_night':
        return 'nf nf-weather-night_clear';
      case 'cloudy_day':
        return 'nf nf-weather-day_cloudy';
      case 'cloudy_night':
        return 'nf nf-weather-night_alt_cloudy';
      case 'light_rain_day':
        return 'nf nf-weather-day_sprinkle';
      case 'light_rain_night':
        return 'nf nf-weather-night_alt_sprinkle';
      case 'heavy_rain_day':
        return 'nf nf-weather-day_rain';
      case 'heavy_rain_night':
        return 'nf nf-weather-night_alt_rain';
      case 'snow_day':
        return 'nf nf-weather-day_snow';
      case 'snow_night':
        return 'nf nf-weather-night_alt_snow';
      case 'thunder_day':
        return 'nf nf-weather-day_lightning';
      case 'thunder_night':
        return 'nf nf-weather-night_alt_lightning';
    }
  }
</script>

<main>
  <div class="app">
    <div class="left">
      <i class="logo nf nf-fa-windows"></i>
      {#if output.glazewm}
        <div class="workspaces">
          {#each output.glazewm.currentWorkspaces as workspace}
            <button
              class="workspace"
              class:focused={workspace.hasFocus}
              class:displayed={workspace.isDisplayed}
              on:click={() =>
                output.glazewm.runCommand(`focus --workspace ${workspace.name}`)}>
              {workspace.displayName ?? workspace.name}
            </button>
          {/each}
        </div>
      {/if}
    </div>
    <div class="center"></div>
    <div class="right">
      {#if output.glazewm}
        {#each output.glazewm.bindingModes as bindingMode}
          <button class="binding-mode">
            {bindingMode.displayName ?? bindingMode.name}
          </button>
        {/each}
        <button
          class="tiling-direction nf {output.glazewm.tilingDirection === 'horizontal'
            ? 'nf-md-swap_horizontal'
            : 'nf-md-swap_vertical'}"
          on:click={() => output.glazewm.runCommand('toggle-tiling-direction')}></button>
      {/if}
      {#if output.network}
        <div class="network">
          <i class="nf nf-md-download"></i>
          {output.network.traffic?.received?.iecValue.toFixed(1)}
          &nbsp;
          {output.network.traffic?.received?.iecUnit}
        </div>
        <div class="network">
          <i class="nf nf-md-upload"></i>
          {output.network.traffic?.transmitted?.iecValue.toFixed(1)}
          &nbsp;
          {output.network.traffic?.transmitted?.iecUnit}
        </div>
        <div class="network">
          <i class={getNetworkClass(output.network)}></i>
          {output.network.defaultGateway?.ssid}
        </div>
      {/if}
      {#if output.disk}
        <div class="disk">
          <i class="nf nf-md-harddisk"></i>
          {output.disk.disks[0].availableSpace.iecValue.toFixed(1)}
          &nbsp;
          {output.disk.disks[0].availableSpace.iecUnit}
        </div>
      {/if}
      {#if output.memory}
        <div class="memory">
          <i class="nf nf-fae-chip"></i>
          {Math.round(output.memory.usage)}%
        </div>
      {/if}
      {#if output.cpu}
        <div class="cpu">
          <i class="nf nf-oct-cpu"></i>
          <span class:high-usage={output.cpu.usage > 85}>
            {Math.round(output.cpu.usage)}%
          </span>
        </div>
      {/if}
      {#if output.battery}
        <div class="battery">
          {#if output.battery.isCharging}
            <i class="nf nf-md-power_plug charging-icon"></i>
          {/if}
          <i class={getBatteryClass(output.battery)}></i>
          {Math.round(output.battery.chargePercent)}%
        </div>
      {/if}
      {#if output.weather}
        <div class="weather">
          <i class={getWeatherClass(output.weather)}></i>
          {Math.round(output.weather.celsiusTemp)}°C
        </div>
      {/if}
      <div class="date">{output.date?.formatted}</div>
    </div>
  </div>
</main>

<style>
</style>
