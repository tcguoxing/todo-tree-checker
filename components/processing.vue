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

<script>
import { TBox, TText } from '@temir/core'
import TSpinner from '@temir/spinner'
import { ref } from 'vue'

export default {
  name: 'processing',
  components: {
    TBox, TText, TSpinner
  }, 
  props: ['nowFile'],
  // const props = defineProps(['nowFile'])
  setup(props) {
    return {
      props
    }
}
}

</script>
