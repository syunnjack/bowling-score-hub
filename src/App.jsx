import { useMemo, useState } from 'react'
import './App.css'

const postKey = 'bowling-score-hub.posts'
const savedKey = 'bowling-score-hub.saved'
const items = [
  {
    "id": "bowling-score-hub-1",
    "title": "名古屋エリアの大会掲示板",
    "category": "大会情報",
    "area": "名古屋",
    "summary": "地元ボウリング場で開催される大会・リーグ戦の情報をまとめる掲示板です。開催日程、参加費、エントリー方法などをみんなで投稿・共有できます。",
    "tags": ["大会", "名古屋"],
  },
  {
    "id": "bowling-score-hub-2",
    "title": "東京エリアのスコア記録",
    "category": "スコア日記",
    "area": "東京",
    "summary": "自分のスコアの推移を記録できる日記機能です。ゲームごとのスコア、使用したマイボール、レーンコンディションのメモを残せます。",
    "tags": ["スコア記録", "東京"],
  },
  {
    "id": "bowling-score-hub-3",
    "title": "大阪エリアの用具レビュー",
    "category": "用具レビュー",
    "area": "大阪",
    "summary": "マイボールやシューズなど、実際に使用した用具の感想を共有できるレビュー欄です。購入前の参考にどうぞ。",
    "tags": ["用具", "大阪"],
  },
]
const faq = [
  ['無料で使えますか？', 'はい、会員登録なしで無料でご利用いただけます。'],
  ['記録したスコアや投稿はどこに保存されますか？', 'ご利用の端末（ブラウザ）にのみ保存されます。他の端末とは共有されないため、機種変更やブラウザのデータ削除で消える点にご注意ください。'],
  ['対応エリアはどこですか？', '現在は名古屋・東京・大阪の例を掲載しています。投稿は全国どのエリアからでも可能です。'],
]

function readArray(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] } catch { return [] }
}

function App() {
  const [query, setQuery] = useState('名古屋')
  const [category, setCategory] = useState('すべて')
  const [posts, setPosts] = useState(() => readArray(postKey))
  const [saved, setSaved] = useState(() => readArray(savedKey))
  const [form, setForm] = useState({ title: '', category: '大会情報', body: '' })
  const categories = ['すべて', ...new Set(items.map((item) => item.category))]

  const filtered = useMemo(() => items.filter((item) => {
    const text = [item.title, item.category, item.area, item.summary, item.tags.join(' ')].join(' ')
    return text.includes(query) && (category === 'すべて' || item.category === category)
  }), [query, category])

  function saveItem(id) {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem(savedKey, JSON.stringify(next))
  }

  function submitPost(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    const next = [{ ...form, id: crypto.randomUUID(), date: new Date().toLocaleDateString('ja-JP') }, ...posts]
    setPosts(next)
    localStorage.setItem(postKey, JSON.stringify(next))
    setForm({ title: '', category: '大会情報', body: '' })
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <span className="brand">bowlscore.jp</span>
          <h1>ボウリングスコアハブ</h1>
          <p>週末ボウラーのためのスコア記録・大会掲示板・エリア別情報サイトです。自分のスコアを記録しながら、地元の大会情報や用具レビューをみんなと共有できます。</p>
        </div>
        <aside className="answer-box">
          <small>このサイトについて</small>
          <strong>会員登録なしで、今すぐ使えます。</strong>
          <p>スコアの記録・大会情報の閲覧投稿・用具レビューの共有まで、無料でご利用いただけます。</p>
        </aside>
      </section>

      <section className="search-panel" aria-label="検索条件">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="エリア・カテゴリで検索" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </section>

      <section className="summary-grid">
        <article><span>掲載カテゴリ数</span><strong>{items.length}</strong></article>
        <article><span>みんなの投稿</span><strong>{posts.length}</strong></article>
        <article><span>保存した投稿</span><strong>{saved.length}</strong></article>
      </section>

      <section className="content-grid">
        {filtered.map((item) => (
          <article className="card" key={item.id}>
            <div className="card-topline"><span>{item.area}</span><span>{item.category}</span></div>
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
            <div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <button type="button" onClick={() => saveItem(item.id)}>{saved.includes(item.id) ? '保存済み' : 'この投稿を保存'}</button>
          </article>
        ))}
      </section>

      <section className="ugc-section">
        <h2>みんなの投稿</h2>
        <p>大会情報、スコアの記録、用具レビュー、レーン情報などを投稿できます。</p>
        <form className="ugc-form" onSubmit={submitPost}>
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="投稿タイトル" />
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {["大会情報", "スコア日記", "用具レビュー", "レーン情報"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} placeholder="内容（大会詳細、スコア、感想など）" />
          <button>投稿</button>
        </form>
        <div className="post-grid">
          {posts.length === 0 && <p className="empty-text">まだ投稿はありません。</p>}
          {posts.map((post) => <article key={post.id}><b>{post.title}</b><p>{post.body}</p><small>{post.category} / {post.date}</small></article>)}
        </div>
      </section>

      <section className="seo-section">
        <h2>よくある質問</h2>
        <div className="faq-grid">
          {faq.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}
        </div>
      </section>
    </main>
  )
}

export default App
