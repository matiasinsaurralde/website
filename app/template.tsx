/**
 * Template re-mounts on every navigation (unlike layout which persists).
 * This ensures only one page segment is in the DOM and prevents duplicate
 * content when client-navigating between routes (e.g. home → contact).
 */
export default function Template({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
