import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        About
      </h1>
      <p className="mb-4">
        {`I'm a software engineer from Paraguay with a strong background in open source, distributed systems, and networking. My current focus is CrowdLlama, an open source project enabling distributed inference through peer-to-peer networks. I'm open to consulting, open source collaborations and technical mentorship opportunities`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
