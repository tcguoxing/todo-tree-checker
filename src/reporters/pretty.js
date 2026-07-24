const { defineComponent, h, ref, onMounted } = require('@vue/runtime-core')
const { render, TBox, TText, TNewline } = require('@temir/core')
const TSpinner = require('@temir/spinner').default || require('@temir/spinner')

/**
 * Pretty Temir reporter — bordered spinner, then a framed result panel.
 * Uses render functions (no .vue SFC) so the published CLI needs no Vue loader.
 *
 * @param {{ matches: Array, stats: object }} result
 * @returns {Promise<void>}
 */
function reportPretty(result) {
  return new Promise((resolve) => {
    let instance

    const App = defineComponent({
      name: 'TodoCheckReport',
      setup() {
        const phase = ref('processing')
        const { matches, stats } = result
        const hasMatches = matches.length > 0

        onMounted(() => {
          setTimeout(() => {
            phase.value = 'result'
            // Keep the result frame visible long enough to read
            setTimeout(() => {
              if (instance) instance.unmount()
              resolve()
            }, hasMatches ? 1200 : 700)
          }, 500)
        })

        return () => {
          if (phase.value === 'processing') {
            return h(
              TBox,
              {
                flexDirection: 'column',
                borderStyle: 'round',
                borderColor: 'yellow',
                paddingX: 2,
                paddingY: 1,
                marginY: 1,
              },
              [
                h(TBox, { alignItems: 'center' }, [
                  h(TText, { color: 'yellow' }, [h(TSpinner)]),
                  h(TText, { color: 'yellow' }, [
                    `  Scanning ${stats.paths.join(', ')}`,
                  ]),
                ]),
                h(TText, { dimColor: true }, [
                  `looking for: ${stats.targets.join(', ')}`,
                ]),
              ]
            )
          }

          const body = []

          body.push(
            h(TText, { bold: true, color: 'cyan' }, [
              '  todo-tree-checker',
            ])
          )
          body.push(h(TNewline, null, []))
          body.push(
            h(TText, { dimColor: true }, [
              `  files ${stats.filesScanned}  ·  matches ${stats.matchCount}  ·  ${stats.durationMs}ms`,
            ])
          )
          body.push(h(TNewline, null, []))

          if (!hasMatches) {
            body.push(
              h(TText, { color: 'green' }, [
                `  ✓  No ${stats.targets.join('/')} found.`,
              ])
            )
          } else {
            for (const match of matches) {
              body.push(
                h(TText, { color: 'yellow' }, [
                  `  ●  ${match.file}:${match.line}:${match.column}`,
                ])
              )
              body.push(
                h(TText, { dimColor: true }, [
                  `     [${match.target}] ${match.text}`,
                ])
              )
            }
            body.push(h(TNewline, null, []))
            body.push(
              h(TText, { bold: true, color: 'red' }, [
                `  ✗  Found ${matches.length} match(es).`,
              ])
            )
          }

          // Temir column layout paints last child first in some terminals
          return h(
            TBox,
            {
              flexDirection: 'column',
              borderStyle: 'double',
              borderColor: hasMatches ? 'red' : 'green',
              paddingX: 1,
              paddingY: 1,
              marginY: 1,
            },
            body.slice().reverse()
          )
        }
      },
    })

    instance = render(App)
  })
}

module.exports = {
  reportPretty,
}
