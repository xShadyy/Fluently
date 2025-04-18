
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch (err) {
    console.error('🚨 Invalid JSON body:', err);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { text, sourceLang, targetLang } = body;
  if (typeof text !== 'string' || !text.trim() || typeof targetLang !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid `text` / `targetLang`' },
      { status: 400 }
    );
  }

  const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
  if (!DEEPL_API_KEY) {
    console.error('🚨 DeepL API key not configured');
    return NextResponse.json({ error: 'DeepL API key not configured' }, { status: 500 });
  }

  const params = new URLSearchParams();
  params.append('auth_key', DEEPL_API_KEY);
  params.append('text', text);
  params.append('target_lang', targetLang.toUpperCase());

  if (sourceLang && sourceLang.toUpperCase() !== 'AUTO') {
    let sl = sourceLang.toUpperCase();
    if (sl === 'EN-GB' || sl === 'EN-US') sl = 'EN';
    params.append('source_lang', sl);
  }

  try {
    const res = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error('🛑 DeepL API error:', data);
      return NextResponse.json({ error: 'DeepL API error', details: data }, { status: res.status });
    }

    const translatedText = data.translations?.[0]?.text;
    if (typeof translatedText !== 'string') {
      console.error('🧐 Unexpected DeepL response shape:', data);
      return NextResponse.json({ error: 'Unexpected DeepL response' }, { status: 500 });
    }

    return NextResponse.json({ translatedText });
  } catch (err: any) {
    console.error('🚨 Error calling DeepL:', err);
    return NextResponse.json(
      { error: 'Translation failed', details: err.message },
      { status: 500 }
    );
  }
}
