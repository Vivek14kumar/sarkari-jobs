export default function Canonical({ url }) {
  if (!url) return null;

  return (
    <link rel="canonical" href={url} />
  );
}
