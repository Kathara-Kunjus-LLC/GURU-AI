import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'

function remarkWikilinks() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const regex = /\[\[([^\]]+)\]\]/g
      const parts = []
      let last = 0
      let match

      while ((match = regex.exec(node.value)) !== null) {
        if (match.index > last) {
          parts.push({ type: 'text', value: node.value.slice(last, match.index) })
        }
        const target = match[1].trim()
        parts.push({
          type: 'html',
          value: `<a class="wikilink" data-target="${target}" href="#">${target}</a>`,
        })
        last = regex.lastIndex
      }

      if (parts.length > 0) {
        if (last < node.value.length) {
          parts.push({ type: 'text', value: node.value.slice(last) })
        }
        parent.children.splice(index, 1, ...parts)
      }
    })
  }
}

const processor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkWikilinks)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex)
  .use(rehypeStringify, { allowDangerousHtml: true })

export async function renderMarkdown(content) {
  const result = await processor.process(content)
  return String(result)
}
