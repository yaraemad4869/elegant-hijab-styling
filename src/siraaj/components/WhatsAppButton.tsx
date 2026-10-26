const WHATSAPP_NUMBER = '201212776701'

export default function WhatsAppButton() {
  return (
    <>
      <style>{`
        /* WhatsApp Button Container */
        .whatsapp-btn {
          animation: float 2.5s ease-in-out infinite;
          /* تعديل الموقع ليكون على اليمين */
          right: 1.25rem; /* تم زيادتها من 1.25rem إلى 1.8rem تقريباً لتعويض التكبير */
          left: auto;
        }

        /* Float animation - up and down */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        /* SVG Icon with wiggle animation */
        .whatsapp-btn svg {
          width: 30px;
          height: 30px;
          fill: #fff;
          animation: wiggle 0.8s ease-in-out infinite;
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(20deg);
          }
          50% {
            transform: rotate(0deg);
          }
          75% {
            transform: rotate(-20deg);
          }
        }

        /* Wave effects */
        .wave {
          position: absolute;
          border-radius: 50%;
          border: 2px solid #25D366;
          opacity: 0;
          pointer-events: none;
        }

        .wave-1 {
          width: 80px;
          height: 80px;
          animation: wavePulse 2s ease-out infinite;
        }

        .wave-2 {
          width: 100px;
          height: 100px;
          animation: wavePulse 2s ease-out 0.6s infinite;
        }

        @keyframes wavePulse {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        /* Hover effects */
        .whatsapp-btn:hover {
          /* التعديل هنا: إضافة translateX(-5px) لتحريكه 5 بكسل لليسار */
          transform: scale(1.1) translateX(-5px) !important;
        }

        .whatsapp-btn:hover svg {
          animation-play-state: paused;
        }

        .whatsapp-btn:hover .wave {
          animation-play-state: paused;
        }
      `}</style>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا على واتساب"
        className="fixed z-50 flex items-center justify-center rounded-full whatsapp-btn"
        style={{
          right: '1.8rem',
          bottom: '1.8rem',
          width: '60px',
          height: '60px',
          background: '#25D366',
          boxShadow: '0 0 0 10px rgba(37,211,102,0.18), 0 8px 24px rgba(37,211,102,0.35)',
        }}
      >
        {/* Wave effects */}
        <span className="wave wave-1"></span>
        <span className="wave wave-2"></span>

        {/* WhatsApp SVG Icon with wiggle animation */}
        <svg viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386"></path>
        </svg>
      </a>
    </>
  )
}