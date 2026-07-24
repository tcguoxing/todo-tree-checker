<template>
  <TBox
    :margin="5"
    :width="36"
    :height="5"
    border-style="double"
    justify-content="center"
    align-items="center"
  >
    <TText color="#42b883">todo-tree-checker · ready</TText>
  </TBox>
</template>

<script>
import { TBox, TText } from '@temir/core'

export default {
  name: 'StandBy',
  components: { TBox, TText },
}
</script>
