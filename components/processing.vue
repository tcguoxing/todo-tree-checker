<script lang="ts" setup>
import { TBox, TText } from '@temir/core'
import TSpinner from '@temir/spinner'

const props = defineProps(['nowFile'])
</script>
  
<template>
  <TBox
    :margin="5"
    width="20"
    border-style="round"
    justify-content="center"
  >
    <TText>
      <TText color="yellow">
        <TSpinner />
      </TText>
      {{props.nowFile}} is processing...
    </TText>
  </TBox>
</template>