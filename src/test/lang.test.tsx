import { act, cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LangProvider, LangUrlSync, useLang } from '@/contexts/LangContext';

let navigate: ReturnType<typeof useNavigate>;
let setLang: (l: 'uz' | 'ru' | 'en') => void;

const Probe = () => {
  const location = useLocation();
  const ctx = useLang();
  navigate = useNavigate();
  setLang = ctx.setLang;
  return <div data-testid="state">{`${ctx.lang} ${location.pathname}${location.search}`}</div>;
};

const renderAt = (url: string) => {
  window.history.replaceState(null, '', url);
  render(
    <LangProvider>
      <MemoryRouter initialEntries={[url]}>
        <LangUrlSync />
        <Probe />
      </MemoryRouter>
    </LangProvider>,
  );
};
const state = () => screen.getByTestId('state').textContent;

beforeEach(() => globalThis.localStorage?.clear?.());
afterEach(() => {
  cleanup();
  window.history.replaceState(null, '', '/');
});

describe('language in URL', () => {
  it('reads ?lang= on first load', () => {
    renderAt('/about?lang=ru');
    expect(state()).toBe('ru /about?lang=ru');
  });

  it('keeps the selected language when following plain internal links', () => {
    renderAt('/about?lang=en');
    act(() => navigate('/products'));
    expect(state()).toBe('en /products?lang=en');
  });

  it('switching language updates the URL, and uz has no parameter', () => {
    renderAt('/contact');
    act(() => setLang('ru'));
    expect(state()).toBe('ru /contact?lang=ru');
    act(() => setLang('uz'));
    expect(state()).toBe('uz /contact');
  });

  it('an explicit ?lang= link switches the language', () => {
    renderAt('/?lang=ru');
    act(() => navigate('/gallery?lang=en'));
    expect(state()).toBe('en /gallery?lang=en');
  });

  it('drops an invalid language parameter', () => {
    renderAt('/about?lang=xx');
    expect(state()).toBe('uz /about');
  });
});
