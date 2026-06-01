import { useNavigate, useLocation } from 'react-router-dom';
import { Typography } from '@wanteddev/wds';
import { IconHomeFill, IconPresentation } from '@wanteddev/wds-icon';

const NAV_ITEMS = [
  { label: '대시보드', path: '/dashboard', Icon: IconHomeFill },
  { label: '지출 분석', path: '/analytics', Icon: IconPresentation },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside
      style={{
        width: '220px',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--semantic-background-normal-normal)',
        borderRight: '1px solid var(--semantic-line-solid-normal)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderBottom: '1px solid var(--semantic-line-solid-normal)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        onClick={() => navigate('/dashboard')}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0066FF 0%, #4D94FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: 'white', fontSize: '13px', fontWeight: '800' }}>
            G
          </span>
        </div>
        <Typography
          variant="title3"
          weight="bold"
          color="semantic.label.normal"
          style={{ marginLeft: '8px' }}
        >
          Gudocs
        </Typography>
      </div>

      {/* Nav items */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {NAV_ITEMS.map(({ label, path, Icon }) => {
          const active = pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '2px',
                backgroundColor: active
                  ? 'rgba(0,102,255,0.08)'
                  : 'transparent',
                color: active ? '#0066FF' : 'var(--semantic-label-normal)',
                fontFamily: 'Pretendard, sans-serif',
                fontSize: '14px',
                fontWeight: active ? '600' : '400',
                transition: 'background 0.15s',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!active)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'var(--semantic-background-normal-alternative)';
              }}
              onMouseLeave={(e) => {
                if (!active)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'transparent';
              }}
            >
              <Icon width={18} height={18} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
