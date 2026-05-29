export function BgOrbs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute -top-64 -left-64 h-[700px] w-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.628 0.258 29.23 / 18%) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />
      <div
        className="absolute -top-32 -right-48 h-[500px] w-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.72 0.19 50 / 12%) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.45 0.18 20 / 10%) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }}
      />
    </div>
  )
}
