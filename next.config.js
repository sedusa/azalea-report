/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  webpack: (cfg) => {
    console.log('Next.js config:', JSON.stringify(nextConfig, null, 2));
    cfg.module.rules.push(
      {
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader',
        options: { mode: ['react-component'] }
      }
    )
    return cfg
  }
}

console.log('Next.js config:', JSON.stringify(nextConfig, null, 2));
// Change this line
module.exports = nextConfig