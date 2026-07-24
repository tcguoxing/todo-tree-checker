<template>
  <TBox
    flex-direction="column"
    border-style="double"
    :border-color="matches.length ? 'red' : 'green'"
    :padding-x="1"
    :padding-y="1"
    :margin-y="1"
  >
    <TText bold color="cyan">  todo-tree-checker</TText>
    <TText dim-color>
      files {{ stats.filesScanned }} · matches {{ stats.matchCount }} ·
      {{ stats.durationMs }}ms
    </TText>
    <TText v-if="!matches.length" color="green">
      ✓  No {{ (stats.targets || ['todo']).join('/') }} found.
    </TText>
    <TBox v-else flex-direction="column">
      <TBox
        v-for="(match, index) in matches"
        :key="index"
        flex-direction="column"
      >
        <TText color="yellow">
          ●  {{ match.file }}:{{ match.line }}:{{ match.column }}
        </TText>
        <TText dim-color>
          [{{ match.target }}] {{ match.text }}
        </TText>
      </TBox>
      <TText bold color="red">✗  Found {{ matches.length }} match(es).</TText>
    </TBox>
  </TBox>
</template>

<script>
import { TBox, TText } from '@temir/core'

export default {
  name: 'ShowResult',
  components: { TBox, TText },
  props: {
    matches: { type: Array, default: () => [] },
    stats: {
      type: Object,
      default: () => ({
        filesScanned: 0,
        matchCount: 0,
        durationMs: 0,
        targets: ['todo'],
      }),
    },
  },
}
</script>
