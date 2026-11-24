
import { useRef, useState } from 'react'

function App() {
  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState('')

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf8] text-gray-900">

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="text-2xl font-bold tracking-tight">
            image<span className="text-green-600">zip.</span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="#compressor" className="hover:text-green-600">Compressor</a>
            <a href="#features" className="hover:text-green-600">Features</a>
            <a href="#about" className="hover:text-green-600">About</a>
          </div>

          <a
            href="#compressor"
            className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="px-6 pb-12 pt-20 text-center md:pt-28">
          <div className="mx-auto mb-6 w-fit rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            Simple image compression, made easy
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Smaller images.
            <br />
            <span className="text-green-600">Same great quality.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
            Reduce your image file sizes in seconds. Compress images
            effortlessly and make them easier to store, share and upload.
          </p>
        </section>

        {/* Upload section */}
        <section id="compressor" className="mx-auto max-w-4xl px-6 pb-20">
          <div
            className="rounded-3xl border-2 border-dashed border-green-300 bg-white p-8 text-center shadow-sm transition hover:border-green-500 sm:p-14"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleFile(e.dataTransfer.files[0])
            }}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl">
              ↑
            </div>

            <h2 className="text-xl font-bold sm:text-2xl">
              {fileName ? 'Image selected!' : 'Drop your images here'}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              {fileName || 'or click below to browse your files'}
            </p>

            <button
              onClick={() => fileInputRef.current.click()}
              className="mt-7 rounded-xl bg-green-600 px-8 py-3.5 font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              Choose images
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            <p className="mt-6 text-xs text-gray-400">
              JPG, PNG and WebP supported
            </p>
          </div>

          <p className="mt-5 text-center text-sm text-gray-400">
            Your images will be processed privately in your browser.
          </p>
        </section>

        {/* Features */}
        <section id="features" className="bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need to compress images
              </h2>
              <p className="mt-3 text-gray-500">
                Less file size. Less hassle.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: '↘',
                  title: 'Smaller file sizes',
                  description: 'Reduce image sizes without unnecessarily sacrificing quality.'
                },
                {
                  icon: '◉',
                  title: 'Easy to use',
                  description: 'A simple interface that makes image compression straightforward.'
                },
                {
                  icon: '⌑',
                  title: 'Private processing',
                  description: 'Images are designed to be processed directly in your browser.'
                }
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-gray-100 bg-[#f8faf8] p-7"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl font-bold text-green-700">
                    {feature.icon}
                  </div>

                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="about" className="border-t border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-lg font-bold">
            image<span className="text-green-600">zip.</span>
          </p>
          <p className="text-sm text-gray-400">
            Built with care by halima.builds
          </p>
          <p className="text-xs text-gray-400">
            © 2026 ImageZip
          </p>
        </div>
      </footer>

    </div>
  )
}

export default App
