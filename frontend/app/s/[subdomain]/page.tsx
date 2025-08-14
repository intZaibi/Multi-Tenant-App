export default function subDomainPage({ params }: { params: { subdomain: string } }) {
  return (
    <div>subDomainPage {params.subdomain}</div>
  )
}
