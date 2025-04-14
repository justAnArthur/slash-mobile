const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url)
    let path = url.pathname === '/' ? '/index.html' : url.pathname
    const filePath = `.${path}`

    console.log(`Request for ${filePath}`);

    try {
      const file = await Bun.file(filePath)
      if (!(await file.exists())) throw new Error()

      return new Response(file, {
        headers: {
          'Content-Type': file.type
        }
      })
    } catch {
      return new Response('404 Not Found', { status: 404 })
    }
  }
})

console.log(`Server running at http://localhost:${server.port}`)