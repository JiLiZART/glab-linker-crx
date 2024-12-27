import baseConfig from '@extension/tailwindcss-config';
import { withUI } from '@extension/ui';

export default withUI({
  ...baseConfig,
  content: ['src/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.arrow': {
          position: 'absolute',
          width: '8px',
          height: '8px',
          transform: 'rotate(45deg)',
          backgroundColor: 'white',
        },
      });
    },
  ],
});
