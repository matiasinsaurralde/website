import { BlogPosts } from 'app/components/posts'
import { marked } from 'marked'
import fs from 'fs'
import path from 'path'

async function getBioContent() {
  const bioPath = path.join(process.cwd(), 'content', 'bio.md')
  const bioContent = fs.readFileSync(bioPath, 'utf8')
  return await marked(bioContent)
}

export default async function Page() {
  const bioHtml = await getBioContent()
  
  return (
    <section>
      <div 
        className="prose prose-neutral dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: bioHtml }}
      />
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
