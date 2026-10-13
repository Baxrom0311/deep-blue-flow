import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChatWidget from '@/components/chat/ChatWidget';
import { api } from '@/lib/api';

vi.mock('@/contexts/LangContext', () => ({ useLang: () => ({ lang: 'uz' }) }));
vi.mock('@/contexts/SettingsContext', () => ({ useSettings: () => ({}) }));
vi.mock('@/lib/api', () => ({ api: { chat: vi.fn() } }));

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);

function openChat() {
  render(<QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}><ChatWidget /></QueryClientProvider>);
  fireEvent.click(screen.getByRole('button', { name: 'ECO Yordamchi 💧' }));
  return screen.getByRole('textbox');
}
function send(input: HTMLElement, text: string) {
  fireEvent.change(input, { target: { value: text } });
  fireEvent.submit(input.closest('form')!);
}

describe('chat conversation', () => {
  it('uses the server session for subsequent messages', async () => {
    vi.mocked(api.chat).mockResolvedValue({ reply: 'Salom!', session_id: 'server-session' });
    const input = openChat();
    send(input, 'Salom');
    await screen.findByText('Salom!');
    expect(api.chat).toHaveBeenNthCalledWith(1, 'Salom', null);
    expect(sessionStorage.getItem('eco-chat-session')).toBe('server-session');
    send(input, 'Mahsulotlar haqida');
    await waitFor(() => expect(api.chat).toHaveBeenNthCalledWith(2, 'Mahsulotlar haqida', 'server-session'));
  });
  it('does not submit two messages while the first reply is pending', async () => {
    vi.mocked(api.chat).mockReturnValue(new Promise(() => undefined));
    const input = openChat();
    send(input, 'First');
    send(input, 'Second');
    await waitFor(() => expect(api.chat).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button', { name: 'Yuborish' })).toBeDisabled();
  });
});
