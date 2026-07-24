<template>
  <TBox
    flex-direction="column"
    border-style="round"
    border-color="yellow"
    :padding-x="2"
    :padding-y="1"
    :margin-y="1"
  >
    <TBox align-items="center">
      <TText color="yellow"><TSpinner /></TText>
      <TText color="yellow">  Scanning {{ pathsLabel }}</TText>
    </TBox>
    <TText dim-color>looking for: {{ targetsLabel }}</TText>
  </TBox>
</template>

<script>
import { TBox, TText } from '@temir/core'
import TSpinner from '@temir/spinner'

export default {
  name: 'Processing',
  components: { TBox, TText, TSpinner },
  props: {
    paths: { type: Array, default: () => ['src'] },
    targets: { type: Array, default: () => ['todo'] },
  },
  computed: {
    pathsLabel() {
      return this.paths.join(', ')
    },
    targetsLabel() {
      return this.targets.join(', ')
    },
  },
}
</script>
