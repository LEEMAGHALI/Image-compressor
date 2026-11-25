import { useRef, useState } from 'react'

function App() {
  const fileInputRef = useRef(null)

  const [originalFile, setOriginalFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [quality, setQuality] = useState(0.8)
  const [compressedUrl, setCompressedUrl] = useState('')
  const [compressedSize, setCompressedSize] = useState(0)
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState('')

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const handleFile = (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (compressedUrl) URL.revokeObjectURL(compressedUrl)

    setOriginalFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setCompressedUrl('')
    setCompressedSize(0)
    setError('')
  }

  const compressImage = () => {
    if (!originalFile) return

    setIsCompressing(true)
    setError('')

    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight

      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)

      canvas.toBlob(
        (blob) => {
          setIsCompressing(false)

          if (!blob) {
            setError('Sorry, this image could not be compressed.')
            return
          }

          if (compressedUrl) URL.revokeObjectURL(compressedUrl)

          setCompressedUrl(URL.createObjectURL(blob))
          setCompressedSize(blob.size)
        },
        'image/jpeg',
        quality
      )
    }

    image.onerror = () => {
      setIsCompressing(false)
      setError('Could not load this image. Please try another file.')
    }

    image.src = previewUrl
  }

  const downloadImage = () => {
    if (!compressedUrl) return

    const link = document.createElement('a')
    link.href = compressedUrl
    link.download = `compressed-${originalFile.name.replace(/\.[^/.]+$/, '')}.jpg`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const savings =
    originalFile && compressedSize
      ? Math.max(
          0,
          Math.round((1 - compressedSize / originalFile.size) * 100)
        )
      : 0

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

      <main>
        {/* Hero */}
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

        {/* Compressor */}
        <section id="compressor" className="mx-auto max-w-4xl px-6 pb-20">
          <div
            className="rounded-3xl border-2 border-dashed border-green-300 bg-white p-8 text-center shadow-sm transition hover:border-green-500 sm:p-14"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              handleFile(event.dataTransfer.files[0])
            }}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl">
              ↑
            </div>

            <h2 className="text-xl font-bold sm:text-2xl">
              {originalFile ? 'Image selected!' : 'Drop your image here'}
            </h2>

            <p className="mt-3 break-words text-sm text-gray-500">
              {originalFile
                ? `${originalFile.name} · ${formatSize(originalFile.size)}`
                : 'or click below to browse your files'}
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-7 rounded-xl bg-green-600 px-8 py-3.5 font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              Choose image
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => handleFile(event.target.files[0])}
            />

            <p className="mt-6 text-xs text-gray-400">
              JPG, PNG and WebP supported
            </p>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          {originalFile && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
              <label
                htmlFor="quality"
                className="flex items-center justify-between font-semibold"
              >
                <span>Compression quality</span>
                <span className="text-green-700">{Math.round(quality * 100)}%</span>
              </label>

              <input
                id="quality"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(event) => {
                  setQuality(Number(event.target.value))
                  setCompressedUrl('')
                  setCompressedSize(0)
                }}
                className="mt-4 w-full accent-green-600"
              />

              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>

              <button
                type="button"
                onClick={compressImage}
                disabled={isCompressing}
                className="mt-6 w-full rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCompressing ? 'Compressing…' : 'Compress image'}
              </button>
            </div>
          )}

          {compressedUrl && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-white p-6">
              <h3 className="text-lg font-bold">Compression complete!</h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Original size</p>
                  <p className="mt-1 text-xl font-bold">
                    {formatSize(originalFile.size)}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-sm text-gray-500">Compressed size</p>
                  <p className="mt-1 text-xl font-bold text-green-700">
                    {formatSize(compressedSize)}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                {savings > 0
                  ? `Your image is ${savings}% smaller.`
                  : 'This version is not smaller than the original. Try a lower quality setting.'}
              </p>

              <button
                type="button"
                onClick={downloadImage}
                className="mt-5 w-full rounded-xl border border-green-600 px-6 py-3.5 font-semibold text-green-700 transition hover:bg-green-50"
              >
                Download compressed image
              </button>
            </div>
          )}

          <p className="mt-5 text-center text-sm text-gray-400">
            Images are processed in your browser and are not uploaded to a server.
          </p>
        </section>

        {/* Features */}
        <section id="features" className="bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need to compress images
              </h2>
              <p className="mt-3 text-gray-500">Less file size. Less hassle.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: '↘',
                  title: 'Smaller file sizes',
                  description: 'Reduce image sizes without unnecessarily sacrificing quality.',
                },
                {
                  icon: '◉',
                  title: 'Easy to use',
                  description: 'A simple interface that makes image compression straightforward.',
                },
                {
                  icon: '⌑',
                  title: 'Private processing',
                  description: 'Images are processed directly in your browser.',
                },
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
          <p className="text-sm text-gray-400">Built with care by halima.builds</p>
          <p className="text-xs text-gray-400">© 2026 ImageZip</p>
        </div>
      </footer>
    </div>
  )
}

export default App