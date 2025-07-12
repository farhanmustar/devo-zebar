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
    disk: { type: 'disk' },
  });

  let output = $state({});
  providers.onOutput(() => output = debug(providers.outputMap));

  function debug(o) {
    // TODO: enable based on preprocessor logic.

    // DEBUG: network;
    o.network = {
      traffic: {
        received: {
          iecValue: 0.0,
          iecUnit: 'B',
        },
        transmitted: {
          iecValue: 0.0,
          iecUnit: 'B',
        }
      }
    }


    return o;
  }

  function getNetworkClass(networkOutput) {
    switch (networkOutput.defaultInterface?.type) {
      case 'ethernet':
        return 'nf nf-md-ethernet_cable';
      case 'wifi':
        if (networkOutput.defaultGateway?.signalStrength >= 80) {
          return 'nf nf-md-wifi_strength_4';
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 65
        ) {
          return 'nf nf-md-wifi_strength_3';
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 40
        ) {
          return 'nf nf-md-wifi_strength_2';
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 25
        ) {
          return 'nf nf-md-wifi_strength_1';
        } else {
          return 'nf nf-md-wifi_strength_outline';
        }
      default:
        return 'nf nf-md-wifi_strength_off_outline';
    }
  }
</script>

<main>
  <div class="app">
    <div class="left">
      <i class="logo nf nf-fa-windows"></i>
    </div>
    <div class="center">
    </div>
    <div class="right">
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
      {/if}
    </div>
  </div>
</main>

<style>
</style>
