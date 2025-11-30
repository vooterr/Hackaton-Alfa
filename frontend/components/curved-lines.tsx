"use client"

export function CurvedLines() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgb(239, 49, 36)", stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: "rgb(239, 49, 36)", stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgb(120, 120, 120)", stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: "rgb(120, 120, 120)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        <path
          d="M -100 200 Q 400 100 800 300 T 1600 200"
          stroke="url(#grad1)"
          strokeWidth="3"
          fill="none"
          className="animate-pulse"
          style={{ animationDuration: "4s" }}
        />

        <path
          d="M 200 -100 Q 600 300 1000 100 T 1800 400"
          stroke="url(#grad2)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />

        <path
          d="M 1600 100 Q 1200 400 800 200 T 0 500"
          stroke="url(#grad1)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        />
      </svg>
    </div>
  )
}
