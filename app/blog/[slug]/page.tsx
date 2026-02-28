import { notFound } from 'next/navigation'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { highlight } from 'sugar-high'
import { marked } from 'marked'

async function processMDXContent(content: string) {
  // First, extract and preserve code blocks
  const codeBlocks: Array<{ id: string; language: string; code: string }> = []
  let blockId = 0
  
  // Extract code blocks and replace with placeholders
  let processedContent = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
    const lang = language || 'text'
    const id = `CODE_BLOCK_${blockId++}`
    codeBlocks.push({ id, language: lang, code: code.trim() })
    return `\n\n${id}\n\n`
  })
  
  // Process the remaining content as Markdown
  const markdownHtml = await marked(processedContent)
  
  // Replace code block placeholders with highlighted HTML
  let finalHtml = markdownHtml
  codeBlocks.forEach(({ id, language, code }) => {
    const highlightedCode = highlight(code)
    const codeHtml = `<pre><code class="language-${language}">${highlightedCode}</code></pre>`
    finalHtml = finalHtml.replace(id, codeHtml)
  })
  
  return finalHtml
}

export const dynamicParams = false

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params }) {
  const { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'About',
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose" dangerouslySetInnerHTML={{ __html: await processMDXContent(post.content) }} />
    </section>
  )
}
