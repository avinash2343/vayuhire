export default async function sitemap() {
  const baseUrl = 'https://vayuhire.com';
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/jobs`, lastModified: new Date() },
    { url: `${baseUrl}/companies`, lastModified: new Date() },
  ];
}
